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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";

const HORARIOS = [
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

const notificationSettingsSchema = z.object({
  emailEnabled: z.boolean(),
  email: z.string().optional(),
  smsEnabled: z.boolean(),
  telefone: z.string().optional(),
  whatsappEnabled: z.boolean(),
  whatsapp: z.string().optional(),
  frequencia: z.enum(["daily", "weekly"]),
  horario: z.string(),
});

type NotificationSettingsForm = z.infer<typeof notificationSettingsSchema>;

const defaultValues: NotificationSettingsForm = {
  emailEnabled: true,
  email: "",
  smsEnabled: false,
  telefone: "",
  whatsappEnabled: true,
  whatsapp: "",
  frequencia: "daily",
  horario: "09:00",
};

const NotificationSettingsPage = () => {
  const form = useForm<NotificationSettingsForm>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues,
  });

  const emailEnabled = form.watch("emailEnabled");
  const smsEnabled = form.watch("smsEnabled");
  const whatsappEnabled = form.watch("whatsappEnabled");
  const frequencia = form.watch("frequencia");

  const onSubmit = form.handleSubmit((data) => {
    // TODO: integrar com API
    console.log({
      canais: {
        email: data.emailEnabled && data.email,
        sms: data.smsEnabled && data.telefone,
        whatsapp: data.whatsappEnabled && data.whatsapp,
      },
      email: data.email,
      telefone: data.telefone,
      whatsapp: data.whatsapp,
      frequencia: data.frequencia,
      horario: data.horario,
    });
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavigation />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard" aria-label="Voltar ao dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Notificações personalizadas
              </h1>
              <p className="text-sm text-muted-foreground">
                Escolha onde receber e o horário das notificações.
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Onde receber */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Bell className="h-5 w-5 text-primary" />
                    Onde receber as notificações
                  </CardTitle>
                  <CardDescription>
                    Ative os canais desejados e informe o e-mail ou telefone
                    para cada um.
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
                                Receba resumos e novos anúncios por e-mail.
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
                          <FormLabel htmlFor="email-input">E-mail</FormLabel>
                          <FormControl>
                            <Input
                              id="email-input"
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
                          <FormLabel htmlFor="telefone-input">
                            Telefone (com DDD)
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="telefone-input"
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
                          <FormLabel htmlFor="whatsapp-input">
                            Telefone WhatsApp (com DDD)
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="whatsapp-input"
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

              {/* Horário */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    Horário e frequência
                  </CardTitle>
                  <CardDescription>
                    Quando deseja receber as notificações (resumo ou alertas).
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
                              {HORARIOS.map((h) => (
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
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard">Cancelar</Link>
                </Button>
                <Button type="submit">Salvar configurações</Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default NotificationSettingsPage;
