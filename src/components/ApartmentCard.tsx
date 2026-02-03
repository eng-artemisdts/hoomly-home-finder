import { useState } from "react";
import {
  Heart,
  Bed,
  Bath,
  Maximize,
  MapPin,
  Home,
  ExternalLink,
  Dog,
  Sofa,
  Clock,
} from "lucide-react";
import placeholderImage from "@/assets/apartment-1.jpg";
import { formatPriceBrl, cn } from "@/lib/utils";

interface ApartmentCardProps {
  /** Aluguel em reais (número). Será formatado para exibição. */
  price: number;
  /** Condomínio em reais (opcional). Somado ao aluguel no total por mês. */
  condominio?: number;
  /** IPTU em reais (opcional). Somado ao aluguel no total por mês. */
  iptu?: number;
  address: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  isNew?: boolean;
  officialUrl?: string;
  petFriendly?: boolean;
  furnished?: boolean;
  commuteMinutes?: number;
  /** URL da imagem do imóvel (ex.: do Apify/Vitrini). Fallback para placeholder quando ausente. */
  image?: string;
  /** Layout: default (horizontal em md+) ou compact (sempre vertical, para grid). */
  layout?: "default" | "compact";
}

const ApartmentCard = ({
  price,
  condominio,
  iptu,
  address,
  neighborhood,
  bedrooms,
  bathrooms,
  area,
  isNew = false,
  officialUrl,
  petFriendly,
  furnished,
  commuteMinutes,
  image: imageUrl,
  layout = "default",
}: ApartmentCardProps) => {
  const [imageError, setImageError] = useState(false);
  const rawImageSrc = imageUrl && !imageError ? imageUrl : placeholderImage;
  const imageSrc =
    typeof rawImageSrc === "string"
      ? rawImageSrc
      : (rawImageSrc as { src: string }).src;
  const totalPorMes = price + (condominio ?? 0) + (iptu ?? 0);
  const temDetalhe =
    (condominio != null && condominio > 0) || (iptu != null && iptu > 0);
  const isCompact = layout === "compact";

  return (
    <div
      className={cn(
        "apartment-card animate-fade-in rounded-xl border border-border/70 bg-card/80 backdrop-blur-sm flex flex-col gap-4",
        isCompact ? "p-3" : "p-4 md:p-5 md:flex-row md:items-stretch"
      )}
    >
      {/* Visual abstrata em vez de foto do anúncio */}
      <div
        className={cn(
          "relative overflow-hidden rounded-lg aspect-[4/3]",
          !isCompact && "w-full md:w-64"
        )}
      >
        {/* Imagem borrada de fundo */}
        <div className="absolute inset-0">
          <img
            src={imageSrc}
            alt=""
            className="w-full h-full object-cover blur-[10px] scale-105"
            aria-hidden="true"
            onError={() => setImageError(true)}
          />
          {/* Overlay escuro para melhorar contraste */}
          <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/40 to-background/50" />
        </div>

        {/* Conteúdo sobreposto */}
        <div className="relative h-full px-4 py-4 flex flex-col justify-between z-10">
          {/* Linha superior com selo e ícone */}
          <div className="flex items-start justify-between">
            <div className="space-y-1" aria-hidden="true" />

            <div className="relative">
              <div className="h-12 w-12 rounded-2xl bg-primary/30 backdrop-blur-sm flex items-center justify-center shadow-lg border border-primary/20">
                <Home className="h-6 w-6 text-primary" />
              </div>
              {isNew && (
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-medium shadow-lg whitespace-nowrap">
                  Novo match
                </span>
              )}
            </div>
          </div>

          {/* Chips de características na base da ilustração */}
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-background/80 backdrop-blur-sm border border-border/60 px-2 py-0.5 text-[11px] text-foreground shadow-sm">
              <Bed className="h-3 w-3" />
              {bedrooms} qt.
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-background/80 backdrop-blur-sm border border-border/60 px-2 py-0.5 text-[11px] text-foreground shadow-sm">
              <Bath className="h-3 w-3" />
              {bathrooms} bwc
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-background/80 backdrop-blur-sm border border-border/60 px-2 py-0.5 text-[11px] text-foreground shadow-sm">
              <Maximize className="h-3 w-3" />
              {area}m²
            </span>
            {petFriendly && (
              <span className="inline-flex items-center gap-1 rounded-full bg-background/80 backdrop-blur-sm border border-border/60 px-2 py-0.5 text-[11px] text-foreground shadow-sm">
                <Dog className="h-3 w-3" />
                Aceita pets
              </span>
            )}
            {furnished && (
              <span className="inline-flex items-center gap-1 rounded-full bg-background/80 backdrop-blur-sm border border-border/60 px-2 py-0.5 text-[11px] text-foreground shadow-sm">
                <Sofa className="h-3 w-3" />
                Mobiliado
              </span>
            )}
            {commuteMinutes != null && commuteMinutes > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-background/80 backdrop-blur-sm border border-border/60 px-2 py-0.5 text-[11px] text-foreground shadow-sm">
                <Clock className="h-3 w-3" />
                Até {commuteMinutes} min
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div
        className={cn(
          "space-y-3 flex-1 flex flex-col",
          isCompact && "space-y-2"
        )}
      >
        {/* Preço */}
        <div className="space-y-2">
          <div>
            <p
              className={cn(
                "font-bold text-foreground tabular-nums",
                isCompact ? "text-lg" : "text-xl"
              )}
            >
              {formatPriceBrl(totalPorMes)}
            </p>
            <p className="text-xs font-medium text-muted-foreground">
              por mês{temDetalhe ? " (total)" : ""}
            </p>
          </div>
          {temDetalhe && !isCompact && (
            <div className="rounded-lg border border-border/70 bg-muted/40 px-3 py-2 space-y-1.5">
              <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
                Detalhamento
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <span className="text-foreground">
                  <span className="text-muted-foreground font-normal">
                    Aluguel{" "}
                  </span>
                  <span className="font-semibold tabular-nums">
                    {formatPriceBrl(price)}
                  </span>
                </span>
                {condominio != null && condominio > 0 && (
                  <span className="text-foreground">
                    <span className="text-muted-foreground font-normal">
                      Condomínio{" "}
                    </span>
                    <span className="font-semibold tabular-nums">
                      {formatPriceBrl(condominio)}
                    </span>
                  </span>
                )}
                {iptu != null && iptu > 0 && (
                  <span className="text-foreground">
                    <span className="text-muted-foreground font-normal">
                      IPTU{" "}
                    </span>
                    <span className="font-semibold tabular-nums">
                      {formatPriceBrl(iptu)}
                    </span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Endereço */}
        <div className="flex items-start gap-1.5">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground leading-tight">{address}</p>
            <p className="text-xs text-muted-foreground">{neighborhood}</p>
          </div>
        </div>

        {/* Ações */}
        <div
          className={cn("mt-auto space-y-2 pt-1", isCompact && "space-y-1.5")}
        >
          <button
            className={cn("btn-save w-full", isCompact && "text-xs py-1.5")}
          >
            <Heart className="h-4 w-4" />
            Salvar e acompanhar
          </button>

          {officialUrl && (
            <a
              href={officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-primary/70 text-primary font-medium hover:bg-primary/10 transition-colors",
                isCompact ? "text-xs py-1.5" : "text-xs sm:text-sm py-2"
              )}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Ver anúncio no site oficial
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApartmentCard;
