import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const MAX_CONTEXT_CHARS = 4_000;

const bodySchema = z.object({
  context: z.string().max(MAX_CONTEXT_CHARS).optional(),
});

export const Route = createFileRoute("/api/insights")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const parsed = bodySchema.safeParse(json);
        if (!parsed.success) {
          return Response.json({ error: "Invalid request" }, { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        const gateway = createLovableAiGatewayProvider(key);
        try {
          const { text } = await generateText({
            model: gateway("google/gemini-3-flash-preview"),
            system:
              "You are a stadium operations analyst for FIFA World Cup 2026. Produce a concise 3-4 bullet 'Live Insights' briefing from the operational snapshot. Focus on crowd flow, risks, and one recommended action. Return plain markdown bullets, no preamble.",
            prompt: parsed.data.context ?? "No context provided.",
          });
          return Response.json({ text });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "AI error";
          return Response.json({ text: `_Insights unavailable: ${msg}_` }, { status: 200 });
        }
      },
    },
  },
});
