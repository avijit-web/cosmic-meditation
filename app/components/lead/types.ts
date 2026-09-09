/**
 * One submission of the lead form. Nothing is persisted on the client — the
 * form logs this object and hands it to its host; an API call goes there later.
 */
export interface Lead {
  fullName: string;
  email: string;
  country: string;
  countryIso: string;
  dialCode: string;
  /** National number, digits only. */
  phone: string;
  /** E.164, e.g. "+447911123456". */
  fullPhone: string;
  /** ISO timestamp of when the form was submitted. */
  capturedAt: string;
}
