"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { findCountryInfo } from "../data/countries";

/**
 * Where the visitor is, as an ISO-3166 alpha-2 code ("IN", "US", …).
 *
 * `undefined` while the lookup is in flight, `null` once it has failed or come
 * back with somewhere we don't have in the pool. Consumers should treat both
 * as "use the default".
 */
type VisitorCountry = string | null | undefined;

const CountryContext = createContext<VisitorCountry>(undefined);

const STORAGE_KEY = "visitor-country";

/**
 * ipinfo token. Override with NEXT_PUBLIC_IPINFO_TOKEN; this is a client-side
 * call, so whatever value is used ends up in the bundle either way.
 */
const IPINFO_TOKEN =
  process.env.NEXT_PUBLIC_IPINFO_TOKEN ?? "5a067e9e5707ba";

/** Any client component under the provider can call this instead of taking a prop. */
export function useCountry(): VisitorCountry {
  return useContext(CountryContext);
}

export default function CountryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [country, setCountry] = useState<VisitorCountry>(undefined);

  useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      // Cache per tab so revisits and navigations don't re-hit the API.
      try {
        const cached = sessionStorage.getItem(STORAGE_KEY);
        if (cached) return cached === "unknown" ? null : cached;
      } catch {
        // Storage can be blocked (private mode, embedded views) — just look it up.
      }

      const res = await fetch("https://api.ipinfo.io/lite/me", {
        headers: { authorization: `Bearer ${IPINFO_TOKEN}` },
      });
      const data: { country_code?: string; country?: string } | null = res.ok
        ? await res.json()
        : null;

      // ipinfo Lite reports both the code and the name; accept either so a
      // plan change on their side doesn't silently break us.
      const match =
        findCountryInfo(data?.country_code) ?? findCountryInfo(data?.country);
      const code = match?.code ?? null;

      try {
        sessionStorage.setItem(STORAGE_KEY, code ?? "unknown");
      } catch {
        // Same as above — a cache miss is not an error.
      }
      return code;
    };

    resolve()
      // Fail silently; the experience falls back to its default country.
      .catch(() => null)
      .then((code) => {
        if (!cancelled) setCountry(code);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <CountryContext.Provider value={country}>{children}</CountryContext.Provider>
  );
}
