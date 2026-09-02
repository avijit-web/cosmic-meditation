import type { Feature, FeatureCollection, Geometry } from "geojson";

export type CountryFeature = Feature<Geometry, { name: string }>;

let cache: Promise<CountryFeature[]> | null = null;

/**
 * Country polygons, loaded lazily so the ~105 KB topology never lands in the
 * initial bundle. `world-atlas` ships with Natural Earth 110m data, which is
 * low-poly enough to render as a flat cartoon world.
 */
export function loadCountries(): Promise<CountryFeature[]> {
  if (!cache) {
    cache = (async () => {
      const [topoModule, topojson] = await Promise.all([
        import("world-atlas/countries-110m.json"),
        import("topojson-client"),
      ]);

      const topology = (topoModule.default ??
        topoModule) as unknown as Parameters<typeof topojson.feature>[0];

      const collection = topojson.feature(
        topology,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (topology as any).objects.countries,
      ) as unknown as FeatureCollection<Geometry, { name: string }>;

      return collection.features;
    })();
  }
  return cache;
}

export function findCountry(
  features: CountryFeature[],
  atlasName: string,
): CountryFeature | undefined {
  return features.find((f) => f.properties?.name === atlasName);
}
