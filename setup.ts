import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, CardHeader } from "@/components/glass-card";
import { useState } from "react";
import {
  AlertTriangle,
  Heart,
  Shield,
  Baby,
  Flame,
  DoorOpen,
  Phone,
  CheckCircle2,
  Radio,
} from "lucide-react";

export const Route = createFileRoute("/operations")({
  head: () => ({
    meta: [
      { title: "Operations · WorldCup AI Stadium" },
      { name: "description", content: "Command center for security, medical, and incident response." },
    ],
  }),
  component: OperationsPage,
});

const ACTIONS = [
  { id: "medical", label: "Medical", icon: Heart, tone: "danger" },
  { id: "security", label: "Security", icon: Shield, tone: "warning" },
  { id: "lost-child", label: "Lost Child", icon: Baby, tone: "primary" },
  { id: "fire", label: "Fire", icon: Flame, tone: "danger" },
  { id: "evacuation", label: "Evacuation", icon: DoorOpen, tone: "primary" },
  { id: "assist", label: "Assist request", icon: Radio, tone: "muted" },
] as const;

const CONTACTS = [
  { role: "Stadium Control", num: "*100" },
  { role: "Medical Team", num: "*911" },
  { role: "Security Command", num: "*200" },
  { role: "Lost & Found", num: "*300" },
];

const LOG = [
  { t: "20:41", zone: "Sec 122", type: "Medical", detail: "Dehydration · treated on-site", status: "Resolved" },
  { t: "20:36", zone: "Gate B", type: "Congestion", detail: "Additional turnstile opened", status: "Resolved" },
  { t: "20:22", zone: "Sec 208", type: "Accessibility", detail: "Wheelchair escort dispatched", status: "Active" },
  { t: "20:14", zone: "Perimeter N", type: "Security", detail: "Unauthorized attempt · deterred", status: "Resolved" },
  { t: "19:58", zone: "West merch", type: "Lost item", detail: "Wallet returned to owner", status: "Resolved" },
];

function toneCls(t: string) {
  return t === "danger"
    ? "bg-danger/10 text-danger border-danger/20"
    : t === "warning"
      ? "bg-warning/10 text-warning border-warning/20"
      : t === "primary"
        ? "bg-primary/10 text-primary border-primary/20"
        : "bg-muted text-muted-foreground border-border";
}

function OperationsPage() {
  const [toast, setToast] = useState<string | null>(null);

  function report(label: string) {
    setToast(`${label} dispatched · staff en route (ETA 2 min)`);
    setTimeout(() => setToast(null), 4000);
  }

  return (
    <AppShell
      title="Operations Command"
      subtitle="Incident dispatch, response, and coordination"
      actions={
        <button
          onClick={() => report("SOS broadcast")}
          className="inline-flex items-center gap-1.5 rounded-md bg-danger px-3 py-1.5 text-xs font-medium text-white hover:bg-danger/90"
        >
          <AlertTriangle className="h-3.5 w-3.5" /> Broadcast SOS
        </button>
      }
    >
      {toast && (
        <div className="mb-3 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-[13px] text-success flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5" /> {toast}
        </div>
      )}

      <div className="grid grid-cols-12 gap-3">
        <GlassCard className="col-span-12 lg:col-span-8">
          <CardHeader title="Incident log" description="Last 60 minutes" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  <th className="text-left font-medium px-4 py-2 w-16">Time</th>
                  <th className="text-left font-medium px-4 py-2">Type</th>
                  <th className="text-left font-medium px-4 py-2">Zone</th>
                  <th className="text-left font-medium px-4 py-2">Detail</th>
                  <th className="text-left font-medium px-4 py-2 w-24">Status</th>
                </tr>
              </thead>
              <tbody>
                {LOG.map((r, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-2.5 tabular-nums text-muted-foreground">{r.t}</td>
                    <td className="px-4 py-2.5 font-medium">{r.type}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{r.zone}</td>
                    <td className="px-4 py-2.5">{r.detail}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${
                          r.status === "Active"
                            ? "bg-warning/10 text-warning border-warning/20"
                            : "bg-success/10 text-success border-success/20"
                        }`}
                      >
                        <span className="h-1 w-1 rounded-full bg-current" /> {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <div className="col-span-12 lg:col-span-4 space-y-3">
          <GlassCard>
            <CardHeader title="Quick dispatch" description="Route to nearest responder" />
            <div className="p-3 grid grid-cols-2 gap-2">
              {ACTIONS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => report(a.label)}
                  className={`flex flex-col items-start gap-1.5 rounded-md border p-3 text-left transition hover:brightness-105 ${toneCls(a.tone)}`}
                >
                  <a.icon className="h-4 w-4" />
                  <div className="text-[13px] font-medium">{a.label}</div>
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <CardHeader title={<span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> Emergency contacts</span>} />
            <ul className="divide-y divide-border">
              {CONTACTS.map((c) => (
                <li key={c.role} className="flex items-center justify-between px-4 py-2 text-[13px]">
                  <span>{c.role}</span>
                  <a href={`tel:${c.num}`} className="font-mono text-primary hover:underline">{c.num}</a>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>

        <GlassCard className="col-span-12">
          <CardHeader title="Evacuation route overview" description="Recommended egress from your zone" />
          <div className="p-4">
            <div className="aspect-[3/1] rounded-md border border-border bg-surface-2 overflow-hidden">
              <svg viewBox="0 0 600 200" className="w-full h-full">
                {[80, 60, 40].map((r) => (
                  <ellipse key={r} cx="300" cy="100" rx={r * 2.4} ry={r} fill="none" stroke="var(--color-border)" />
                ))}
                <rect x="240" y="80" width="120" height="40" rx="4" fill="color-mix(in oklab, var(--color-success) 12%, transparent)" stroke="color-mix(in oklab, var(--color-success) 40%, transparent)" />
                <circle cx="470" cy="80" r="5" fill="var(--color-primary)" />
                <text x="480" y="76" fontSize="10" fill="var(--color-primary)">You · Sec 232</text>
                {[
                  { x: 40, y: 30, l: "Exit A" },
                  { x: 40, y: 170, l: "Exit B" },
                  { x: 560, y: 30, l: "Exit C · recommended" },
                  { x: 560, y: 170, l: "Exit D · accessible" },
                ].map((e) => (
                  <g key={e.l}>
                    <circle cx={e.x} cy={e.y} r="4" fill={e.l.includes("recommended") ? "var(--color-primary)" : "var(--color-success)"} />
                    <text x={e.x - (e.x > 300 ? 6 : -8)} y={e.y + 4} textAnchor={e.x > 300 ? "end" : "start"} fontSize="10" fill="var(--color-muted-foreground)">{e.l}</text>
                  </g>
                ))}
                <line x1="470" y1="80" x2="560" y2="30" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="4 4" />
              </svg>
            </div>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}
