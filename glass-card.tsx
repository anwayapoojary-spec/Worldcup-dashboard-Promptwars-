import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MessageSquare,
  Map,
  Users,
  Bus,
  Accessibility,
  ShieldAlert,
  FileBarChart2,
  Settings,
  Trophy,
  Search,
  Bell,
  ChevronDown,
  PanelLeft,
  Siren,
  Leaf,
  Sparkles,
  Languages,
  UserCircle2,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { FloatingAssistant } from "./floating-assistant";
import { cn } from "@/lib/utils";
import { usePrefs, ROLES, ROLE_NAV, type Role } from "@/lib/prefs";
import { LANGUAGES, type Lang } from "@/lib/i18n";

const NAV = [
  { to: "/", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { to: "/assistant", labelKey: "nav.assistant", icon: MessageSquare },
  { to: "/navigation", labelKey: "nav.map", icon: Map },
  { to: "/stadium", labelKey: "nav.crowd", icon: Users },
  { to: "/transportation", labelKey: "nav.transportation", icon: Bus },
  { to: "/accessibility", labelKey: "nav.accessibility", icon: Accessibility },
  { to: "/operations", labelKey: "nav.operations", icon: ShieldAlert },
  { to: "/emergency", labelKey: "nav.emergency", icon: Siren },
  { to: "/sustainability", labelKey: "nav.sustainability", icon: Leaf },
  { to: "/insights", labelKey: "nav.insights", icon: Sparkles },
  { to: "/reports", labelKey: "nav.reports", icon: FileBarChart2 },
  { to: "/settings", labelKey: "nav.settings", icon: Settings },
] as const;

export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { role, setRole, lang, setLang, t } = usePrefs();

  const allowed = ROLE_NAV[role];
  const visibleNav = NAV.filter((n) => allowed.includes(n.to));
  const roleMeta = ROLES.find((r) => r.code === role)!;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip to main content
      </a>

      {/* Sidebar */}
      <aside
        aria-label="Primary"
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-60 border-r border-border bg-sidebar text-sidebar-foreground flex flex-col",
          "transition-transform duration-200 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-14 flex items-center gap-2 px-4 border-b border-border">
          <div className="h-7 w-7 rounded-md bg-primary text-primary-foreground grid place-items-center">
            <Trophy className="h-4 w-4" aria-hidden />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-tight">WorldCup AI</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              FIFA 2026
            </div>
          </div>
        </div>

        <div className="px-3 py-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" aria-hidden />
            <input
              aria-label={t("search")}
              placeholder={t("search")}
              className="w-full h-8 pl-8 pr-2 rounded-md border border-border bg-surface-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-mono">
              ⌘K
            </kbd>
          </div>
        </div>

        <nav aria-label="Sections" className="flex-1 overflow-y-auto px-2 pb-4">
          <div className="px-2 pt-1 pb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
            {roleMeta.label} workspace
          </div>
          <ul className="space-y-0.5">
            {visibleNav.map((n) => {
              const active = pathname === n.to;
              return (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <n.icon
                      aria-hidden
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                      )}
                    />
                    <span className="truncate">{t(n.labelKey)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-3">
          <label className="block">
            <span className="sr-only">{t("role.label")}</span>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1">
              <UserCircle2 className="h-3 w-3" aria-hidden /> {t("role.label")}
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full h-8 rounded-md border border-border bg-surface text-xs px-2 focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              {ROLES.map((r) => (
                <option key={r.code} value={r.code}>{r.label}</option>
              ))}
            </select>
          </label>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-foreground/20 lg:hidden"
        />
      )}

      {/* Main */}
      <div className="lg:ps-60">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-14 border-b border-border bg-background/85 backdrop-blur">
          <div className="h-full flex items-center gap-3 px-4 lg:px-6">
            <button
              className="lg:hidden -ml-1 p-1.5 rounded-md hover:bg-accent"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle sidebar"
            >
              <PanelLeft className="h-4 w-4" aria-hidden />
            </button>
            <div className="min-w-0 flex-1">
              {title ? (
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-foreground truncate">{title}</div>
                  {subtitle ? (
                    <div className="text-[11px] text-muted-foreground truncate">{subtitle}</div>
                  ) : null}
                </div>
              ) : (
                <div className="text-[13px] text-muted-foreground">
                  MetLife Stadium · East Rutherford, NJ
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
                {t("top.systems")}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" aria-hidden />
                {t("top.live")}
              </span>
            </div>

            <label className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Languages className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">{t("lang.label")}</span>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                aria-label={t("lang.label")}
                className="h-7 rounded-md border border-border bg-surface text-[11px] px-1.5 focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.native}</option>
                ))}
              </select>
            </label>

            {actions}

            <button
              className="relative p-1.5 rounded-md hover:bg-accent text-muted-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" aria-hidden />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-danger" aria-hidden />
            </button>

            <div className="hidden md:flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-[11px]">
              <div className="h-4 w-4 rounded-full bg-primary/10 text-primary text-[9px] font-semibold grid place-items-center" aria-hidden>
                {roleMeta.label[0]}
              </div>
              <span className="font-medium">{roleMeta.label}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" aria-hidden />
            </div>
          </div>
        </header>

        <main id="main-content" className="px-4 lg:px-6 py-4 lg:py-6 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav aria-label="Primary mobile" className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/95 backdrop-blur">
        <div className="grid grid-cols-5">
          {visibleNav.slice(0, 5).map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 text-[10px] min-h-11",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <n.icon className="h-4 w-4" aria-hidden />
                {t(n.labelKey).split(" ")[0]}
              </Link>
            );
          })}
        </div>
      </nav>

      <FloatingAssistant open={assistantOpen} onOpenChange={setAssistantOpen} />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3 flex-wrap">
      <div className="min-w-0">
        {eyebrow ? (
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
        {description ? (
          <p className="text-[13px] text-muted-foreground mt-0.5">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
