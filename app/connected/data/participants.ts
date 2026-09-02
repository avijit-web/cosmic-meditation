import { CountryMarker, Participant } from "../types";

/**
 * Static stand-in for the realtime presence feed.
 *
 * The circle is split in two:
 *  - `INITIAL_COHORT` is already breathing when you arrive, and is revealed all
 *    at once on the "everyone" beat.
 *  - `ARRIVALS` turn up mid-session, one announcement at a time, woven into the
 *    breath rather than interrupting it.
 *
 * Swap these arrays for a socket payload later — everything downstream only
 * reads `PARTICIPANTS_BY_ID`.
 */

export const YOU: Participant = {
  id: "you",
  label: "India",
  atlasName: "India",
  lat: 22.0,
  lng: 79.0,
  count: 1,
  isYou: true,
};

export const INITIAL_COHORT: Participant[] = [
  {
    id: "us",
    label: "United States",
    atlasName: "United States of America",
    lat: 39.5,
    lng: -98.5,
    count: 2,
  },
  {
    id: "de",
    label: "Germany",
    atlasName: "Germany",
    lat: 51.2,
    lng: 10.4,
    count: 1,
  },
  {
    id: "br",
    label: "Brazil",
    atlasName: "Brazil",
    lat: -10.3,
    lng: -52.0,
    count: 1,
  },
  {
    id: "eg",
    label: "Egypt",
    atlasName: "Egypt",
    lat: 26.8,
    lng: 30.8,
    count: 1,
  },
];

export const ARRIVALS: Participant[] = [
  {
    id: "jp",
    label: "Japan",
    atlasName: "Japan",
    lat: 36.5,
    lng: 138.0,
    count: 1,
  },
  {
    id: "in-more",
    label: "India",
    atlasName: "India",
    lat: 22.0,
    lng: 79.0,
    count: 3,
  },
];

export const PARTICIPANTS: Participant[] = [
  YOU,
  ...INITIAL_COHORT,
  ...ARRIVALS,
];

export const PARTICIPANTS_BY_ID: Record<string, Participant> =
  Object.fromEntries(PARTICIPANTS.map((p) => [p.id, p]));

export const TOTAL_PARTICIPANTS = PARTICIPANTS.reduce(
  (sum, p) => sum + p.count,
  0,
);

/** Everyone already breathing when you join, you included. */
export const COHORT_SIZE =
  YOU.count + INITIAL_COHORT.reduce((sum, p) => sum + p.count, 0);

/** "Someone from X" reads better than "1 person from X". */
export function joinHeadline(p: Participant): string {
  return p.count === 1
    ? `Someone from ${p.label} just breathed in with you`
    : `${p.count} people from ${p.label} just breathed in with you`;
}

/** The matching exhale line, so a join never cuts the breath short. */
export function joinExhaleLine(p: Participant): string {
  return p.count === 1 ? "Now you both let it go" : "Now you all let it go";
}

/**
 * Collapses a set of participants into one pill per country.
 *
 * Two groups can share a country (you and the later arrivals are both in
 * India), and stacking two pills on the same spot just looks broken.
 */
export function toCountryMarkers(people: Participant[]): CountryMarker[] {
  const byCountry = new Map<string, { p: Participant; count: number }>();

  for (const p of people) {
    const existing = byCountry.get(p.atlasName);
    if (existing) existing.count += p.count;
    else byCountry.set(p.atlasName, { p, count: p.count });
  }

  return [...byCountry.values()].map(({ p, count }) => ({
    atlasName: p.atlasName,
    lat: p.lat,
    lng: p.lng,
    label: count > 1 ? `${p.label} (${count})` : p.label,
  }));
}
