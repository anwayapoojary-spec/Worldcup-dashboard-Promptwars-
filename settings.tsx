import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are the WorldCup AI Stadium Assistant for the FIFA World Cup 2026 at MetLife Stadium (mock demo).

You help fans, staff, volunteers, organizers, security, and emergency responders with:
- Match schedules and seat/gate/parking guidance
- Stadium navigation (restrooms, food courts, medical, prayer rooms, charging, merch, water, exits, wheelchair routes)
- Crowd status and best times to move
- Transportation (shuttles, metro, ride-share)
- Emergency guidance and evacuation
- Lost & Found, food recommendations, merchandise
- Personalized match-day itineraries

Context (mock demo data):
- Venue: MetLife Stadium — Section 232, Row 14, Seat 8 (default fan profile)
- Today's match: Argentina vs. Brazil, kickoff 20:00 local
- Gates: A (VIP), B (main), C (family), D (accessibility). Gate B is currently busiest.
- Weather: 22°C, clear.

Be concise, friendly, and action-oriented. Use short paragraphs and bullet lists. When relevant, suggest a next step (e.g. "Head to Gate C — 6 min walk"). Never invent emergency numbers; direct users to the Emergency Center for real incidents.`;

// Cap request payloads to protect the AI gateway budget from abuse.
const MAX_BODY_BYTES = 64 * 1024;
const MAX_MESSAGES = 40;

const messageSchema = z
  .object({
    id: z.string().optional(),
    role: z.enum(["system", "user", "assistant"]),
  })
  .passthrough();

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(MAX_MESSAGES),
});

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        if (raw.length > MAX_BODY_BYTES) {
          return new Response("Payload too large", { status: 413 });
        }
        let parsedJson: unknown;
        try {
          parsedJson = JSON.parse(raw);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const parsed = bodySchema.safeParse(parsedJson);
        if (!parsed.success) {
          return Response.json(
            { error: "Invalid request", issues: parsed.error.issues },
            { status: 400 },
          );
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const messages = parsed.data.messages as unknown as UIMessage[];
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages),
        });
        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
