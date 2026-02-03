"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TopNavigation from "@/components/TopNavigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  ArrowLeft,
  RefreshCw,
  Home,
  Bed,
  Bath,
  Dog,
  Sofa,
  Clock,
  MapPin,
} from "lucide-react";

const BAIRROS = [
  { value: "pinheiros", label: "Pinheiros" },
  { value: "vila-madalena", label: "Vila Madalena" },
  { value: "jardins", label: "Jardins" },
  { value: "moema", label: "Moema" },
  { value: "itaim-bibi", label: "Itaim Bibi" },
] as const;

const refineSearchSchema = z.object({
  priceRange: z.tuple([z.number().min(500), z.number().max(10000)]),
  quartos: z.enum(["1", "2", "3", "4+"]),
  banheiros: z.enum(["1", "2", "3+"]),
  bairro: z.string(),
  petFriendly: z.boolean(),
  mobiliado: z.boolean(),
  deslocamento: z.enum(["15", "30", "45", "60"]),
});

type RefineSearchForm = z.infer<typeof refineSearchSchema>;

const defaultValues: RefineSearchForm = {
  priceRange: [1500, 4500],
  quartos: "2",
  banheiros: "1",
  bairro: "pinheiros",
  petFriendly: false,
  mobiliado: false,
  deslocamento: "30",
};

const RefinarBuscaPage = () => {
  const form = useForm<RefineSearchForm>({
    resolver: zodResolver(refineSearchSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit((data) => {
    // TODO: persistir filtros (store/API) e redirecionar
    console.log(data);
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavigation />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard" aria-label="Voltar ao dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <RefreshCw className="h-7 w-7 text-primary" />
                Refinar busca
              </h1>
              <p className="text-sm text-muted-foreground">
                Ajuste os critérios para encontrar imóveis que combinam com
                você.
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={onSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Critérios da busca</CardTitle>
                  <CardDescription>
                    Os resultados do dashboard serão filtrados conforme estes
                    critérios.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="priceRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-primary" />
                          Faixa de preço (R$/mês)
                        </FormLabel>
                        <FormControl>
                          <Slider
                            value={field.value}
                            onValueChange={field.onChange}
                            min={500}
                            max={10000}
                            step={100}
                            className="w-full"
                          />
                        </FormControl>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>
                            R$ {field.value[0].toLocaleString("pt-BR")}
                          </span>
                          <span>
                            R$ {field.value[1].toLocaleString("pt-BR")}
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quartos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Bed className="h-4 w-4 text-primary" />
                          Quartos
                        </FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            {(["1", "2", "3", "4+"] as const).map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => field.onChange(num)}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                                  field.value === num
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-foreground hover:bg-primary/10 hover:text-primary"
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="banheiros"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Bath className="h-4 w-4 text-primary" />
                          Banheiros
                        </FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            {(["1", "2", "3+"] as const).map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => field.onChange(num)}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                                  field.value === num
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-foreground hover:bg-primary/10 hover:text-primary"
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bairro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          Bairro
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BAIRROS.map((b) => (
                              <SelectItem key={b.value} value={b.value}>
                                {b.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deslocamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          Tempo de deslocamento
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="15">Até 15 min</SelectItem>
                            <SelectItem value="30">Até 30 min</SelectItem>
                            <SelectItem value="45">Até 45 min</SelectItem>
                            <SelectItem value="60">Até 1 hora</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="petFriendly"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between">
                        <FormLabel className="flex items-center gap-2 cursor-pointer">
                          <Dog className="h-4 w-4 text-primary" />
                          Aceita pets
                        </FormLabel>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(v) => field.onChange(v === true)}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mobiliado"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between">
                        <FormLabel className="flex items-center gap-2 cursor-pointer">
                          <Sofa className="h-4 w-4 text-primary" />
                          Mobiliado
                        </FormLabel>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(v) => field.onChange(v === true)}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard">Cancelar</Link>
                </Button>
                <Button type="submit">Aplicar filtros</Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default RefinarBuscaPage;
