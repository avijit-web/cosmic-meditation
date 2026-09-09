import { countries } from "countries-list";
import {
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js/min";

/**
 * Every country with a calling code, for the lead form's phone field.
 *
 * Calling codes come from libphonenumber (Google's phone-number metadata), so
 * the list is complete and stays current with the package. Names come from
 * `countries-list` rather than `Intl.DisplayNames`: the latter spells some
 * countries differently in Node than in the browser (ICU versions drift), and
 * that mismatch broke hydration. A static table renders identically on both
 * sides. India first because that's where most readers are; the rest
 * alphabetical.
 */
export interface DialCode {
  /** ISO-3166 alpha-2, used as the option value. */
  iso: CountryCode;
  name: string;
  /** With the leading "+". */
  dial: string;
}

export const DEFAULT_DIAL_ISO: CountryCode = "IN";

function nameOf(iso: CountryCode): string {
  return (countries as Record<string, { name: string } | undefined>)[iso]?.name ?? iso;
}

export const DIAL_CODES: DialCode[] = getCountries()
  .map((iso) => ({
    iso,
    name: nameOf(iso),
    dial: `+${getCountryCallingCode(iso)}`,
  }))
  .sort((a, b) => {
    if (a.iso === DEFAULT_DIAL_ISO) return -1;
    if (b.iso === DEFAULT_DIAL_ISO) return 1;
    return a.name.localeCompare(b.name, "en");
  });

export const DIAL_BY_ISO: Record<string, DialCode> = Object.fromEntries(
  DIAL_CODES.map((c) => [c.iso, c]),
);
