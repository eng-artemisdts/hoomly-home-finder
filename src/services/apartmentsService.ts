import type { ApartmentFromJson } from "@/data/apartments";

export interface ApiApartment extends ApartmentFromJson {
  id?: string;
}

/**
 * Busca todos os imóveis da API (MongoDB).
 * GET /api/apartments
 */
export async function fetchApartments(): Promise<ApartmentFromJson[]> {
  const res = await fetch("/api/apartments", {
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body?.message ?? body?.error ?? `Erro ao buscar imóveis (${res.status})`
    );
  }

  const data: ApiApartment[] = await res.json();
  return data.map(({ id: _id, ...rest }) => rest as ApartmentFromJson);
}
