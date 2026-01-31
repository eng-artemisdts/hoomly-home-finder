/**
 * Mock de imóveis no formato da última execução do Apify (scraper Vitrini).
 * Estrutura igual ao payload retornado por extractDetail em vitrini.scrapper.ts
 */
export interface VitriniApartment {
  url: string;
  codigo?: string;
  title: string;
  price: string;
  condominio?: string;
  iptu?: string;
  location: string;
  address: string;
  neighborhood: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  description?: string;
  furnished: boolean;
  petFriendly: boolean;
  characteristics?: string[];
  image?: string;
  source: "vitrini";
}

export const mockVitriniApartments: VitriniApartment[] = [
  {
    url: "https://imobiliariavitrini.com.br/imovel/?codigo=43906",
    codigo: "43906",
    title: "Apartamento 2 quartos - Funcionários",
    price: "R$ 2.400,00",
    condominio: "R$ 450,00",
    iptu: "R$ 120,00",
    location: "Funcionários, Belo Horizonte",
    address: "Rua da Bahia, 1148 - Funcionários",
    neighborhood: "Funcionários",
    area: 65,
    bedrooms: 2,
    bathrooms: 1,
    description: "Apartamento amplo e bem localizado, próximo ao centro e comércio.",
    furnished: false,
    petFriendly: true,
    characteristics: ["Portaria 24h", "Elevador", "Varanda"],
    image: "https://imobiliariavitrini.com.br/_assets/fotos/imovel-43906-01.jpg",
    source: "vitrini",
  },
  {
    url: "https://imobiliariavitrini.com.br/imovel/?codigo=44102",
    codigo: "44102",
    title: "Apartamento 3 quartos - Savassi",
    price: "R$ 3.800,00",
    condominio: "R$ 620,00",
    iptu: "R$ 180,00",
    location: "Savassi, Belo Horizonte",
    address: "Rua Pernambuco, 892 - Savassi",
    neighborhood: "Savassi",
    area: 95,
    bedrooms: 3,
    bathrooms: 2,
    description: "Imóvel reformado, mobiliado, ideal para quem busca praticidade.",
    furnished: true,
    petFriendly: true,
    characteristics: ["Mobiliado", "Ar condicionado", "Garagem"],
    image: "https://imobiliariavitrini.com.br/_assets/fotos/imovel-44102-01.jpg",
    source: "vitrini",
  },
  {
    url: "https://imobiliariavitrini.com.br/imovel/?codigo=43821",
    codigo: "43821",
    title: "Apartamento 1 quarto - Lourdes",
    price: "R$ 1.950,00",
    condominio: "R$ 380,00",
    location: "Lourdes, Belo Horizonte",
    address: "Rua da Paisagem, 340 - Lourdes",
    neighborhood: "Lourdes",
    area: 42,
    bedrooms: 1,
    bathrooms: 1,
    furnished: false,
    petFriendly: false,
    characteristics: ["Portaria", "Salão de festas"],
    source: "vitrini",
  },
  {
    url: "https://imobiliariavitrini.com.br/imovel/?codigo=44215",
    codigo: "44215",
    title: "Apartamento 2 quartos - Pampulha",
    price: "R$ 2.650,00",
    condominio: "R$ 410,00",
    iptu: "R$ 95,00",
    location: "Pampulha, Belo Horizonte",
    address: "Av. Portugal, 2250 - Pampulha",
    neighborhood: "Pampulha",
    area: 72,
    bedrooms: 2,
    bathrooms: 2,
    description: "Próximo à Lagoa da Pampulha, vista parcial para o espelho d'água.",
    furnished: false,
    petFriendly: true,
    characteristics: ["Vaga", "Churrasqueira", "Área de lazer"],
    image: "https://imobiliariavitrini.com.br/_assets/fotos/imovel-44215-01.jpg",
    source: "vitrini",
  },
  {
    url: "https://imobiliariavitrini.com.br/imovel/?codigo=44033",
    codigo: "44033",
    title: "Apartamento 2 quartos - Santo Agostinho",
    price: "R$ 3.100,00",
    condominio: "R$ 520,00",
    location: "Santo Agostinho, Belo Horizonte",
    address: "Rua Aimorés, 1456 - Santo Agostinho",
    neighborhood: "Santo Agostinho",
    area: 68,
    bedrooms: 2,
    bathrooms: 1,
    furnished: true,
    petFriendly: true,
    characteristics: ["Mobiliado", "Cozinha equipada", "Wi-Fi"],
    source: "vitrini",
  },
  {
    url: "https://imobiliariavitrini.com.br/imovel/?codigo=43987",
    codigo: "43987",
    title: "Apartamento 3 quartos - Cidade Jardim",
    price: "R$ 4.200,00",
    condominio: "R$ 750,00",
    iptu: "R$ 220,00",
    location: "Cidade Jardim, Belo Horizonte",
    address: "Rua dos Inconfidentes, 1070 - Cidade Jardim",
    neighborhood: "Cidade Jardim",
    area: 110,
    bedrooms: 3,
    bathrooms: 2,
    description: "Apartamento de alto padrão com ampla área de lazer.",
    furnished: false,
    petFriendly: false,
    characteristics: ["2 vagas", "Piscina", "Academia", "Salão de jogos"],
    image: "https://imobiliariavitrini.com.br/_assets/fotos/imovel-43987-01.jpg",
    source: "vitrini",
  },
];
