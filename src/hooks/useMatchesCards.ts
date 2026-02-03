import { apartments, getNeighborhoodFromItem } from "@/data/apartments";
import {
  getCoordsForNeighborhood,
  estimateCommuteMinutes,
} from "@/lib/geo";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useNeighborhoodCoords } from "@/hooks/useNeighborhoodCoords";
import type { ApartmentFromJson } from "@/data/apartments";

/** Extrai quartos do título (ex.: "1 quarto" -> 1). */
function getBedroomsFromTitle(title: string): number {
  const match = /(\d+)\s*quarto/i.exec(title);
  return match ? parseInt(match[1], 10) : 0;
}

export interface MatchCardProps {
  price: number;
  condominio?: number;
  iptu?: number;
  address: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  isNew: boolean;
  officialUrl?: string;
  petFriendly: boolean;
  furnished: boolean;
  commuteMinutes?: number;
  image?: string;
}

function mapApartmentToCardProps(
  apt: ApartmentFromJson,
  index: number,
  userCoords: { lat: number; lng: number },
  neighborhoodCoords: Record<string, { lat: number; lng: number }> | null
): MatchCardProps {
  const neighborhood = getNeighborhoodFromItem(apt.title, apt.location);
  const shortLocation =
    apt.location && apt.location.length < 80 && apt.location.includes(",")
      ? apt.location
      : `${neighborhood}, Belo Horizonte`;

  const aptCoords = getCoordsForNeighborhood(neighborhood, neighborhoodCoords);
  const commuteMinutes = estimateCommuteMinutes(userCoords, aptCoords);

  return {
    price: apt.price,
    condominio: apt.condominio,
    iptu: apt.iptu,
    address: shortLocation,
    neighborhood: apt.neighborhood ?? neighborhood,
    bedrooms: apt.bedrooms ?? (getBedroomsFromTitle(apt.title) || 1),
    bathrooms: apt.bathrooms ?? 1,
    area: apt.area ?? 20,
    isNew: index < 3,
    officialUrl: apt.url,
    petFriendly: apt.petFriendly ?? false,
    furnished: apt.furnished ?? false,
    commuteMinutes,
    image: apt.image,
  };
}

export const PREVIEW_LIMIT = 6;

interface UseMatchesCardsOptions {
  /** Se definido, retorna apenas os primeiros N itens (ex.: preview no dashboard). */
  limit?: number;
}

/**
 * Hook que mapeia a lista de apartamentos para as props dos cards,
 * usando localização do usuário e coordenadas dos bairros.
 */
export function useMatchesCards(options: UseMatchesCardsOptions = {}) {
  const { limit } = options;
  const { coords: userCoords } = useUserLocation();
  const uniqueNeighborhoods = Array.from(
    new Set(
      apartments.map((apt) => getNeighborhoodFromItem(apt.title, apt.location))
    )
  );
  const neighborhoodCoords = useNeighborhoodCoords(uniqueNeighborhoods);

  const fullCardList = apartments.map((apt, index) =>
    mapApartmentToCardProps(apt, index, userCoords, neighborhoodCoords)
  );

  const apartmentList = limit
    ? apartments.slice(0, limit)
    : apartments;
  const cardList = limit
    ? fullCardList.slice(0, limit)
    : fullCardList;
  const totalCount = apartments.length;

  return {
    cardList,
    apartmentList,
    totalCount,
  };
}
