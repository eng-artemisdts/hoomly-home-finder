import ApartmentCard from "./ApartmentCard";
import {
  apartments,
  getCodigoFromUrl,
  getNeighborhoodFromItem,
} from "@/data/apartments";
import {
  getCoordsForNeighborhood,
  estimateCommuteMinutes,
} from "@/lib/geo";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useNeighborhoodCoords } from "@/hooks/useNeighborhoodCoords";

/** Extrai quartos do título (ex.: "1 quarto" -> 1). */
function getBedroomsFromTitle(title: string): number {
  const match = /(\d+)\s*quarto/i.exec(title);
  return match ? parseInt(match[1], 10) : 0;
}

/** Mapeia item do JSON (Apify/Vitrini) para as props do ApartmentCard */
function jsonToCardProps(
  apt: (typeof apartments)[0],
  index: number,
  userCoords: { lat: number; lng: number },
  neighborhoodCoords: Record<string, { lat: number; lng: number }> | null
) {
  const neighborhood = getNeighborhoodFromItem(apt.title, apt.location);
  const shortLocation =
    apt.location && apt.location.length < 80 && apt.location.includes(",")
      ? apt.location
      : `${neighborhood}, Belo Horizonte`;

  const aptCoords = getCoordsForNeighborhood(neighborhood, neighborhoodCoords);
  const commuteMinutes = estimateCommuteMinutes(userCoords, aptCoords);

  return {
    price: apt.price,
    address: shortLocation,
    neighborhood,
    bedrooms: getBedroomsFromTitle(apt.title) || 1,
    bathrooms: 1,
    area: 20,
    isNew: index < 3,
    officialUrl: apt.url,
    petFriendly: false,
    furnished: false,
    commuteMinutes,
    image: apt.image,
  };
}

const NewMatchesGrid = () => {
  const { coords: userCoords } = useUserLocation();
  const uniqueNeighborhoods = Array.from(
    new Set(
      apartments.map((apt) =>
        getNeighborhoodFromItem(apt.title, apt.location)
      )
    )
  );
  const neighborhoodCoords = useNeighborhoodCoords(uniqueNeighborhoods);
  const cardList = apartments.map((apt, index) =>
    jsonToCardProps(apt, index, userCoords, neighborhoodCoords)
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Novos Matches</h2>
          <p className="text-sm text-muted-foreground">
            {cardList.length} novos imóveis encontrados
          </p>
        </div>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          Ver todos →
        </button>
      </div>

      <div className="space-y-4">
        {cardList.map((apt, index) => (
          <ApartmentCard
            key={getCodigoFromUrl(apartments[index].url) ?? index}
            {...apt}
          />
        ))}
      </div>
    </section>
  );
};

export default NewMatchesGrid;
