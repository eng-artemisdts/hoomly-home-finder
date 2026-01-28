import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Bed, Bath, Dog, Sofa, Clock, MapPin, Bell } from "lucide-react";

const FiltersSidebar = () => {
  return (
    <aside className="w-72 border-r border-border/50 bg-card p-5 overflow-y-auto">
      <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-5">
        Filtros
      </h2>

      {/* Price Range */}
      <div className="filter-section">
        <label className="filter-label flex items-center gap-2">
          <Home className="h-4 w-4 text-primary" />
          Faixa de Preço
        </label>
        <div className="space-y-3">
          <Slider defaultValue={[1500, 4500]} min={500} max={10000} step={100} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>R$ 1.500</span>
            <span>R$ 4.500</span>
          </div>
        </div>
      </div>

      {/* Bedrooms */}
      <div className="filter-section">
        <label className="filter-label flex items-center gap-2">
          <Bed className="h-4 w-4 text-primary" />
          Quartos
        </label>
        <div className="flex gap-2">
          {["1", "2", "3", "4+"].map((num) => (
            <button
              key={num}
              className="flex-1 py-2 px-3 rounded-lg text-sm font-medium bg-secondary text-foreground hover:bg-primary/10 hover:text-primary transition-colors data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
              data-active={num === "2"}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div className="filter-section">
        <label className="filter-label flex items-center gap-2">
          <Bath className="h-4 w-4 text-primary" />
          Banheiros
        </label>
        <div className="flex gap-2">
          {["1", "2", "3+"].map((num) => (
            <button
              key={num}
              className="flex-1 py-2 px-3 rounded-lg text-sm font-medium bg-secondary text-foreground hover:bg-primary/10 hover:text-primary transition-colors data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
              data-active={num === "1"}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Pet Friendly */}
      <div className="filter-section">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <Dog className="h-4 w-4 text-primary" />
            Aceita Pets
          </Label>
          <Checkbox id="pet-friendly" className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
        </div>
      </div>

      {/* Furnished */}
      <div className="filter-section">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <Sofa className="h-4 w-4 text-primary" />
            Mobiliado
          </Label>
          <Checkbox id="furnished" defaultChecked className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
        </div>
      </div>

      {/* Commute Time */}
      <div className="filter-section">
        <label className="filter-label flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Tempo de Deslocamento
        </label>
        <Select defaultValue="30">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">Até 15 min</SelectItem>
            <SelectItem value="30">Até 30 min</SelectItem>
            <SelectItem value="45">Até 45 min</SelectItem>
            <SelectItem value="60">Até 1 hora</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Neighborhood */}
      <div className="filter-section">
        <label className="filter-label flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Bairro
        </label>
        <Select defaultValue="pinheiros">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pinheiros">Pinheiros</SelectItem>
            <SelectItem value="vila-madalena">Vila Madalena</SelectItem>
            <SelectItem value="jardins">Jardins</SelectItem>
            <SelectItem value="moema">Moema</SelectItem>
            <SelectItem value="itaim-bibi">Itaim Bibi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alert Frequency */}
      <div className="filter-section border-b-0">
        <label className="filter-label flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          Frequência de Alertas
        </label>
        <Select defaultValue="daily">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instant">Imediato</SelectItem>
            <SelectItem value="daily">Diário</SelectItem>
            <SelectItem value="weekly">Semanal</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </aside>
  );
};

export default FiltersSidebar;
