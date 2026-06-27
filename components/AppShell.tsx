"use client";

import {
  Bell,
  BookOpen,
  ChevronDown,
  ClipboardList,
  Headphones,
  Home,
  Megaphone,
  Moon,
  Search,
  Sun,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Screen, Theme } from "@/lib/types";
import { STUDENT } from "@/lib/data";
import { InatelLogo } from "./InatelLogo";

type AppShellProps = {
  children: ReactNode;
  screen: Screen;
  theme: Theme;
  onToggleTheme: () => void;
  onNavigate: (screen: Screen) => void;
};

const desktopNavigation = [
  { id: "home" as Screen, label: "Início", icon: Home },
  { id: "support" as Screen, label: "Atendimento", icon: Headphones },
  { id: "service" as Screen, label: "Avisos", icon: Megaphone, badge: "2" },
  { id: "jobs" as Screen, label: "Vagas", icon: Search },
  { id: "service" as Screen, label: "Acadêmico", icon: BookOpen },
  { id: "profile" as Screen, label: "Perfil", icon: UserRound },
];

const mobileNavigation = [
  { id: "home" as Screen, label: "Início", icon: Home },
  { id: "support" as Screen, label: "Atendimento", icon: Headphones },
  { id: "service" as Screen, label: "Avisos", icon: Megaphone },
  { id: "profile" as Screen, label: "Perfil", icon: UserRound },
];

export function AppShell({ children, screen, theme, onToggleTheme, onNavigate }: AppShellProps) {
  const hideMobileNav = screen === "detail";
  const ThemeIcon = theme === "light" ? Moon : Sun;

  return (
    <div className="app-shell">
      <aside className="desktop-sidebar">
        <button className="sidebar-logo-button" onClick={() => onNavigate("home")} aria-label="Ir para o início">
          <InatelLogo />
        </button>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {desktopNavigation.map((item, index) => {
            const Icon = item.icon;
            const isAcademic = item.label === "Acadêmico";
            const isNotices = item.label === "Avisos";
            const active = screen === item.id && (!isNotices && !isAcademic);
            return (
              <button
                className={`nav-button ${active ? "nav-button--active" : ""}`}
                key={`${item.label}-${index}`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon size={21} strokeWidth={1.8} />
                <span>{item.label}</span>
                {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-help">
          <ClipboardList size={22} />
          <strong>Atendimento em destaque</strong>
          <span>Use o chat para tirar dúvidas acadêmicas, anexar solicitações e acompanhar retornos.</span>
          <button onClick={() => onNavigate("support")}>Abrir atendimento</button>
        </div>
      </aside>

      <section className="app-stage">
        <header className="desktop-topbar">
          <div className="topbar-context">
            <span>Portal do aluno</span>
            <strong>Inatel Conecta</strong>
          </div>
          <div className="topbar-actions">
            <button className="theme-toggle" onClick={onToggleTheme} aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}>
              <ThemeIcon size={18} />
              <span>{theme === "light" ? "Escuro" : "Claro"}</span>
            </button>
            <button className="icon-button notification-button" aria-label="Notificações">
              <Bell size={21} /><span />
            </button>
            <button className="user-menu" onClick={() => onNavigate("profile")}>
              <span className="avatar avatar--small">{STUDENT.initials}</span>
              <span className="user-menu-copy">
                <strong>{STUDENT.name}</strong>
                <small>{STUDENT.course} · {STUDENT.period}º período</small>
              </span>
              <ChevronDown size={17} />
            </button>
          </div>
        </header>

        <div className={`app-content ${hideMobileNav ? "app-content--flush-mobile" : ""}`}>{children}</div>

        <nav className={`mobile-nav ${hideMobileNav ? "mobile-nav--hidden" : ""}`} aria-label="Navegação principal">
          {mobileNavigation.map((item) => {
            const Icon = item.icon;
            const active = screen === item.id || (screen === "detail" && item.id === "jobs");
            return (
              <button key={item.id} onClick={() => onNavigate(item.id)} className={active ? "mobile-nav-item--active" : ""}>
                <Icon size={23} strokeWidth={active ? 2.4 : 1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </section>
    </div>
  );
}
