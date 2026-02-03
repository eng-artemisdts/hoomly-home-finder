"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV_ITEMS } from "@/config/nav";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const TopNavigation = () => {
  const pathname = usePathname();

  return (
    <header className="h-16 border-b border-border/50 bg-card px-6 flex items-center justify-between">
      <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
        <Image src={logo} alt="Hoomly AI" className="h-8 w-auto" width={120} height={32} />
      </Link>

      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cidade, bairro ou rua"
            className="search-input w-full pl-11 pr-4"
          />
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-secondary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Abrir menu da conta"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face" />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              JD
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground">João</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">João</p>
              <p className="text-xs text-muted-foreground">joao@exemplo.com</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <DropdownMenuItem key={item.path} asChild>
                <Link
                  href={item.path}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer",
                    isActive && "bg-primary/10 text-primary"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {Icon && <Icon className="h-4 w-4 shrink-0" />}
                  {item.label}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default TopNavigation;
