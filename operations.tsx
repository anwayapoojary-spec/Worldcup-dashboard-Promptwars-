import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, CardHeader } from "@/components/glass-card";
import { Accessibility, Ear, Eye, Languages, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility · WorldCup AI Stadium" },
      { name: "description", content: "Accessibility services, routes and assistance requests." },
    ],
  }),
  component: AccessibilityPage,
});

const SERVICES = [
  { icon: Accessibility, label: "Wheelchair escort", value: "18 active", sub: "Avg dispatch 3 min" },
  { icon: Ear, label: "Hearing assistance", value: "42 devices", sub: "12 in use" },
  { icon: Eye, label: "Visual guides", value: "6 staff", sub: "Gates A · C · D" },
  { icon: Languages, label: "Live translation", value: "24 languages", sub: "Powered by AI" },
];

const REQUESTS = [
  { id: "R-2041", type: "Wheelchair escort", from: "Gate D", to: "Sec 208", eta: "2 min", status: "Dispatched" },
  { id: "R-2039", type: "Sign language", from: "Info · Level 2", to: "—", eta: "on-site", status: "Active" },
  { id: "R-2035", type: "Companion assist", from: "Family zone", to: "Sec 118", eta: "6 min", status: "Queued" },
];

function AccessibilityPage() {
  return (
    <AppShell title="Accessibility" subtitle="Inclusive services and live assistance">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        {SERVICES.map((s) => (
          <GlassCard key={s.label} className="p-3.5">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-muted-foreground">
              <span>{s.label}</span>
              <s.icon className="h-3.5 w-3.5" />
            </div>
            <div className="text-xl font-semibold tabular-nums mt-1">{s.value}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{s.sub}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-3">
        <GlassCard className="col-span-12 lg:col-span-8">
          <CardHeader title="Active requests" description="Assistance dispatch queue" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  <th className="text-left font-medium px-4 py-2">ID</th>
                  <th className="text-left font-medium px-4 py-2">Type</th>
                  <th className="text-left font-medium px-4 py-2">From</th>
                  <th className="text-left font-medium px-4 py-2">To</th>
                  <th className="text-right font-medium px-4 py-2">ETA</th>
                  <th className="text-left font-medium px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {REQUESTS.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-4 py-2.5 font-mono text-[12px] text-muted-foreground">{r.id}</td>
                    <td className="px-4 py-2.5 font-medium">{r.type}</td>
                    <td className="px-4 py-2.5">{r.from}</td>
                    <td className="px-4 py-2.5">{r.to}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{r.eta}</td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-medium">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard className="col-span-12 lg:col-span-4">
          <CardHeader title={<span className="flex items-center gap-2"><MessageCircle className="h-3.5 w-3.5" /> Request assistance</span>} />
          <div className="p-4 space-y-2 text-[13px]">
            {["Wheelchair escort", "Sign language interpreter", "Companion assistance", "Sensory-friendly room"].map((s) => (
              <button key={s} className="w-full text-left rounded-md border border-border bg-surface-2 px-3 py-2 hover:bg-accent transition-colors">
                {s}
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}
