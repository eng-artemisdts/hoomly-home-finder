"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Filter, Home, Bed, Bath, Dog, Sofa } from "lucide-react";
import TopNavigation from "@/components/TopNavigation";
import ApartmentCard from "@/components/ApartmentCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { getCodigoFromUrl } from "@/data/apartments";
import { useMatchesCards } from "@/hooks/useMatchesCards";
import type { MatchCardProps } from "@/hooks/useMatchesCards";

const SKELETON_COUNT = 6;
const DEFAULT_PRICE_MIN = 500;
const DEFAULT_PRICE_MAX = 10000;

interface FiltersState {
  priceRange: [number, number];
  quartos: string | null;
  banheiros: string | null;
  petFriendly: boolean;
  furnished: boolean;
}

const defaultFilters: FiltersState = {
  priceRange: [DEFAULT_PRICE_MIN, DEFAULT_PRICE_MAX],
  quartos: null,
  banheiros: null,
  petFriendly: false,
  furnished: false,
};

function applyFilters(
  cardList: MatchCardProps[],
  apartmentList: { url: string }[],
  filters: FiltersState
): { cardList: MatchCardProps[]; apartmentList: { url: string }[] } {
  const [priceMin, priceMax] = filters.priceRange;
  return cardList.reduce<{
    cardList: MatchCardProps[];
    apartmentList: { url: string }[];
  }>(
    (acc, card, index) => {
      const totalPrice = card.price + (card.condominio ?? 0) + (card.iptu ?? 0);
      if (totalPrice < priceMin || totalPrice > priceMax) return acc;
      if (filters.quartos !== null) {
        const minBedrooms =
          filters.quartos === "4+" ? 4 : parseInt(filters.quartos, 10);
        if (filters.quartos === "4+") {
          if (card.bedrooms < 4) return acc;
        } else if (card.bedrooms !== minBedrooms) return acc;
      }
      if (filters.banheiros !== null) {
        const minBathrooms =
          filters.banheiros === "3+" ? 3 : parseInt(filters.banheiros, 10);
        if (filters.banheiros === "3+") {
          if (card.bathrooms < 3) return acc;
        } else if (card.bathrooms !== minBathrooms) return acc;
      }
      if (filters.petFriendly && !card.petFriendly) return acc;
      if (filters.furnished && !card.furnished) return acc;
      acc.cardList.push(card);
      acc.apartmentList.push(apartmentList[index]);
      return acc;
    },
    { cardList: [], apartmentList: [] }
  );
}

function countActiveFilters(filters: FiltersState): number {
  let count = 0;
  if (
    filters.priceRange[0] !== DEFAULT_PRICE_MIN ||
    filters.priceRange[1] !== DEFAULT_PRICE_MAX
  )
    count++;
  if (filters.quartos !== null) count++;
  if (filters.banheiros !== null) count++;
  if (filters.petFriendly) count++;
  if (filters.furnished) count++;
  return count;
}

function ApartmentCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/70 bg-card/80 p-3 flex flex-col gap-3">
      <Skeleton className="w-full aspect-[4/3] rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-20" />
        <div className="flex gap-1.5 flex-wrap">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-4 w-full max-w-[180px]" />
      <div className="flex gap-2 mt-auto">
        <Skeleton className="h-9 flex-1 rounded-md" />
      </div>
    </div>
  );
}

const AllMatchesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);

  const { cardList, apartmentList, totalCount } = useMatchesCards();

  const { cardList: filteredCardList, apartmentList: filteredApartmentList } =
    useMemo(
      () => applyFilters(cardList, apartmentList, filters),
      [cardList, apartmentList, filters]
    );

  const activeFiltersCount = useMemo(
    () => countActiveFilters(filters),
    [filters]
  );

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setFiltersOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavigation />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="w-full max-w-[1000px] xl:max-w-[1200px] 2xl:max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard" aria-label="Voltar ao dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  Todos os imóveis
                </h1>
                <p className="text-sm text-muted-foreground">
                  {filteredCardList.length === totalCount
                    ? `${totalCount} imóveis encontrados`
                    : `${filteredCardList.length} de ${totalCount} imóveis`}
                </p>
              </div>
            </div>

            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 min-w-5 px-1.5"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full max-w-sm overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 py-6">
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Home className="h-4 w-4 text-primary" />
                      Faixa de preço (R$/mês)
                    </Label>
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(v) =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: v as [number, number],
                        }))
                      }
                      min={DEFAULT_PRICE_MIN}
                      max={DEFAULT_PRICE_MAX}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>
                        R$ {filters.priceRange[0].toLocaleString("pt-BR")}
                      </span>
                      <span>
                        R$ {filters.priceRange[1].toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Bed className="h-4 w-4 text-primary" />
                      Quartos
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {["1", "2", "3", "4+"].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              quartos: prev.quartos === num ? null : num,
                            }))
                          }
                          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            filters.quartos === num
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-foreground hover:bg-primary/10"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Bath className="h-4 w-4 text-primary" />
                      Banheiros
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {["1", "2", "3+"].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              banheiros: prev.banheiros === num ? null : num,
                            }))
                          }
                          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            filters.banheiros === num
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-foreground hover:bg-primary/10"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 cursor-pointer">
                      <Dog className="h-4 w-4 text-primary" />
                      Aceita pets
                    </Label>
                    <Checkbox
                      checked={filters.petFriendly}
                      onCheckedChange={(v) =>
                        setFilters((prev) => ({
                          ...prev,
                          petFriendly: v === true,
                        }))
                      }
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 cursor-pointer">
                      <Sofa className="h-4 w-4 text-primary" />
                      Mobiliado
                    </Label>
                    <Checkbox
                      checked={filters.furnished}
                      onCheckedChange={(v) =>
                        setFilters((prev) => ({
                          ...prev,
                          furnished: v === true,
                        }))
                      }
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </div>
                </div>
                <SheetFooter className="flex flex-row gap-2 border-t pt-4 mt-4">
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" onClick={handleClearFilters}>
                      Limpar filtros
                    </Button>
                  )}
                  <Button onClick={() => setFiltersOpen(false)}>Aplicar</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in"
              style={{ animationDuration: "0.25s" }}
            >
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <ApartmentCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredCardList.length === 0 ? (
            <div
              className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center animate-fade-in"
              style={{ animationDuration: "0.3s" }}
            >
              <p className="text-muted-foreground mb-4">
                Nenhum imóvel encontrado com esses critérios.
              </p>
              <Button variant="outline" onClick={handleClearFilters}>
                Limpar filtros
              </Button>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in"
              style={{ animationDuration: "0.3s" }}
            >
              {filteredCardList.map((apt, index) => (
                <ApartmentCard
                  key={
                    getCodigoFromUrl(filteredApartmentList[index].url) ??
                    `all-${index}`
                  }
                  {...apt}
                  layout="compact"
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllMatchesPage;
