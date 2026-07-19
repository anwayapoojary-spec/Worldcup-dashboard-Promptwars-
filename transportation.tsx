import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, CardHeader } from "@/components/glass-card";
import { Siren, HeartPulse, ShieldAlert, Baby, Flame, DoorOpen, Phone, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "Emergency SOS · WorldCup AI Stadium" },
      { name: "description", content: "One-tap emergency assistance, nearest exit and evacuation guidance." },
    ],
  }),
  component: EmergencyPage,
});

const CATEGORIES = [
  { icon: HeartPulse, label: "Medical", color: "text-red-600 bg-red-50 border-red-200" },
  { icon: ShieldAlert, label: "Security", color: "text-blue-700 bg-blue-50 border-blue-200" },
  { icon: Baby, label: "Lost child", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { icon: Flame, label: "Fire / smoke", color: "text-orange-700 bg-orange-50 border-orange-200" },
  { icon: DoorOpen, label: "Evacuation", color: "text-purple-700 bg-purple-50 border-purple-200" },
];

const CONTACTS = [
  { label: "Stadium Command", number: "#100" },
  { label: "Medical Dispatch", number: "#101" },
  { label: "Security Control", number: "#102" },
  { label: "Lost & Found", number: "#103" },
];

const EXITS = [
  { section: "Sec 232 (default)", exit: "Exit E · 40m", route: "Concourse 200 → E" },
  { section: "Sec 118", exit: "Exit B · 55m", route: "Concourse 100 → B" },
  { section: "Family zone", exit: "Exit D · 30m", route: "Ramp 3 → D" },
];

function EmergencyPage() {
  const [hold, setHold] = useState(0);
  const [sent, setSent] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  function start() {
    setSent(null);
    setHold(0);
    timer.current = setInterval(() => {
      setHold((h) => {
        if (h >= 100) {
          stop(true);
          return 100;
        }
        return h + 4;
      });
    }, 100);
  }
  function stop(complete = false) {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    if (complete) setSent(new Date().toLocaleTimeString());
    else setHold(0);
  }
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  return (
    <AppShell title="Emergency SOS" subtitle="Hold to alert stadium command · fan-facing">
      <div className="grid grid-cols-12 gap-3">
        <GlassCard className="col-span-12 lg:col-span-5 p-6 flex flex-col items-center justify-center min-h-[340px]">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
            Press and hold 3 seconds
          </div>
          <button
            aria-label="Send SOS alert"
            onPointerDown={start}
            onPointerUp={() => stop(false)}
            onPointerLeave={() => stop(false)}
            className="relative h-40 w-40 rounded-full bg-red-600 text-white grid place-items-center shadow-lg hover:bg-red-700 active:scale-95 transition select-none focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            <div className="absolute inset-0 rounded-full" style={{
              background: `conic-gradient(rgba(255,255,255,0.35) ${hold * 3.6}deg, transparent 0)`
            }} aria-hidden />
            <div className="relative flex flex-col items-center gap-1">
              <Siren className="h-10 w-10" aria-hidden />
              <span className="text-lg font-bold tracking-widest">SOS</span>
            </div>
          </button>
          {sent && (
            <div role="status" className="mt-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-1.5">
              ✓ Alert sent to Stadium Command at {sent}
            </div>
          )}
        </GlassCard>

        <div className="col-span-12 lg:col-span-7 grid grid-cols-1 gap-3">
          <GlassCard>
            <CardHeader title="Quick categories" description="Send a structured report" />
            <div className="p-3 grid grid-cols-2 md:grid-cols-5 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.label}
                  className={`flex flex-col items-center gap-1.5 rounded-md border px-3 py-3 text-[12px] font-medium hover:opacity-90 transition ${c.color}`}
                >
                  <c.icon className="h-5 w-5" aria-hidden />
                  {c.label}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <CardHeader title={<span className="inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Nearest exits</span>} description="Based on your section" />
            <ul className="divide-y divide-border">
              {EXITS.map((e) => (
                <li key={e.section} className="grid grid-cols-3 gap-2 px-4 py-2.5 text-[13px]">
                  <span className="font-medium">{e.section}</span>
                  <span className="text-muted-foreground">{e.route}</span>
                  <span className="text-right tabular-nums text-primary font-medium">{e.exit}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard>
            <CardHeader title={<span className="inline-flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> Emergency contacts</span>} />
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 text-[13px]">
              {CONTACTS.map((c) => (
                <li key={c.label} className="rounded-md border border-border bg-surface-2 px-3 py-2">
                  <div className="text-[11px] text-muted-foreground">{c.label}</div>
                  <div className="font-mono font-semibold">{c.number}</div>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
