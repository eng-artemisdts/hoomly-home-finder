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
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BellRing,
  Plus,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AlertListItem = {
  id: string;
  name: string;
  channels: { email?: string; sms?: string; whatsapp?: string };
  frequency: "daily" | "weekly";
  lastRun: string | null;
  createdAt: string;
};

/** Mock: substituir por chamada à API. */
const MOCK_ALERTS: AlertListItem[] = [
  {
    id: "1",
    name: "Apartamentos Pinheiros até R$ 3.000",
    channels: { email: "joao@exemplo.com", whatsapp: "(11) 99999-9999" },
    frequency: "daily",
    lastRun: "2025-02-02T09:00:00",
    createdAt: "2025-01-15T10:00:00",
  },
  {
    id: "2",
    name: "Vila Madalena 2 quartos",
    channels: { email: "joao@exemplo.com" },
    frequency: "weekly",
    lastRun: null,
    createdAt: "2025-01-28T14:00:00",
  },
  {
    id: "3",
    name: "Alerta geral",
    channels: { email: "joao@exemplo.com", sms: "(11) 98888-8888" },
    frequency: "daily",
    lastRun: "2025-02-01T09:00:00",
    createdAt: "2025-01-10T08:00:00",
  },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function channelLabels(channels: AlertListItem["channels"]): string[] {
  const labels: string[] = [];
  if (channels.email) labels.push("E-mail");
  if (channels.sms) labels.push("SMS");
  if (channels.whatsapp) labels.push("WhatsApp");
  return labels;
}

const AlertsListPage = () => {
  const alerts = MOCK_ALERTS;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavigation />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="w-full max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard" aria-label="Voltar ao dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                  <BellRing className="h-7 w-7 text-primary" />
                  Meus alertas
                </h1>
                <p className="text-sm text-muted-foreground">
                  Alertas configurados e quando foram executados pela última
                  vez.
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/dashboard/alertas/novo" className="gap-2">
                <Plus className="h-4 w-4" />
                Novo alerta
              </Link>
            </Button>
          </div>

          {alerts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BellRing className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground mb-4">
                  Nenhum alerta configurado ainda.
                </p>
                <Button asChild>
                  <Link href="/dashboard/alertas/novo" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Criar primeiro alerta
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <ul className="space-y-3">
              {alerts.map((alert) => (
                <li key={alert.id}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h2 className="font-medium text-foreground truncate">
                            {alert.name || "Alerta sem nome"}
                          </h2>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                            {channelLabels(alert.channels).map((label) => (
                              <span
                                key={label}
                                className="inline-flex items-center gap-1"
                              >
                                {label === "E-mail" && (
                                  <Mail className="h-3 w-3" />
                                )}
                                {label === "SMS" && (
                                  <Phone className="h-3 w-3" />
                                )}
                                {label === "WhatsApp" && (
                                  <MessageSquare className="h-3 w-3" />
                                )}
                                {label}
                              </span>
                            ))}
                            <span className="text-border">·</span>
                            <span>
                              {alert.frequency === "daily"
                                ? "Diário"
                                : "Semanal"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {alert.lastRun ? (
                            <Badge
                              variant="secondary"
                              className={cn(
                                "font-normal whitespace-nowrap",
                                "bg-primary/10 text-primary"
                              )}
                            >
                              Última execução: {formatDate(alert.lastRun)}
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="font-normal whitespace-nowrap"
                            >
                              Aguardando primeira execução
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/dashboard/alertas/${alert.id}/editar`}
                              className="gap-1.5 text-primary"
                            >
                              Editar
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default AlertsListPage;
