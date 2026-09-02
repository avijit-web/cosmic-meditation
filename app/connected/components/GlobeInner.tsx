"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods, type GlobeProps } from "react-globe.gl";
import {
  loadCountries,
  findCountry,
  type CountryFeature,
} from "../lib/countries";
import { buildGlobeTexture } from "../lib/globeTexture";
import type { CountryMarker } from "../types";

export interface GlobeView {
  /** Where to point the camera, or null to keep drifting on auto-rotate. */
  focus: { lat: number; lng: number } | null;
  /** Countries to light up, each with the pill that rides on it. */
  markers: CountryMarker[];
  /**
   * Auto-rotation rate (a full turn takes 60 / spinSpeed seconds). Wound up
   * for the beats that show the whole circle, barely moving otherwise.
   */
  spinSpeed?: number;
}

interface GlobeInnerProps {
  size: number;
  view: GlobeView;
  onReady?: () => void;
}

/** Camera distance, in globe radii above the surface. */
const ALTITUDE = 2.0;

/**
 * react-globe.gl types `GeoJsonGeometry.coordinates` as a flat number[], which
 * no real polygon satisfies. The runtime just forwards the geometry to
 * three-globe, so a cast at the boundary is the honest fix.
 */
const polygonGeometry = ((d: object) =>
  (d as CountryFeature).geometry) as GlobeProps["polygonGeoJsonGeometry"];

/**
 * The WebGL globe itself. Kept in its own module so the whole three.js payload
 * can be pulled in behind an `ssr: false` dynamic import.
 */
export default function GlobeInner({ size, view, onReady }: GlobeInnerProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [texture, setTexture] = useState<string | null>(null);

  // Keep the callback in a ref so a new inline function from the parent can't
  // re-trigger the ready effect.
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  // Load geometry once, then bake the cartoon earth from it.
  useEffect(() => {
    let cancelled = false;
    loadCountries().then((features) => {
      if (cancelled) return;
      setCountries(features);
      setTexture(buildGlobeTexture(features));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const { focus, markers, spinSpeed = 0.5 } = view;

  const highlighted = useMemo(() => {
    if (countries.length === 0) return [];
    return markers
      .map((m) => findCountry(countries, m.atlasName))
      .filter((f): f is CountryFeature => Boolean(f));
  }, [countries, markers]);

  // Drift gently on its own; hand the camera over whenever a single place is
  // called out, then resume drifting so the whole circle comes into view.
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !texture) return;

    const controls = globe.controls();
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotateSpeed = spinSpeed;

    if (focus) {
      controls.autoRotate = false;
      globe.pointOfView(
        { lat: focus.lat, lng: focus.lng, altitude: ALTITUDE },
        2400,
      );
    } else {
      controls.autoRotate = true;
    }
  }, [focus, spinSpeed, texture]);

  // Pull the camera in to our resting altitude and tell the stage it can fade
  // the globe in — only once the painted texture actually exists, so we never
  // reveal a bare sphere.
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !texture) return;
    globe.pointOfView({ altitude: ALTITUDE });
    onReadyRef.current?.();
  }, [texture]);

  if (!texture) return null;

  return (
    <Globe
      ref={globeRef}
      width={size}
      height={size}
      backgroundColor="rgba(0,0,0,0)"
      globeImageUrl={texture}
      showAtmosphere
      atmosphereColor="#9ed4ff"
      atmosphereAltitude={0.28}
      enablePointerInteraction={false}
      animateIn={false}
      polygonsData={highlighted}
      polygonGeoJsonGeometry={polygonGeometry}
      polygonCapColor={() => "rgba(255, 150, 54, 0.95)"}
      polygonSideColor={() => "rgba(214, 105, 24, 0.7)"}
      polygonStrokeColor={() => "#ffe6c7"}
      polygonAltitude={0.014}
      polygonsTransitionDuration={1100}
      htmlElementsData={markers}
      htmlLat="lat"
      htmlLng="lng"
      htmlAltitude={0.06}
      htmlTransitionDuration={800}
      htmlElement={(d) => makeCountryPill((d as CountryMarker).label)}
      htmlElementVisibilityModifier={(el, isVisible) => {
        // Only touch opacity — CSS2DRenderer owns `transform` on this node.
        el.style.opacity = isVisible ? "1" : "0";
      }}
    />
  );
}

/**
 * The little orange name tag that rides on a highlighted country.
 *
 * The outer node is positioned every frame by three.js's CSS2D renderer, so all
 * visual styling lives on an inner span.
 */
function makeCountryPill(text: string): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.opacity = "0";
  wrapper.style.transition = "opacity .8s ease";
  wrapper.style.pointerEvents = "none";

  const pill = document.createElement("span");
  pill.textContent = text;
  pill.style.cssText = [
    "display:inline-block",
    "padding:3px 10px",
    "border-radius:999px",
    "background:linear-gradient(180deg,#ffab55,#ef7d1c)",
    "border:1px solid rgba(255,238,212,0.9)",
    "color:#fff",
    "font-size:11px",
    "font-weight:600",
    "letter-spacing:0.02em",
    "white-space:nowrap",
    "box-shadow:0 4px 16px rgba(0,0,0,0.5)",
  ].join(";");

  wrapper.appendChild(pill);
  return wrapper;
}
