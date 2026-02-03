/**
 * Serviço de geocoding via Nominatim (OpenStreetMap).
 * Respeita cache em memória e rate limit de 1 req/s.
 */

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "HoomlyHomeFinder/1.0 (contact@hoomly.com)";
const MIN_REQUEST_INTERVAL_MS = 1100;

const coordsCache = new Map<string, { lat: number; lng: number }>();
let lastRequestTime = 0;

export interface GeocodingServiceResult {
  lat: number;
  lng: number;
}

/**
 * Busca coordenadas para um endereço/bairro via Nominatim.
 * Usa cache e respeita 1 req/s.
 */
export async function fetchCoords(
  query: string,
  fallback: GeocodingServiceResult
): Promise<GeocodingServiceResult> {
  const key = query.trim();
  if (!key || key.length < 2) return fallback;

  const cached = coordsCache.get(key);
  if (cached) return cached;

  const now = Date.now();
  const wait = Math.max(0, MIN_REQUEST_INTERVAL_MS - (now - lastRequestTime));
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRequestTime = Date.now();

  const searchQuery = encodeURIComponent(`${key}, Belo Horizonte, MG, Brazil`);
  const url = `${NOMINATIM_BASE}?q=${searchQuery}&format=json&limit=1`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (!res.ok) return fallback;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return fallback;
    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return fallback;
    const coords = { lat, lng };
    coordsCache.set(key, coords);
    return coords;
  } catch {
    return fallback;
  }
}

/**
 * Retorna coordenadas do cache (sync). Retorna undefined se não estiver em cache.
 */
export function getFromCache(key: string): GeocodingServiceResult | undefined {
  return coordsCache.get(key.trim());
}
