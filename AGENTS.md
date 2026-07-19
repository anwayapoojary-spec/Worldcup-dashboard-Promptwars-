import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, CardHeader } from "@/components/glass-card";
import { Leaf, Zap, Droplets, Recycle, Cloud } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from "recharts";

export const Route = createFileRoute("/sustainability")({
  head: () => ({
    meta: [
      { title: "Sustainability · WorldCup AI Stadium" },
      { name: "description", content: "Energy, water, waste diversion and carbon offset for the venue." },
    ],
  }),
  component: SustainPage,
});

const KPIS = [
  { icon: Zap, label: "Energy use", value: "12.4 MWh", delta: "-6%", ok: true },
  { icon: Droplets, label: "Water", value: "184 kL", delta: "-9%", ok: true },
  { icon: Recycle, label: "Waste diverted", value: "78%", delta: "+4pt", ok: true },
  { icon: Cloud, label: "CO₂ offset", value: "42 t", delta: "+11%", ok: true },
];

const wasteData = [
  { m: "Feb", recycle: 62, compost: 12, landfill: 26 },
  { m: "Mar", recycle: 66, compost: 14, landfill: 20 },
  { m: "Apr", recycle: 71, compost: 15, landfill: 14 },
  { m: "May", recycle: 74, compost: 16, landfill: 10 },
  { m: "Jun", recycle: 78, compost: 17, landfill: 5 },
];
const energyData = Array.from({ length: 12 }, (_, i) => ({
  h: `${8 + i}:00`,
  kwh: 400 + Math.round(Math.sin(i / 2) * 120 + Math.random() * 60),
}));

const tooltipStyle = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--color-foreground)",
} as const;

function SustainPage() {
  return (
    <AppShell title="Sustainability" subtitle="Environmental performance and offsets">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        {KPIS.map((k) => (
          <GlassCard key={k.label} className="p-3.5">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-muted-foreground">
              <span>{k.label}</span>
              <k.icon className="h-3.5 w-3.5" aria-hidden />
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <div className="text-xl font-semibold tabular-nums">{k.value}</div>
              <span className={`text-[11px] ${k.ok ? "text-success" : "text-danger"}`}>{k.delta}</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">vs. previous match</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-3">
        <GlassCard className="col-span-12 lg:col-span-7">
          <CardHeader title="Waste diversion (%)" description="Recycled + composted vs landfill" />
          <div className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wasteData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="recycle" stackId="a" fill="var(--color-chart-2)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="compost" stackId="a" fill="var(--color-chart-3)" />
                <Bar dataKey="landfill" stackId="a" fill="var(--color-chart-4)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="col-span-12 lg:col-span-5">
          <CardHeader title="Hourly energy load" description="kWh today" />
          <div className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="h" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="kwh" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="col-span-12">
          <CardHeader title={<span className="inline-flex items-center gap-2"><Leaf className="h-3.5 w-3.5" /> Green initiatives</span>} />
          <ul className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {[
              { title: "Solar canopy · Lot 17", value: "2.1 MW", sub: "Feeds concourse lighting" },
              { title: "Reusable cup program", value: "412k cups", sub: "This tournament" },
              { title: "Rainwater capture", value: "68 kL", sub: "Pitch irrigation" },
            ].map((i) => (
              <li key={i.title} className="px-4 py-3">
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{i.title}</div>
                <div className="text-lg font-semibold tabular-nums">{i.value}</div>
                <div className="text-[12px] text-muted-foreground">{i.sub}</div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </AppShell>
  );
}
