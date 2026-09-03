/**
 * The pool of places a session's circle is drawn from.
 *
 * `code` is the ISO-3166 alpha-2 code ipinfo reports, `atlasName` is the exact
 * `world-atlas` name used to find the polygon we light up, and `label` is what
 * people read. Coordinates are rough centroids — the pill just needs to sit on
 * the right country.
 */
export interface CountryInfo {
  code: string;
  label: string;
  atlasName: string;
  lat: number;
  lng: number;
}

export const COUNTRY_POOL: CountryInfo[] = [
  { code: "IN", label: "India", atlasName: "India", lat: 22.0, lng: 79.0 },
  { code: "US", label: "United States", atlasName: "United States of America", lat: 39.5, lng: -98.5 },
  { code: "GB", label: "United Kingdom", atlasName: "United Kingdom", lat: 54.0, lng: -2.5 },
  { code: "DE", label: "Germany", atlasName: "Germany", lat: 51.2, lng: 10.4 },
  { code: "FR", label: "France", atlasName: "France", lat: 46.6, lng: 2.4 },
  { code: "ES", label: "Spain", atlasName: "Spain", lat: 40.3, lng: -3.7 },
  { code: "IT", label: "Italy", atlasName: "Italy", lat: 42.8, lng: 12.6 },
  { code: "NL", label: "Netherlands", atlasName: "Netherlands", lat: 52.2, lng: 5.5 },
  { code: "SE", label: "Sweden", atlasName: "Sweden", lat: 62.0, lng: 16.0 },
  { code: "NO", label: "Norway", atlasName: "Norway", lat: 62.5, lng: 9.0 },
  { code: "FI", label: "Finland", atlasName: "Finland", lat: 64.0, lng: 26.0 },
  { code: "DK", label: "Denmark", atlasName: "Denmark", lat: 56.0, lng: 9.7 },
  { code: "BE", label: "Belgium", atlasName: "Belgium", lat: 50.6, lng: 4.6 },
  { code: "PL", label: "Poland", atlasName: "Poland", lat: 52.0, lng: 19.3 },
  { code: "PT", label: "Portugal", atlasName: "Portugal", lat: 39.6, lng: -8.0 },
  { code: "IE", label: "Ireland", atlasName: "Ireland", lat: 53.3, lng: -8.0 },
  { code: "CH", label: "Switzerland", atlasName: "Switzerland", lat: 46.8, lng: 8.2 },
  { code: "AT", label: "Austria", atlasName: "Austria", lat: 47.6, lng: 14.1 },
  { code: "CZ", label: "Czechia", atlasName: "Czechia", lat: 49.8, lng: 15.5 },
  { code: "GR", label: "Greece", atlasName: "Greece", lat: 39.1, lng: 22.0 },
  { code: "RO", label: "Romania", atlasName: "Romania", lat: 45.9, lng: 25.0 },
  { code: "TR", label: "Turkey", atlasName: "Turkey", lat: 39.0, lng: 35.2 },
  { code: "UA", label: "Ukraine", atlasName: "Ukraine", lat: 49.0, lng: 31.5 },
  { code: "RU", label: "Russia", atlasName: "Russia", lat: 58.0, lng: 60.0 },
  { code: "EG", label: "Egypt", atlasName: "Egypt", lat: 26.8, lng: 30.8 },
  { code: "MA", label: "Morocco", atlasName: "Morocco", lat: 31.8, lng: -7.1 },
  { code: "NG", label: "Nigeria", atlasName: "Nigeria", lat: 9.1, lng: 8.7 },
  { code: "GH", label: "Ghana", atlasName: "Ghana", lat: 7.9, lng: -1.0 },
  { code: "KE", label: "Kenya", atlasName: "Kenya", lat: 0.5, lng: 37.9 },
  { code: "ET", label: "Ethiopia", atlasName: "Ethiopia", lat: 9.1, lng: 40.5 },
  { code: "ZA", label: "South Africa", atlasName: "South Africa", lat: -29.0, lng: 25.0 },
  { code: "SA", label: "Saudi Arabia", atlasName: "Saudi Arabia", lat: 24.0, lng: 45.0 },
  { code: "AE", label: "United Arab Emirates", atlasName: "United Arab Emirates", lat: 24.0, lng: 54.0 },
  { code: "IL", label: "Israel", atlasName: "Israel", lat: 31.4, lng: 35.0 },
  { code: "IR", label: "Iran", atlasName: "Iran", lat: 32.5, lng: 53.7 },
  { code: "PK", label: "Pakistan", atlasName: "Pakistan", lat: 30.4, lng: 69.3 },
  { code: "BD", label: "Bangladesh", atlasName: "Bangladesh", lat: 23.7, lng: 90.4 },
  { code: "LK", label: "Sri Lanka", atlasName: "Sri Lanka", lat: 7.9, lng: 80.7 },
  { code: "NP", label: "Nepal", atlasName: "Nepal", lat: 28.4, lng: 84.1 },
  { code: "CN", label: "China", atlasName: "China", lat: 35.0, lng: 104.0 },
  { code: "JP", label: "Japan", atlasName: "Japan", lat: 36.5, lng: 138.0 },
  { code: "KR", label: "South Korea", atlasName: "South Korea", lat: 36.5, lng: 127.9 },
  { code: "TH", label: "Thailand", atlasName: "Thailand", lat: 15.8, lng: 101.0 },
  { code: "VN", label: "Vietnam", atlasName: "Vietnam", lat: 16.0, lng: 107.5 },
  { code: "ID", label: "Indonesia", atlasName: "Indonesia", lat: -2.5, lng: 118.0 },
  { code: "MY", label: "Malaysia", atlasName: "Malaysia", lat: 4.2, lng: 102.0 },
  { code: "PH", label: "Philippines", atlasName: "Philippines", lat: 12.9, lng: 122.0 },
  { code: "AU", label: "Australia", atlasName: "Australia", lat: -25.0, lng: 134.0 },
  { code: "NZ", label: "New Zealand", atlasName: "New Zealand", lat: -41.5, lng: 172.5 },
  { code: "CA", label: "Canada", atlasName: "Canada", lat: 56.0, lng: -106.0 },
  { code: "MX", label: "Mexico", atlasName: "Mexico", lat: 23.6, lng: -102.5 },
  { code: "BR", label: "Brazil", atlasName: "Brazil", lat: -10.3, lng: -52.0 },
  { code: "AR", label: "Argentina", atlasName: "Argentina", lat: -34.0, lng: -64.0 },
  { code: "CL", label: "Chile", atlasName: "Chile", lat: -35.0, lng: -71.0 },
  { code: "CO", label: "Colombia", atlasName: "Colombia", lat: 4.6, lng: -74.1 },
  { code: "PE", label: "Peru", atlasName: "Peru", lat: -9.2, lng: -75.0 },
];

/** Where you're placed when the lookup fails or returns somewhere unknown. */
export const DEFAULT_COUNTRY_CODE = "IN";

export function findCountryInfo(codeOrName: string | null | undefined): CountryInfo | undefined {
  if (!codeOrName) return undefined;
  const needle = codeOrName.trim().toLowerCase();
  return COUNTRY_POOL.find(
    (c) =>
      c.code.toLowerCase() === needle ||
      c.label.toLowerCase() === needle ||
      c.atlasName.toLowerCase() === needle,
  );
}
