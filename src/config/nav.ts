import type { LucideIcon } from "lucide-react";
import { Home, Settings } from "lucide-react";

export type NavItem = {
  path: string;
  label: string;
  icon?: LucideIcon;
};

/** Rotas exibidas na navegação principal. Adicione aqui para aparecer no header. */
export const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { path: "/dashboard", label: "Início", icon: Home },
  { path: "/dashboard/notificacoes", label: "Configurações", icon: Settings },
];
