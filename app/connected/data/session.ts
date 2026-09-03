import { Participant, ScriptStep } from "../types";
import {
  COUNTRY_POOL,
  CountryInfo,
  DEFAULT_COUNTRY_CODE,
  findCountryInfo,
} from "./countries";
import { GLOBE_STAR, buildScript } from "./script";

/**
 * Everything one run of the experience needs, generated fresh each time.
 *
 * There is no realtime layer: the circle is drawn at random from
 * `COUNTRY_POOL` so that every session looks like a different group of people
 * happened to be here. Only `you` is real — it comes from the visitor's IP.
 */
export interface BreathSession {
  you: Participant;
  /** Already breathing when you arrive; revealed together on the "everyone" beat. */
  cohort: Participant[];
  /** Turn up mid-session, one per breath. Always two (or fewer, never more). */
  arrivals: Participant[];
  byId: Record<string, Participant>;
  /** You plus the cohort. */
  cohortSize: number;
  /** Everyone, arrivals included — the closing tally. */
  total: number;

  script: ScriptStep[];
  /** Cumulative start time (seconds) of every step. */
  stepStartTimes: number[];
  /** Globe scale at the start of each step, for gap-free interpolation. */
  stepGlobeFrom: number[];
  /** Runtime excluding the open-ended completion screen. */
  sessionSeconds: number;
}

/** How many distinct countries make up the circle, you excluded. */
const MIN_COUNTRIES = 8;
const MAX_COUNTRIES = 12;
/** Chance the second arrival is more people from your own country. */
const HOMETOWN_ARRIVAL_CHANCE = 0.35;

export function buildSession(userCountry: string | null | undefined): BreathSession {
  const home =
    findCountryInfo(userCountry) ?? findCountryInfo(DEFAULT_COUNTRY_CODE)!;

  const you: Participant = {
    id: "you",
    ...asParticipantFields(home),
    count: 1,
    isYou: true,
  };

  // Draw the circle: 8–12 other countries, no repeats, never your own.
  const others = shuffle(COUNTRY_POOL.filter((c) => c.code !== home.code));
  const picked = others.slice(0, randomInt(MIN_COUNTRIES, MAX_COUNTRIES));

  // The last two picks arrive later; everyone else is already here.
  const arrivalPicks = picked.slice(-2);
  const cohortPicks = picked.slice(0, -2);

  const cohort: Participant[] = cohortPicks.map((c) => ({
    id: c.code.toLowerCase(),
    ...asParticipantFields(c),
    count: groupSize(),
  }));

  const arrivals: Participant[] = arrivalPicks.map((c, i) => {
    // Sometimes the second arrival is a few more people from where you are —
    // "3 people from India just breathed in with you" lands differently.
    const hometown = i === 1 && Math.random() < HOMETOWN_ARRIVAL_CHANCE;
    const place = hometown ? home : c;
    return {
      id: hometown ? `${home.code.toLowerCase()}-more` : c.code.toLowerCase(),
      ...asParticipantFields(place),
      count: hometown ? randomInt(2, 4) : groupSize(),
    };
  });

  const all = [you, ...cohort, ...arrivals];
  const byId = Object.fromEntries(all.map((p) => [p.id, p]));
  const cohortSize = you.count + sum(cohort);
  const total = cohortSize + sum(arrivals);

  const script = buildScript(cohortSize, arrivals);

  const stepStartTimes: number[] = [];
  let t = 0;
  for (const step of script) {
    stepStartTimes.push(t);
    t += step.duration;
  }

  const stepGlobeFrom = script.map((_, i) =>
    i === 0 ? GLOBE_STAR : script[i - 1].globeTo,
  );

  return {
    you,
    cohort,
    arrivals,
    byId,
    cohortSize,
    total,
    script,
    stepStartTimes,
    stepGlobeFrom,
    sessionSeconds: stepStartTimes[script.length - 1] ?? 0,
  };
}

// ------------------------------------------------------------------ helpers

function asParticipantFields(c: CountryInfo) {
  return { label: c.label, atlasName: c.atlasName, lat: c.lat, lng: c.lng };
}

/** Mostly solo, sometimes a pair, rarely three — like a real quiet room. */
function groupSize(): number {
  const r = Math.random();
  return r < 0.62 ? 1 : r < 0.9 ? 2 : 3;
}

function sum(people: Participant[]): number {
  return people.reduce((n, p) => n + p.count, 0);
}

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
