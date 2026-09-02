import type { Position } from "geojson";
import type { CountryFeature } from "./countries";

const WIDTH = 2048;
const HEIGHT = 1024;

const OCEAN_TOP = "#5cb8e8";
const OCEAN_MID = "#3f9ed6";
const OCEAN_DEEP = "#2f83bd";
const LAND = "#8ed24f";
const LAND_SHADE = "#79bb3f";

/**
 * Paints a flat, storybook equirectangular earth onto a canvas and returns it
 * as a data URL for `globeImageUrl`.
 *
 * Generating it locally (rather than shipping a photographic texture) keeps the
 * route fully offline and gives the soft cartoon look the rest of the scene
 * wants. Called once per session — the highlighted country is a separate
 * polygon layer, not a texture repaint.
 */
export function buildGlobeTexture(countries: CountryFeature[]): string {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  paintOcean(ctx);

  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = LAND_SHADE;
  ctx.lineWidth = 5;
  ctx.fillStyle = LAND;

  // Stroke first, then fill on top: cheap way to get the slightly embossed
  // edge that flat-illustration globes have.
  for (const feature of countries) {
    for (const path of polygonPaths(feature)) {
      ctx.beginPath();
      for (const ring of path) {
        ring.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.closePath();
      }
      ctx.stroke();
      ctx.fill("evenodd");
    }
  }

  return canvas.toDataURL("image/png");
}

function paintOcean(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, OCEAN_DEEP);
  gradient.addColorStop(0.32, OCEAN_TOP);
  gradient.addColorStop(0.6, OCEAN_MID);
  gradient.addColorStop(1, OCEAN_DEEP);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function project(lng: number, lat: number): [number, number] {
  return [((lng + 180) / 360) * WIDTH, ((90 - lat) / 180) * HEIGHT];
}

/**
 * Projects every ring of a (Multi)Polygon into canvas space.
 *
 * Rings that straddle the antimeridian are re-wrapped into one continuous span
 * and emitted twice — once in place, once shifted a full map-width left — so
 * Russia and Fiji don't smear a stripe across the whole texture.
 */
function polygonPaths(feature: CountryFeature): [number, number][][][] {
  const geometry = feature.geometry;
  const polygons: Position[][][] =
    geometry.type === "Polygon"
      ? [geometry.coordinates as Position[][]]
      : geometry.type === "MultiPolygon"
        ? (geometry.coordinates as Position[][][])
        : [];

  const paths: [number, number][][][] = [];

  for (const rings of polygons) {
    const wrapped = straddlesAntimeridian(rings);

    const projected = rings.map((ring) =>
      ring.map(([lng, lat]) =>
        project(wrapped && lng < 0 ? lng + 360 : lng, lat),
      ),
    );

    paths.push(projected);

    if (wrapped) {
      paths.push(
        projected.map((ring) =>
          ring.map(([x, y]) => [x - WIDTH, y] as [number, number]),
        ),
      );
    }
  }

  return paths;
}

/** True when a polygon's longitudes span more than half the world. */
function straddlesAntimeridian(rings: Position[][]): boolean {
  let min = Infinity;
  let max = -Infinity;
  for (const ring of rings) {
    for (const [lng] of ring) {
      if (lng < min) min = lng;
      if (lng > max) max = lng;
    }
  }
  return max - min > 180;
}
