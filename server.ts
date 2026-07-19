import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, CardHeader } from "@/components/glass-card";
import {
  Activity,
  Users,
  DoorOpen,
  Bus,
  AlertTriangle,
  ShieldCheck,
  Heart,
  Cloud,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  ChevronRight,
  MapPin,
  Wifi,
  Zap,
  Droplet,
  CircleDot,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import { useLiveStadium, densityFromPct, MATCH_SCHEDULE } from "@/lib/mock/live";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Operations Dashboard · WorldCup AI Stadium" },
      { name: "description", content: "Live match-day operations console — crowd, transport, incidents, and AI insights." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const snap = useLiveStadium();
  const [insight, setInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const ctx = `Occupancy: ${snap.occupancyPct}%. Gates: ${snap.gates
        .map((g) => `${g.name} ${g.pct}% wait ${g.waitMin}min`)
        .join("; ")}.`;
      try {
        const r = await fetch("/api/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ context: ctx }),
        });
        const j = (await r.json()) as { text?: string };
        if (!cancelled) setInsight(j.text ?? "");
      } finally {
        if (!cancelled) setLoadingInsight(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const busiestGate = snap.gates.reduce((a, b) => (a.pct > b.pct ? a : b));
  const avgWait = Math.round(snap.gates.reduce((s, g) => s + g.waitMin, 0) / snap.gates.length);

  return (
    <AppShell
      title="Operations Dashboard"
      subtitle="ARG vs BRA · Kickoff 20:00 · MetLife Stadium"
      actions={
        <button className="hidden md:inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
          <Sparkles className="h-3.5 w-3.5" /> Ask AI
        </button>
      }
    >
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <Kpi label="Occupancy" value={`${snap.occupancyPct}%`} delta="+4.2%" trend="up" hint={`${(snap.occupancyPct * 828).toLocaleString()} attendees`} icon={Users} />
        <Kpi label="Avg gate wait" value={`${avgWait}m`} delta="-1.1m" trend="down" hint={`Busiest: Gate ${busiestGate.id}`} icon={DoorOpen} />
        <Kpi label="Active incidents" value="3" delta="+1" trend="up" tone="warning" hint="1 medical · 2 minor" icon={AlertTriangle} />
        <Kpi label="Systems" value="98.7%" delta="stable" hint="All services green" tone="success" icon={ShieldCheck} />
      </div>

      {/* Main grid — dense enterprise layout */}
      <div className="grid grid-cols-12 gap-3">
        {/* Live crowd */}
        <GlassCard className="col-span-12 lg:col-span-8">
          <CardHeader
            title="Live crowd occupancy"
            description="Rolling 60 min · updates every 4s"
            action={
              <div className="flex items-center gap-1 text-[11px]">
                <LegendDot color="var(--color-chart-1)" /> Attendance
                <LegendDot color="var(--color-chart-2)" className="ml-2" /> Entries
              </div>
            }
          />
          <div className="p-4">
            <div className="flex items-baseline gap-3 mb-3">
              <div className="text-2xl font-semibold tabular-nums">{snap.occupancyPct}%</div>
              <span className="inline-flex items-center gap-1 text-xs text-success">
                <ArrowUpRight className="h-3 w-3" /> +4.2% vs. last hour
              </span>
              <span className="ml-auto text-[11px] text-muted-foreground">
                Capacity 82,500
              </span>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={snap.seriesOccupancy.map((s, i) => ({ ...s, entries: snap.seriesFlow[i]?.entries ?? 0 }))} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="occFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={tooltipStyle} labelStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="v" stroke="var(--color-chart-1)" fill="url(#occFill)" strokeWidth={2} name="Occupancy" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassCard>

        {/* AI Insights */}
        <GlassCard className="col-span-12 lg:col-span-4">
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> AI insights
              </span>
            }
            description="Model: Gemini · updated 2m ago"
            action={<span className="text-[10px] text-muted-foreground uppercase tracking-widest">Live</span>}
          />
          <div className="p-4 space-y-3">
            {loadingInsight ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing operations…
              </div>
            ) : (
              <p className="text-[13px] leading-relaxed text-foreground/90 whitespace-pre-wrap line-clamp-[10]">
                {insight || "No insights available."}
              </p>
            )}
            <div className="pt-2 border-t border-border grid grid-cols-3 gap-2">
              <MiniStat label="Confidence" value="92%" />
              <MiniStat label="Signals" value="184" />
              <MiniStat label="Actions" value="6" />
            </div>
          </div>
        </GlassCard>

        {/* Gate table */}
        <GlassCard className="col-span-12 lg:col-span-8">
          <CardHeader
            title="Gates & entry"
            description="Wait times and flow"
            action={<Link to="/stadium" className="text-[11px] text-primary hover:underline inline-flex items-center gap-0.5">View all <ChevronRight className="h-3 w-3" /></Link>}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  <th className="text-left font-medium px-4 py-2">Gate</th>
                  <th className="text-left font-medium px-4 py-2">Status</th>
                  <th className="text-right font-medium px-4 py-2">Wait</th>
                  <th className="text-right font-medium px-4 py-2">Load</th>
                  <th className="px-4 py-2 w-32">Utilization</th>
                </tr>
              </thead>
              <tbody>
                {snap.gates.map((g) => {
                  const d = densityFromPct(g.pct);
                  return (
                    <tr key={g.id} className="border-t border-border">
                      <td className="px-4 py-2.5">
                        <div className="font-medium">{g.name}</div>
                        <div className="text-[11px] text-muted-foreground">ID · Gate-{g.id}</div>
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusChip density={d} />
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{g.waitMin} min</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{g.pct}%</td>
                      <td className="px-4 py-2.5">
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={
                              d === "critical"
                                ? "h-full bg-danger"
                                : d === "busy"
                                  ? "h-full bg-warning"
                                  : d === "medium"
                                    ? "h-full bg-primary"
                                    : "h-full bg-success"
                            }
                            style={{ width: `${g.pct}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Incident feed */}
        <GlassCard className="col-span-12 lg:col-span-4">
          <CardHeader title="Incident feed" description="Last 30 min" />
          <ul className="divide-y divide-border">
            {INCIDENTS.map((i) => (
              <li key={i.id} className="flex items-start gap-3 px-4 py-2.5">
                <span
                  className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${
                    i.severity === "high" ? "bg-danger" : i.severity === "med" ? "bg-warning" : "bg-success"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium truncate">{i.title}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {i.zone} · {i.ago}
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {i.status}
                </span>
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Transportation */}
        <GlassCard className="col-span-12 lg:col-span-4">
          <CardHeader
            title={<span className="flex items-center gap-2"><Bus className="h-3.5 w-3.5 text-muted-foreground" /> Transportation</span>}
            description="Inbound flow"
          />
          <div className="p-4 space-y-2.5">
            {TRANSPORT.map((t) => (
              <div key={t.mode} className="flex items-center gap-3">
                <div className="w-24 text-[12px] text-muted-foreground">{t.mode}</div>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${t.pct}%` }} />
                </div>
                <div className="w-14 text-right text-[12px] tabular-nums">{t.pct}%</div>
                <div className={`w-16 text-right text-[11px] ${t.delta >= 0 ? "text-success" : "text-danger"}`}>
                  {t.delta >= 0 ? "+" : ""}{t.delta}%
                </div>
              </div>
            ))}
            <div className="pt-3 mt-1 border-t border-border grid grid-cols-2 gap-2 text-[12px]">
              <div>
                <div className="text-muted-foreground text-[11px]">Next shuttle</div>
                <div className="font-medium">4 min · Lot 17</div>
              </div>
              <div>
                <div className="text-muted-foreground text-[11px]">Rideshare surge</div>
                <div className="font-medium">1.6× · East plaza</div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Weather */}
        <GlassCard className="col-span-12 md:col-span-6 lg:col-span-4">
          <CardHeader title={<span className="flex items-center gap-2"><Cloud className="h-3.5 w-3.5 text-muted-foreground" /> Weather</span>} description="Next 6 hours" />
          <div className="p-4">
            <div className="flex items-end gap-4 mb-3">
              <div className="text-3xl font-semibold tabular-nums">22°</div>
              <div className="text-[13px] text-muted-foreground pb-1">Clear · Wind 8 km/h · Humidity 54%</div>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={WEATHER} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={40} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="temp" stroke="var(--color-chart-3)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassCard>

        {/* Upcoming matches */}
        <GlassCard className="col-span-12 lg:col-span-6">
          <CardHeader title="Upcoming matches" description="Group stage · knockouts" action={<Link to="/reports" className="text-[11px] text-primary hover:underline">Schedule</Link>} />
          <ul className="divide-y divide-border">
            {MATCH_SCHEDULE.slice(0, 4).map((m) => (
              <li key={m.id} className="flex items-center gap-3 px-4 py-2.5">
                <div className="w-14 text-[11px] tabular-nums text-muted-foreground">
                  <div className="font-medium text-foreground">{m.date}</div>
                  <div>{m.time}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium truncate">{m.teams}</div>
                  <div className="text-[11px] text-muted-foreground">{m.stage}</div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md border ${
                    m.status === "Today"
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {m.status}
                </span>
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Mini map */}
        <GlassCard className="col-span-12 lg:col-span-6">
          <CardHeader title="Stadium map" description="Zone density snapshot" action={<Link to="/navigation" className="text-[11px] text-primary hover:underline inline-flex items-center gap-0.5">Open <ChevronRight className="h-3 w-3" /></Link>} />
          <div className="p-4">
            <MiniMap zones={snap.zones} />
          </div>
        </GlassCard>

        {/* Resource status */}
        <GlassCard className="col-span-12">
          <CardHeader title="Resource status" description="Infrastructure & staffing" />
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
            {RESOURCES.map((r) => (
              <div key={r.label} className="px-4 py-3 flex items-center gap-3">
                <div className={`h-8 w-8 rounded-md grid place-items-center ${r.tone === "ok" ? "bg-success/10 text-success" : r.tone === "warn" ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger"}`}>
                  <r.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-muted-foreground">{r.label}</div>
                  <div className="text-sm font-medium tabular-nums">{r.value}</div>
                </div>
                <div className="ml-auto text-[11px] text-muted-foreground tabular-nums">{r.sub}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}

const tooltipStyle = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
  boxShadow: "0 4px 12px rgb(15 23 42 / 0.08)",
  color: "var(--color-foreground)",
} as const;

const INCIDENTS = [
  { id: 1, title: "Minor medical assist · dehydration", zone: "Sec 122", ago: "2m ago", severity: "med", status: "Open" },
  { id: 2, title: "Congestion at Gate B turnstile 4", zone: "Gate B", ago: "6m ago", severity: "med", status: "Ack" },
  { id: 3, title: "Lost item reported", zone: "West merch", ago: "11m ago", severity: "low", status: "Open" },
  { id: 4, title: "Wheelchair assist requested", zone: "Sec 208", ago: "14m ago", severity: "low", status: "Dispatched" },
  { id: 5, title: "Unauthorized entry attempt", zone: "Perimeter N", ago: "22m ago", severity: "high", status: "Resolved" },
] as const;

const TRANSPORT = [
  { mode: "Rail · NJ Transit", pct: 78, delta: 12 },
  { mode: "Shuttle", pct: 64, delta: 5 },
  { mode: "Rideshare", pct: 52, delta: -3 },
  { mode: "Parking", pct: 89, delta: 2 },
];

const WEATHER = [
  { t: "18:00", temp: 22 },
  { t: "19:00", temp: 21 },
  { t: "20:00", temp: 20 },
  { t: "21:00", temp: 19 },
  { t: "22:00", temp: 18 },
  { t: "23:00", temp: 17 },
];

const RESOURCES = [
  { label: "Network", value: "12.4 Gbps", sub: "healthy", tone: "ok" as const, icon: Wifi },
  { label: "Power", value: "78%", sub: "generator idle", tone: "ok" as const, icon: Zap },
  { label: "Water", value: "62%", sub: "reserve", tone: "warn" as const, icon: Droplet },
  { label: "Staff on shift", value: "1,284", sub: "94% attendance", tone: "ok" as const, icon: ShieldCheck },
];

function Kpi({
  label,
  value,
  delta,
  trend,
  hint,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  hint?: string;
  tone?: "success" | "warning";
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <GlassCard className="p-3.5">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <div className="text-xl font-semibold tabular-nums tracking-tight">{value}</div>
        {delta ? (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] ${
              tone === "warning"
                ? "text-warning"
                : tone === "success"
                  ? "text-success"
                  : trend === "down"
                    ? "text-success"
                    : "text-danger"
            }`}
          >
            {trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : trend === "down" ? <ArrowDownRight className="h-3 w-3" /> : <CircleDot className="h-3 w-3" />}
            {delta}
          </span>
        ) : null}
      </div>
      {hint ? <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div> : null}
    </GlassCard>
  );
}

function StatusChip({ density }: { density: "low" | "medium" | "busy" | "critical" }) {
  const meta = {
    low: { label: "Low", cls: "bg-success/10 text-success border-success/20" },
    medium: { label: "Moderate", cls: "bg-primary/10 text-primary border-primary/20" },
    busy: { label: "Busy", cls: "bg-warning/10 text-warning border-warning/20" },
    critical: { label: "Critical", cls: "bg-danger/10 text-danger border-danger/20" },
  }[density];
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${meta.cls}`}>
      <span className="h-1 w-1 rounded-full bg-current" /> {meta.label}
    </span>
  );
}

function LegendDot({ color, className = "" }: { color: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-muted-foreground ${className}`}>
      <span className="h-2 w-2 rounded-sm" style={{ background: color }} />
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-sm font-medium tabular-nums">{value}</div>
    </div>
  );
}

function MiniMap({ zones }: { zones: { name: string; pct: number }[] }) {
  const cells = [
    { name: "North", x: 1, y: 0, w: 2, h: 1 },
    { name: "West", x: 0, y: 1, w: 1, h: 1 },
    { name: "Pitch", x: 1, y: 1, w: 2, h: 1, pitch: true },
    { name: "East", x: 3, y: 1, w: 1, h: 1 },
    { name: "South", x: 1, y: 2, w: 2, h: 1 },
  ];
  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-1 aspect-[4/3]">
      {cells.map((c) => {
        const z = zones.find((z) => z.name.toLowerCase().startsWith(c.name.toLowerCase()));
        const pct = z?.pct ?? 40;
        const d = densityFromPct(pct);
        if (c.pitch) {
          return (
            <div
              key={c.name}
              className="col-span-2 row-span-1 rounded-md border border-border bg-success/10 grid place-items-center text-[10px] uppercase tracking-widest text-success/80"
              style={{ gridColumn: `${c.x + 1} / span ${c.w}`, gridRow: `${c.y + 1} / span ${c.h}` }}
            >
              Pitch
            </div>
          );
        }
        return (
          <div
            key={c.name}
            className={`rounded-md border p-2 ${
              d === "critical"
                ? "bg-danger/10 border-danger/25 text-danger"
                : d === "busy"
                  ? "bg-warning/10 border-warning/25 text-warning"
                  : d === "medium"
                    ? "bg-primary/10 border-primary/20 text-primary"
                    : "bg-success/10 border-success/25 text-success"
            }`}
            style={{ gridColumn: `${c.x + 1} / span ${c.w}`, gridRow: `${c.y + 1} / span ${c.h}` }}
          >
            <div className="text-[10px] uppercase tracking-widest opacity-70 flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5" /> {c.name}
            </div>
            <div className="text-sm font-semibold tabular-nums">{pct}%</div>
          </div>
        );
      })}
    </div>
  );
}
