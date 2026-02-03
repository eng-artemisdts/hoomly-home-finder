"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  MessageSquare,
  Phone,
  ArrowLeft,
  Bell,
  Clock,
  BellRing,
} from "lucide-react";

const ALERT_TIMES = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "12:00",
  "14:00",
  "18:00",
  "20:00",
  "22:00",
] as const;

const alertSchema = z.object({
  nomeAlerta: z.string().optional(),
  emailEnabled: z.boolean(),
  email: z.string().optional(),
  smsEnabled: z.boolean(),
  telefone: z.string().optional(),
  whatsappEnabled: z.boolean(),
  whatsapp: z.string().optional(),
  frequencia: z.enum(["daily", "weekly"]),
  horario: z.string(),
  apenasNovos: z.boolean(),
});

type AlertForm = z.infer<typeof alertSchema>;

const defaultValues: AlertForm = {
  nomeAlerta: "",
  emailEnabled: true,
  email: "",
  smsEnabled: false,
  telefone: "",
  whatsappEnabled: true,
  whatsapp: "",
  frequencia: "daily",
  horario: "09:00",
  apenasNovos: true,
};

const AlertsPage = () => {
  const params = useParams();
  const id = params?.id;
  const idStr = typeof id === "string" ? id : Array.isArray(id) ? id[0] : undefined;
  const isEdit = Boolean(idStr);

  const form = useForm<AlertForm>({
    resolver: zodResolver(alertSchema),
    defaultValues,
  });

  const emailEnabled = form.watch("emailEnabled");
  const smsEnabled = form.watch("smsEnabled");
  const whatsappEnabled = form.watch("whatsappEnabled");
  const frequencia = form.watch("frequencia");

  const onSubmit = form.handleSubmit((data) => {
    // TODO: integrar com API
    console.log("Configuração do alerta:", data);
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavigation />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/alertas" aria-label="Voltar aos alertas">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <BellRing className="h-7 w-7 text-primary" />
                {isEdit ? "Editar alerta" : "Configurar alerta"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Defina onde receber e quando deseja ser avisado sobre novos
                imóveis.
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Nome do alerta (opcional) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Bell className="h-5 w-5 text-primary" />
                    Dados do alerta
                  </CardTitle>
                  <CardDescription>
                    Dê um nome para identificar este alerta (opcional).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="nomeAlerta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do alerta</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Apartamentos Pinheiros até R$ 3.000"
                            {...field}
                            className="mt-1.5"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Onde enviar */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Onde enviar o alerta
                  </CardTitle>
                  <CardDescription>
                    Ative os canais e informe e-mail ou telefone para cada um.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="emailEnabled"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-primary" />
                            <div>
                              <FormLabel>E-mail</FormLabel>
                              <FormDescription>
                                Receba o resumo de novos imóveis por e-mail.
                              </FormDescription>
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  {emailEnabled && (
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="pl-8">
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="seu@email.com"
                              {...field}
                              className="mt-1.5"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}

                  <Separator />

                  <FormField
                    control={form.control}
                    name="smsEnabled"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-primary" />
                            <div>
                              <FormLabel>SMS</FormLabel>
                              <FormDescription>
                                Alertas por mensagem de texto.
                              </FormDescription>
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  {smsEnabled && (
                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem className="pl-8">
                          <FormLabel>Telefone (com DDD)</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="(11) 99999-9999"
                              {...field}
                              className="mt-1.5"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}

                  <Separator />

                  <FormField
                    control={form.control}
                    name="whatsappEnabled"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            <div>
                              <FormLabel>WhatsApp</FormLabel>
                              <FormDescription>
                                Notificações direto no WhatsApp.
                              </FormDescription>
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  {whatsappEnabled && (
                    <FormField
                      control={form.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem className="pl-8">
                          <FormLabel>Telefone WhatsApp (com DDD)</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="(11) 99999-9999"
                              {...field}
                              className="mt-1.5"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Configurações do alerta */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    Configurações do alerta
                  </CardTitle>
                  <CardDescription>
                    Quando e como deseja receber os avisos.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="frequencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequência</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="mt-1.5 w-full">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">
                              Diário (resumo no horário escolhido)
                            </SelectItem>
                            <SelectItem value="weekly">
                              Semanal (resumo semanal)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  {(frequencia === "daily" || frequencia === "weekly") && (
                    <FormField
                      control={form.control}
                      name="horario"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário de envio</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className="mt-1.5 w-full">
                                <SelectValue placeholder="Selecione o horário" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ALERT_TIMES.map((h) => (
                                <SelectItem key={h} value={h}>
                                  {h}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="apenasNovos"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                          <div>
                            <FormLabel>Apenas imóveis novos</FormLabel>
                            <FormDescription>
                              Receber só anúncios que ainda não foram enviados
                              em alertas anteriores.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/alertas">Cancelar</Link>
                </Button>
                <Button type="submit">
                  {isEdit ? "Salvar alterações" : "Salvar alerta"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default AlertsPage;
