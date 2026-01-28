import { Search, Star, Clock, Trash2 } from "lucide-react";

const savedSearches = [
  {
    id: 1,
    name: "Pinheiros - 2 quartos",
    filters: "R$ 2.500 - R$ 4.000, Mobiliado",
    matches: 8,
    lastUpdate: "Há 2 horas",
  },
  {
    id: 2,
    name: "Vila Madalena - Studio",
    filters: "Até R$ 3.000, Aceita pets",
    matches: 5,
    lastUpdate: "Há 5 horas",
  },
  {
    id: 3,
    name: "Jardins - 3 quartos",
    filters: "R$ 4.000 - R$ 6.000, 2 banheiros",
    matches: 3,
    lastUpdate: "Há 1 dia",
  },
];

const YourSearchesSection = () => {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Suas Buscas</h2>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          + Nova Busca
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {savedSearches.map((search) => (
          <div
            key={search.id}
            className="glass-card p-4 hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">{search.name}</h3>
                  <p className="text-xs text-muted-foreground">{search.filters}</p>
                </div>
              </div>
              <button className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all">
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-primary font-medium">
                <Star className="h-3.5 w-3.5" />
                {search.matches} matches
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {search.lastUpdate}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default YourSearchesSection;
