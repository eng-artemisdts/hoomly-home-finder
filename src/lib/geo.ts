/**
 * Utilitários para cálculo de distância e tempo de deslocamento
 * com base na localização do usuário (ex.: trabalho/casa).
 * Coordenadas dos bairros são obtidas via geocodingService (Nominatim/OSM).
 */

import * as geocodingService from "@/services/geocodingService";

/** Centro de BH como fallback quando o bairro não é encontrado ou ainda está carregando. */
export const BH_CENTER = { lat: -19.913, lng: -43.941 };

/**
 * Extrai um nome de bairro “limpo” para geocoding (ex.: "Ouro Preto" ou "Paquetá").
 * Exportado para uso no hook de coordenadas (mesma chave de cache).
 */
export function normalizeNeighborhoodForQuery(neighborhood: string): string {
  const trimmed = neighborhood.trim();
  if (!trimmed) return "Belo Horizonte";
  const matchEm = /em\s+([^,]+),\s*Belo Horizonte/i.exec(trimmed);
  if (matchEm) return matchEm[1].trim();
  const matchBairro = /(?:em|no bairro?)\s+([^,]+)/i.exec(trimmed);
  if (matchBairro) return matchBairro[1].trim();
  if (trimmed.includes(",")) return trimmed.split(",")[0].trim();
  const words = trimmed.split(/\s+/).slice(0, 3);
  return words.join(" ").replace(/\s+/g, " ").trim();
}

/**
 * Busca coordenadas do bairro via serviço de geocoding (Nominatim).
 */
export async function fetchCoordsForNeighborhood(
  neighborhood: string
): Promise<{ lat: number; lng: number }> {
  const key = normalizeNeighborhoodForQuery(neighborhood).trim();
  return geocodingService.fetchCoords(key, BH_CENTER);
}

/**
 * Retorna coordenadas do bairro (cache do serviço ou coordsMap do hook).
 */
export function getCoordsForNeighborhood(
  neighborhood: string,
  coordsMap?: Record<string, { lat: number; lng: number }> | null
): { lat: number; lng: number } {
  const key = normalizeNeighborhoodForQuery(neighborhood);
  if (coordsMap) {
    if (key && coordsMap[key]) return coordsMap[key];
    const found = Object.keys(coordsMap).find((k) =>
      key.toLowerCase().includes(k.toLowerCase())
    );
    if (found) return coordsMap[found];
  }
  const cached = geocodingService.getFromCache(key);
  if (cached) return cached;
  return BH_CENTER;
}

/** Velocidade média em área urbana (km/h) para estimar tempo de deslocamento. */
const AVERAGE_URBAN_SPEED_KMH = 25;

/**
 * Distância em km entre dois pontos (fórmula de Haversine).
 */
export function haversineDistanceKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Estima tempo de deslocamento em minutos entre dois pontos (trânsito urbano).
 */
export function estimateCommuteMinutes(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number {
  const km = haversineDistanceKm(from, to);
  const hours = km / AVERAGE_URBAN_SPEED_KMH;
  const minutes = Math.round(hours * 60);
  return Math.max(5, Math.min(120, minutes)); // entre 5 e 120 min
}
