"use client";

import Link from "next/link";
import ApartmentCard from "./ApartmentCard";
import { getCodigoFromUrl } from "@/data/apartments";
import { useMatchesCards, PREVIEW_LIMIT } from "@/hooks/useMatchesCards";
import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton que imita o layout do ApartmentCard para estado de carregamento. */
function ApartmentCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/70 bg-card/80 p-4 md:p-5 flex flex-col md:flex-row md:items-stretch gap-4">
      <div className="relative w-full md:w-64 overflow-hidden rounded-lg aspect-[4/3]">
        <Skeleton className="absolute inset-0 w-full h-full" />
      </div>
      <div className="space-y-3 flex-1 flex flex-col min-w-0">
        <div className="space-y-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex items-start gap-1.5 mt-2">
          <Skeleton className="h-4 w-4 shrink-0 rounded" />
          <div className="space-y-1 flex-1 min-w-0">
            <Skeleton className="h-4 w-full max-w-[200px]" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
        <div className="mt-auto space-y-2 pt-2">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}

const NewMatchesGrid = () => {
  const { cardList, apartmentList, totalCount, isLoading, error } =
    useMatchesCards({ limit: PREVIEW_LIMIT });

  return (
    <section className="animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Novos Matches
          </h2>
          <p className="text-sm text-muted-foreground">
            {totalCount} novos imóveis encontrados
          </p>
        </div>
        <Link
          href="/dashboard/imoveis"
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          aria-label="Ver todos os imóveis"
        >
          Ver todos →
        </Link>
      </div>

      {error ? (
        <p className="text-sm text-destructive py-4">
          Não foi possível carregar os imóveis. Tente novamente.
        </p>
      ) : isLoading ? (
        <div
          className="space-y-4 animate-fade-in"
          style={{ animationDuration: "0.25s" }}
        >
          {Array.from({ length: PREVIEW_LIMIT }).map((_, i) => (
            <ApartmentCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div
          className="space-y-4 animate-fade-in"
          style={{ animationDuration: "0.3s" }}
        >
          {cardList.map((apt, index) => (
            <ApartmentCard
              key={
                getCodigoFromUrl(apartmentList[index].url) ?? `preview-${index}`
              }
              {...apt}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default NewMatchesGrid;
