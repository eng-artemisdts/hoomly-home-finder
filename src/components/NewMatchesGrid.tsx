import ApartmentCard from "./ApartmentCard";
import apartment1 from "@/assets/apartment-1.jpg";
import apartment2 from "@/assets/apartment-2.jpg";
import apartment3 from "@/assets/apartment-3.jpg";
import apartment4 from "@/assets/apartment-4.jpg";
import apartment5 from "@/assets/apartment-5.jpg";
import apartment6 from "@/assets/apartment-6.jpg";

const apartments = [
  {
    image: apartment1,
    price: "R$ 3.200",
    address: "Rua Harmonia, 245",
    neighborhood: "Pinheiros, São Paulo",
    bedrooms: 2,
    bathrooms: 1,
    area: 68,
    isNew: true,
  },
  {
    image: apartment2,
    price: "R$ 2.800",
    address: "Rua Girassol, 180",
    neighborhood: "Vila Madalena, São Paulo",
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    isNew: true,
  },
  {
    image: apartment3,
    price: "R$ 4.500",
    address: "Rua Oscar Freire, 1200",
    neighborhood: "Jardins, São Paulo",
    bedrooms: 3,
    bathrooms: 2,
    area: 95,
    isNew: false,
  },
  {
    image: apartment4,
    price: "R$ 3.800",
    address: "Alameda Santos, 456",
    neighborhood: "Jardins, São Paulo",
    bedrooms: 2,
    bathrooms: 2,
    area: 75,
    isNew: true,
  },
  {
    image: apartment5,
    price: "R$ 2.500",
    address: "Rua Wisard, 320",
    neighborhood: "Vila Madalena, São Paulo",
    bedrooms: 1,
    bathrooms: 1,
    area: 52,
    isNew: false,
  },
  {
    image: apartment6,
    price: "R$ 4.200",
    address: "Rua dos Pinheiros, 890",
    neighborhood: "Pinheiros, São Paulo",
    bedrooms: 2,
    bathrooms: 2,
    area: 82,
    isNew: false,
  },
];

const NewMatchesGrid = () => {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Novos Matches</h2>
          <p className="text-sm text-muted-foreground">12 novos imóveis encontrados</p>
        </div>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          Ver todos →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {apartments.map((apt, index) => (
          <ApartmentCard key={index} {...apt} />
        ))}
      </div>
    </section>
  );
};

export default NewMatchesGrid;
