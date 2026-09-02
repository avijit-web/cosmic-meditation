/**
 * Orbit maths for the participant stars.
 *
 * Every star rides its own inclined circular orbit around the globe. We keep
 * this in plain screen space (rather than inside the WebGL scene) so the stars
 * can be real DOM nodes — that makes the "fly to the centre" finale and the
 * hand-off from the big meditation orb trivial to animate.
 */

export interface OrbitSeed {
  /** Radius as a multiple of the globe's on-screen radius. */
  radius: number;
  /** Radians per second. Signed, so orbits run both ways. */
  speed: number;
  /** Starting angle. */
  phase: number;
  /** Orbit-plane tilt about the screen X axis. */
  tiltX: number;
  /** Orbit-plane tilt about the screen Z axis. */
  tiltZ: number;
  /** Base pixel size of the star. */
  size: number;
}

export interface OrbitPoint {
  x: number;
  y: number;
  /** -1 (far side of the globe) → 1 (nearest the viewer). */
  depth: number;
  scale: number;
  opacity: number;
}

/** Deterministic 0..1 hash. Nothing here may call Math.random(). */
function hash(index: number, salt: number): number {
  const x = Math.sin((index + 1) * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Golden angle — spreads starting positions evenly around the ring. */
const GOLDEN_ANGLE = 2.399963229728653;

/**
 * Deterministic orbit parameters for the nth star.
 *
 * `tiltX` is deliberately kept well away from both 0 and 90 degrees: at 0 the
 * ring is edge-on and the star just slides through the middle of the globe, and
 * at 90 it sits flat in the screen plane with no depth at all. Between roughly
 * 40 and 77 degrees you get a near-circular path that still passes convincingly
 * in front of and behind the world.
 */
export function makeOrbitSeed(index: number): OrbitSeed {
  const r = (salt: number) => hash(index, salt);

  const tiltMagnitude = 0.72 + r(5) * 0.62; // ~41deg .. ~77deg

  return {
    radius: 1.22 + r(1) * 0.34,
    speed: (0.07 + r(2) * 0.08) * (r(3) < 0.5 ? -1 : 1),
    phase: index * GOLDEN_ANGLE + r(4) * 0.9,
    tiltX: r(6) < 0.5 ? tiltMagnitude : -tiltMagnitude,
    tiltZ: r(7) * Math.PI * 2,
    size: 5 + r(8) * 4,
  };
}

/**
 * Re-phases an orbit so the star is on the near side of the globe at the moment
 * it joins.
 *
 * Without this, the beat that announces someone can land while their star is
 * hidden behind the world — the one moment it really needs to be visible.
 * Arrivals are also fanned across the visible arc so a group of four doesn't
 * stack on the same spot.
 */
export function orientForArrival(
  seed: OrbitSeed,
  bornAt: number,
  index: number,
): OrbitSeed {
  // depth = sin(angle) * cos(tiltX), so the near side flips with the tilt.
  const nearSide = Math.cos(seed.tiltX) >= 0 ? 1 : -1;
  const spread = 0.22 + ((index * 0.37) % 1) * 0.56;
  const arrivalAngle = nearSide * spread * Math.PI;

  return { ...seed, phase: arrivalAngle - bornAt * seed.speed };
}

/**
 * Pushes an orbit far enough out that it always clears the globe's disc.
 *
 * Used for your own star, which must stay findable during "this is you".
 */
export function widenOrbit(seed: OrbitSeed, radius: number): OrbitSeed {
  return { ...seed, radius: Math.max(seed.radius, radius) };
}

/**
 * Position of a star at time `t`, given the globe's current on-screen radius.
 *
 * The orbit is a unit circle in the XZ plane, tilted twice, then projected
 * orthographically — Z becomes the depth cue that dims and shrinks stars
 * passing behind the globe.
 */
export function orbitAt(
  seed: OrbitSeed,
  t: number,
  globeRadius: number,
): OrbitPoint {
  const a = seed.phase + t * seed.speed;
  const r = seed.radius * globeRadius;

  let x = Math.cos(a) * r;
  let y = 0;
  let z = Math.sin(a) * r;

  // tilt about X
  const cx = Math.cos(seed.tiltX);
  const sx = Math.sin(seed.tiltX);
  [y, z] = [y * cx - z * sx, y * sx + z * cx];

  // tilt about Z
  const cz = Math.cos(seed.tiltZ);
  const sz = Math.sin(seed.tiltZ);
  [x, y] = [x * cz - y * sz, x * sz + y * cz];

  const depth = r === 0 ? 0 : z / r;

  return {
    x,
    y: -y,
    depth,
    // Mild perspective so the near side reads as closer, and a continuous
    // fade so stars dim smoothly as they slip behind the globe.
    scale: 0.78 + (depth + 1) * 0.22,
    opacity: 0.35 + (depth + 1) * 0.325,
  };
}

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInCubic = (t: number) => t * t * t;
export const easeInOutSine = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2;

export function ease(kind: "linear" | "in" | "out" | "inOut", t: number) {
  switch (kind) {
    case "in":
      return easeInCubic(t);
    case "out":
      return easeOutCubic(t);
    case "inOut":
      return easeInOutSine(t);
    default:
      return t;
  }
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
