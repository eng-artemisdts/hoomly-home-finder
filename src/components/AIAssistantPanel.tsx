import Link from "next/link";
import { Sparkles, RefreshCw, Bell, BarChart3 } from "lucide-react";

const QUICK_ACTIONS = [
  { to: "/dashboard/refinar-busca", icon: RefreshCw, label: "Refinar Busca" },
  { to: "/dashboard/alertas", icon: Bell, label: "Configurar Alerta" },
  { to: "/dashboard/comparar", icon: BarChart3, label: "Comparar Imóveis" },
] as const;

const AIAssistantPanel = () => {
  return (
    <aside className="w-80 border-l border-border/50 bg-card p-5 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-lg bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Assistente AI
          </h2>
          <p className="text-xs text-muted-foreground">
            Sempre buscando para você
          </p>
        </div>
      </div>

      {/* Chat Summary */}
      <div className="ai-panel mb-4 animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-full bg-primary/10 shrink-0">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-foreground leading-relaxed">
              Encontrei{" "}
              <span className="font-semibold text-primary">
                12 novos imóveis
              </span>{" "}
              desde ontem que combinam com seus critérios.
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              3 deles estão em <span className="font-medium">Pinheiros</span>{" "}
              com ótimo custo-benefício.
            </p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div
        className="ai-panel mb-5 bg-teal-light animate-fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        <p className="text-xs font-medium text-primary mb-2">💡 Insight</p>
        <p className="text-sm text-foreground leading-relaxed">
          Os preços em Pinheiros caíram 8% nas últimas 2 semanas. Ótimo momento
          para negociar!
        </p>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Ações Rápidas
        </p>
        <div className="space-y-2">
          {QUICK_ACTIONS.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              href={to}
              className="quick-action w-full justify-start gap-2.5"
            >
              <Icon className="h-4 w-4 text-primary shrink-0" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 pt-5 border-t border-border/50">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Atividade Recente
        </p>
        <div className="space-y-3">
          {[
            {
              action: "Imóvel salvo",
              detail: "Rua Harmonia, 245",
              time: "2h atrás",
            },
            {
              action: "Alerta criado",
              detail: "Vila Madalena",
              time: "5h atrás",
            },
            {
              action: "Busca atualizada",
              detail: "Filtro de preço",
              time: "1 dia",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm text-foreground">{item.action}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default AIAssistantPanel;
