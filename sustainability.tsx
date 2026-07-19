import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, CardHeader } from "@/components/glass-card";
import { ChatPanel } from "@/components/chat-panel";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant · WorldCup AI Stadium" },
      { name: "description", content: "Chat with the FIFA 2026 stadium AI. Voice and text." },
    ],
  }),
  component: AssistantPage,
});

function AssistantPage() {
  return (
    <AppShell title="AI Assistant" subtitle="Ask about seats, gates, food, safety, transport, or the match">
      <div className="grid grid-cols-12 gap-3">
        <GlassCard className="col-span-12 lg:col-span-9 h-[calc(100vh-9rem)] min-h-[520px] overflow-hidden flex flex-col">
          <ChatPanel />
        </GlassCard>
        <GlassCard className="col-span-12 lg:col-span-3">
          <CardHeader title="Suggestions" description="Try one of these" />
          <div className="p-3 space-y-2 text-[13px]">
            {[
              "Fastest route to Section 232 from Gate B?",
              "Where's the nearest prayer room?",
              "Show me halal food options",
              "Report a medical incident",
              "Predict crowd at Gate B in 20 min",
            ].map((s) => (
              <div key={s} className="rounded-md border border-border bg-surface-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer transition-colors">
                {s}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}
