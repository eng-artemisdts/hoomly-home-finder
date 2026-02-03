"use client";

import { useState } from "react";
import Link from "next/link";
import TopNavigation from "@/components/TopNavigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useMatchesCards } from "@/hooks/useMatchesCards";
import type { ApartmentFromJson } from "@/data/apartments";
import { ArrowLeft, BarChart3, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_SELECT = 4;
const LIST_PREVIEW = 12;

const CompararImoveisPage = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { apartmentList, isLoading, error } = useMatchesCards();

  const toggle = (url: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else if (next.size < MAX_SELECT) next.add(url);
      return next;
    });
  };

  const selectedList = apartmentList.filter((a) => selected.has(a.url));
  const listPreview = apartmentList.slice(0, LIST_PREVIEW);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavigation />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="w-full max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard" aria-label="Voltar ao dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="h-7 w-7 text-primary" />
                Comparar imóveis
              </h1>
              <p className="text-sm text-muted-foreground">
                Selecione até {MAX_SELECT} imóveis para comparar lado a lado.
              </p>
            </div>
          </div>

          {error ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-destructive mb-2">
                  Não foi possível carregar os imóveis.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {error.message}
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Tentar novamente
                </Button>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <p className="text-muted-foreground">Carregando imóveis...</p>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Lista para seleção */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Selecionar imóveis</CardTitle>
                  <CardDescription>
                    Marque os imóveis que deseja comparar ({selected.size}/
                    {MAX_SELECT}).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 max-h-[400px] overflow-y-auto">
                    {listPreview.map((apt) => (
                      <li key={apt.url}>
                        <label
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                            selected.has(apt.url)
                              ? "border-primary bg-primary/5"
                              : "border-border hover:bg-secondary/50"
                          )}
                        >
                          <Checkbox
                            checked={selected.has(apt.url)}
                            onCheckedChange={() => toggle(apt.url)}
                            disabled={
                              !selected.has(apt.url) &&
                              selected.size >= MAX_SELECT
                            }
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">
                              {apt.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {apt.location} · R${" "}
                              {apt.price.toLocaleString("pt-BR")}/mês
                            </p>
                          </div>
                        </label>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Área de comparação */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Scale className="h-5 w-5 text-primary" />
                    Comparação
                  </CardTitle>
                  <CardDescription>
                    {selectedList.length === 0
                      ? "Selecione pelo menos 2 imóveis para ver a comparação."
                      : `Comparando ${selectedList.length} imóvel(is).`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedList.length < 2 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                      <Scale className="h-12 w-12 mb-3 opacity-50" />
                      <p className="text-sm">
                        Selecione 2 a {MAX_SELECT} imóveis na lista ao lado para
                        comparar preço, área, quartos e outros critérios.
                      </p>
                    </div>
                  ) : (
                    <ComparisonTable items={selectedList} />
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

function ComparisonTable({ items }: { items: ApartmentFromJson[] }) {
  const rows: { label: string; key: keyof ApartmentFromJson }[] = [
    { label: "Título", key: "title" },
    { label: "Localização", key: "location" },
    { label: "Aluguel (R$/mês)", key: "price" },
    { label: "Área (m²)", key: "area" },
    { label: "Quartos", key: "bedrooms" },
    { label: "Banheiros", key: "bathrooms" },
    { label: "Bairro", key: "neighborhood" },
    { label: "Condomínio", key: "condominio" },
    { label: "IPTU", key: "iptu" },
    { label: "Mobiliado", key: "furnished" },
    { label: "Aceita pets", key: "petFriendly" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 pr-4 font-medium text-muted-foreground w-28">
              Critério
            </th>
            {items.map((item, i) => (
              <th
                key={item.url}
                className="text-left py-2 px-2 max-w-[180px] font-medium"
              >
                <span className="line-clamp-2" title={item.title}>
                  Imóvel {i + 1}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, key }) => (
            <tr key={key} className="border-b">
              <td className="py-2 pr-4 text-muted-foreground">{label}</td>
              {items.map((item) => {
                const value = item[key];
                const display =
                  value === undefined || value === null
                    ? "—"
                    : typeof value === "boolean"
                    ? value
                      ? "Sim"
                      : "Não"
                    : key === "price" || key === "condominio" || key === "iptu"
                    ? typeof value === "number"
                      ? `R$ ${value.toLocaleString("pt-BR")}`
                      : String(value)
                    : String(value);
                return (
                  <td
                    key={item.url}
                    className="py-2 px-2 max-w-[180px] align-top"
                  >
                    <span className="line-clamp-3" title={String(value)}>
                      {display}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CompararImoveisPage;
