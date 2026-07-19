import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, CardHeader } from "@/components/glass-card";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "AI Insights · WorldCup AI Stadium" },
      { name: "description", content: "On-demand AI briefings for crowd, safety, transport and sustainability." },
    ],
  }),
  component: InsightsPage,
});

const TOPICS = [
  {
    key: "crowd",
    title: "Crowd flow",
    context: "Occupancy 84%. Gate B congestion critical (wait 22 min). Zone East food court peaking at 91%. Kickoff in 40 min.",
  },
  {
    key: "safety",
    title: "Safety & incidents",
    context: "3 active medical (2 minor, 1 fainting). 1 security escort in Sec 108. Weather 22°C clear. No fire alarms. Evacuation route D clear.",
  },
  {
    key: "transport",
    title: "Transport",
    context: "Rail 78% capacity on time. Shuttle Lot 17 next 4 min. Rideshare 1.6× surge. Lot A full, redirect to Lot 21.",
  },
  {
    key: "sustainability",
    title: "Sustainability",
    context: "Energy trending -6%. Waste diversion 78%. Reusable-cup return rate 71%. CO₂ offset +11% vs last match.",
  },
];

type Briefing = { key: string; title: string; text: string; at: string };

function InsightsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [briefings, setBriefings] = useState<Briefing[]>([]);

  async function generate(topic: (typeof TOPICS)[number]) {
    setLoading(topic.key);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ context: `${topic.title}: ${topic.context}` }),
      });
      const { text } = (await res.json()) as { text: string };
      setBriefings((b) => [
        { key: topic.key, title: topic.title, text, at: new Date().toLocaleTimeString() },
        ...b,
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed";
      setBriefings((b) => [
        { key: topic.key, title: topic.title, text: `_Error: ${msg}_`, at: new Date().toLocaleTimeString() },
        ...b,
      ]);
    } finally {
      setLoading(null);
    }
  }

  return (
    <AppShell title="AI Insights" subtitle="Generative briefings from live operational data">
      <div className="grid grid-cols-12 gap-3">
        <GlassCard className="col-span-12 lg:col-span-5">
          <CardHeader
            title={<span className="inline-flex items-center gap-2"><Sparkles className="h-3.5 w-3.5" /> Briefings</span>}
            description="Tap to generate"
          />
          <div className="p-3 space-y-2">
            {TOPICS.map((t) => (
              <button
                key={t.key}
                onClick={() => generate(t)}
                disabled={loading === t.key}
                className="w-full flex items-center justify-between rounded-md border border-border bg-surface-2 hover:bg-accent transition px-3 py-2.5 text-left"
              >
                <div>
                  <div className="text-[13px] font-medium">{t.title}</div>
                  <div className="text-[11px] text-muted-foreground line-clamp-1">{t.context}</div>
                </div>
                {loading === t.key ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                )}
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="col-span-12 lg:col-span-7">
          <CardHeader title="Recent briefings" description="Latest first · in-memory" />
          <div className="p-3 space-y-2 max-h-[560px] overflow-y-auto">
            {briefings.length === 0 && (
              <div className="text-center py-12 text-sm text-muted-foreground">
                No briefings yet — generate one on the left.
              </div>
            )}
            {briefings.map((b, i) => (
              <article key={i} className="rounded-md border border-border bg-surface p-3">
                <header className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                  <span className="font-medium text-foreground">{b.title}</span>
                  <time className="tabular-nums">{b.at}</time>
                </header>
                <div className="text-[13px] leading-relaxed whitespace-pre-wrap">{b.text}</div>
              </article>
            ))}
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}
