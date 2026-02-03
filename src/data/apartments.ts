/**
 * Carrega e tipa os imóveis do arquivo JSON (ex.: saída do Apify/Vitrini).
 */
import apartmentsJson from "./apartments.json";

export interface ApartmentFromJson {
  title: string;
  /** Aluguel em reais (número). */
  price: number;
  location: string;
  url: string;
  image?: string;
  /** Área em m² (saída Apify/Vitrini). */
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  neighborhood?: string;
  /** Condomínio em reais (número). */
  condominio?: number;
  /** IPTU em reais (número). */
  iptu?: number;
  furnished?: boolean;
  petFriendly?: boolean;
}

export const apartments = apartmentsJson as ApartmentFromJson[];

/** Extrai código do imóvel da URL (?codigo=41532). */
export function getCodigoFromUrl(url: string): string | null {
  const match = /[?&]codigo=(\d+)/i.exec(url);
  return match ? match[1] : null;
}

/**
 * Extrai bairro do title ou location.
 * Ex.: "Kitnet ... em Ouro Preto, Belo Horizonte" -> "Ouro Preto"
 *      "Ouro Preto, Belo Horizonte" -> "Ouro Preto"
 */
export function getNeighborhoodFromItem(
  title: string,
  location: string
): string {
  if (location && location.length < 80 && location.includes(",")) {
    return location.split(",")[0].trim();
  }
  const match = /em\s+([^,]+),\s*Belo Horizonte/i.exec(title);
  return match ? match[1].trim() : title.split(" em ").pop()?.split(",")[0]?.trim() || "Belo Horizonte";
}
