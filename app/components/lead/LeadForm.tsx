"use client";

import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js/min";
import styles from "./leadForm.module.css";
import { DEFAULT_DIAL_ISO, DIAL_BY_ISO, DIAL_CODES } from "./dialCodes";
import type { Lead } from "./types";
import { submitLead } from "./submitLead";

interface Values {
  fullName: string;
  email: string;
  countryIso: string;
  phone: string;
}

type Field = keyof Values;
type Errors = Partial<Record<Field, string>>;

const EMPTY: Values = {
  fullName: "",
  email: "",
  countryIso: DEFAULT_DIAL_ISO,
  phone: "",
};

// Deliberately loose: it rejects obvious typos, not unusual-but-real addresses.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Letters from any script, spaces, apostrophes, hyphens and dots.
const NAME_RE = /^[\p{L}\p{M}' .-]+$/u;

/** Everything the reader might type into a phone field that isn't a digit. */
const stripPhone = (raw: string) => raw.replace(/[\s()\-.]/g, "");

function validate(v: Values): Errors {
  const errors: Errors = {};

  const name = v.fullName.trim();
  if (!name) errors.fullName = "we'd love to know your name";
  else if (name.length < 2) errors.fullName = "a little longer, lovely";
  else if (!NAME_RE.test(name)) errors.fullName = "letters only, please";

  const email = v.email.trim();
  if (!email) errors.email = "your email, so we can find you";
  else if (!EMAIL_RE.test(email)) errors.email = "that email doesn't look quite right";

  const country = DIAL_BY_ISO[v.countryIso];
  if (!country) errors.countryIso = "pick your country";

  const phone = stripPhone(v.phone);
  if (!phone) errors.phone = "and a number to reach you on";
  else if (!/^\d+$/.test(phone)) errors.phone = "digits only, please";
  // Checked against the chosen country's real numbering plan, so a 9-digit
  // Indian mobile or a US number with the wrong area code is caught here.
  else if (country && !isValidPhoneNumber(phone, country.iso))
    errors.phone = `that doesn't look like a number from ${country.name}`;

  return errors;
}

interface LeadFormProps {
  /**
   * Called once the values pass validation and the webhook has been called.
   * Fires even if the webhook failed — a network blip must never block the
   * reader; the failure is logged instead.
   */
  onSubmit: (lead: Lead) => void;
  submitLabel?: string;
  className?: string;
  /** Which surface the lead came from; sent along to the webhook. */
  source?: "debalina" | "connected" | "meditation";
}

/**
 * The single lead form used everywhere a visitor introduces themselves: the
 * newsletter section, and the gate in front of both meditations. It never
 * persists anything — every submission is logged and passed up, that's all.
 *
 * Colours and type come from CSS variables set by whichever surface hosts it
 * (see leadForm.module.css), so the same markup reads as maroon-and-cream on
 * the landing page and glass-on-night inside the games.
 */
export function LeadForm({
  onSubmit,
  submitLabel = "Join ✦",
  className,
  source = "debalina",
}: LeadFormProps) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const errors = validate(values);
  // Errors only appear once a field has been visited, or once the reader has
  // tried to submit — never while they're still typing a fresh form.
  const shown = (field: Field) =>
    (touched[field] || submitted) && errors[field] ? errors[field] : undefined;

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const onBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name as Field;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0 || sending) return;

    const country = DIAL_BY_ISO[values.countryIso];
    // Validation already passed, so this parses; it also normalises things
    // like a leading trunk "0" that "+44" + raw digits would get wrong.
    const parsed = parsePhoneNumber(stripPhone(values.phone), country.iso);

    const lead: Lead = {
      fullName: values.fullName.trim(),
      email: values.email.trim().toLowerCase(),
      country: country.name,
      countryIso: country.iso,
      dialCode: country.dial,
      phone: parsed.nationalNumber,
      fullPhone: parsed.number, // E.164
      capturedAt: new Date().toISOString(),
    };

    // Nothing is stored client-side; the lead goes straight to the n8n webhook.
    setSending(true);
    await submitLead(lead, source);
    setSending(false);
    onSubmit(lead);
  };

  return (
    <form
      className={`${styles.form}${className ? ` ${className}` : ""}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className={styles.field} data-invalid={Boolean(shown("fullName"))}>
        <input
          type="text"
          name="fullName"
          autoComplete="name"
          placeholder="your full name…"
          aria-label="Full name"
          aria-invalid={Boolean(shown("fullName"))}
          value={values.fullName}
          onChange={onChange}
          onBlur={onBlur}
        />
        {shown("fullName") && (
          <span className={styles.error} role="alert">
            {shown("fullName")}
          </span>
        )}
      </div>

      <div className={styles.field} data-invalid={Boolean(shown("email"))}>
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="your email, lovely…"
          aria-label="Email address"
          aria-invalid={Boolean(shown("email"))}
          value={values.email}
          onChange={onChange}
          onBlur={onBlur}
        />
        {shown("email") && (
          <span className={styles.error} role="alert">
            {shown("email")}
          </span>
        )}
      </div>

      <div
        className={`${styles.field} ${styles.phoneRow}`}
        data-invalid={Boolean(shown("phone") || shown("countryIso"))}
      >
        <select
          name="countryIso"
          aria-label="Country code"
          value={values.countryIso}
          onChange={onChange}
          onBlur={onBlur}
        >
          {DIAL_CODES.map((c) => (
            <option key={c.iso} value={c.iso}>
              {c.dial} {c.name}
            </option>
          ))}
        </select>
        <input
          type="tel"
          name="phone"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="your number…"
          aria-label="Phone number"
          aria-invalid={Boolean(shown("phone"))}
          value={values.phone}
          onChange={onChange}
          onBlur={onBlur}
        />
        {(shown("phone") || shown("countryIso")) && (
          <span className={styles.error} role="alert">
            {shown("phone") ?? shown("countryIso")}
          </span>
        )}
      </div>

      <button type="submit" disabled={sending} aria-busy={sending}>
        {sending ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
