import { CountryMarker, Participant } from "../types";

/**
 * Copy and grouping helpers for participants.
 *
 * The participants themselves are no longer a fixed list — every session draws
 * its own circle from `COUNTRY_POOL` (see ./session.ts), so the only things
 * that live here are the bits that don't change between sessions.
 */

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
 * Two groups can share a country (you and a later arrival can both be from the
 * same place), and stacking two pills on the same spot just looks broken.
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
