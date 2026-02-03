import { useState, useEffect } from "react";
import {
  fetchCoordsForNeighborhood,
  normalizeNeighborhoodForQuery,
} from "@/lib/geo";

/**
 * Busca coordenadas dos bairros via geocoding (Nominatim) e retorna um mapa
 * bairro -> { lat, lng }. Resultados são cacheados em memória em geo.ts.
 */
export function useNeighborhoodCoords(
  neighborhoods: string[]
): Record<string, { lat: number; lng: number }> {
  const [coordsMap, setCoordsMap] = useState<Record<string, { lat: number; lng: number }>>({});

  const uniqueKeys = Array.from(
    new Set(
      neighborhoods
        .map(normalizeNeighborhoodForQuery)
        .filter((k) => k && k !== "Belo Horizonte")
    )
  );
  const keysKey = uniqueKeys.join(",");

  useEffect(() => {
    if (uniqueKeys.length === 0) return;

    let cancelled = false;
    const run = async () => {
      for (const key of uniqueKeys) {
        if (cancelled) return;
        const coords = await fetchCoordsForNeighborhood(key);
        if (cancelled) return;
        setCoordsMap((prev) => (prev[key] ? prev : { ...prev, [key]: coords }));
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  // keysKey is the stable serialized dependency; uniqueKeys is used inside the effect
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keysKey]);

  return coordsMap;
}
