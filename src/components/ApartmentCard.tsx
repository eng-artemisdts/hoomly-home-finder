import { Heart, Bed, Bath, Maximize, MapPin } from "lucide-react";

interface ApartmentCardProps {
  image: string;
  price: string;
  address: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  isNew?: boolean;
}

const ApartmentCard = ({
  image,
  price,
  address,
  neighborhood,
  bedrooms,
  bathrooms,
  area,
  isNew = false,
}: ApartmentCardProps) => {
  return (
    <div className="apartment-card animate-fade-in">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={address}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {isNew && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
            Novo
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Price */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-semibold text-foreground">{price}</p>
            <p className="text-xs text-muted-foreground">por mês</p>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-1.5">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground leading-tight">{address}</p>
            <p className="text-xs text-muted-foreground">{neighborhood}</p>
          </div>
        </div>

        {/* Features */}
        <div className="flex items-center gap-3 pt-1">
          <span className="badge-feature">
            <Bed className="h-3.5 w-3.5" />
            {bedrooms}
          </span>
          <span className="badge-feature">
            <Bath className="h-3.5 w-3.5" />
            {bathrooms}
          </span>
          <span className="badge-feature">
            <Maximize className="h-3.5 w-3.5" />
            {area}m²
          </span>
        </div>

        {/* Action */}
        <button className="btn-save w-full mt-2">
          <Heart className="h-4 w-4" />
          Salvar e Acompanhar
        </button>
      </div>
    </div>
  );
};

export default ApartmentCard;
