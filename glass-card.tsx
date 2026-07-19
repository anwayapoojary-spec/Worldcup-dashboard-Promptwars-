import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, MicOff, Volume2, Loader2, Bot, User } from "lucide-react";

const SUGGESTIONS = [
  "Where is my seat 232-14-8?",
  "Fastest route from Gate B to my seat",
  "What food is near section 232?",
  "How busy is the stadium right now?",
  "I feel unwell — where is medical?",
];

function messageText(m: UIMessage): string {
  return (m.parts ?? [])
    .map((p) => (p.type === "text" ? (p as { text: string }).text : ""))
    .join("");
}

export function ChatPanel({ compact = false }: { compact?: boolean }) {
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isLoading = status === "submitted" || status === "streaming";

  function handleSend(text?: string) {
    const value = (text ?? input).trim();
    if (!value || isLoading) return;
    sendMessage({ text: value });
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function toggleMic() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const W = window as any;
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SR) {
      alert("Voice input not supported in this browser.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (e: { results: { 0: { transcript: string } }[] }) => {
      const t = e.results[0][0].transcript;
      setInput(t);
      setListening(false);
      handleSend(t);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  }

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.05;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <div className="mx-auto h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Bot className="h-5 w-5" />
            </div>
            <div className="text-sm font-medium">How can I help at the stadium?</div>
            <div className="text-xs text-muted-foreground mt-1">
              Ask about seats, gates, food, crowd, or emergencies.
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {SUGGESTIONS.slice(0, compact ? 3 : 5).map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-[12px] px-2.5 py-1 rounded-md border border-border bg-surface-2 hover:bg-accent text-muted-foreground hover:text-foreground transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => {
          const text = messageText(m);
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="h-6 w-6 rounded-md bg-primary/10 text-primary flex-shrink-0 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5" />
                </div>
              )}
              <div
                className={`group max-w-[80%] rounded-lg px-3 py-2 text-[13px] leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-2 border border-border text-foreground"
                }`}
              >
                {text || (isLoading ? <span className="opacity-60">Thinking…</span> : null)}
                {!isUser && text && (
                  <button
                    onClick={() => speak(text)}
                    className="mt-1 ml-2 opacity-0 group-hover:opacity-100 transition text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  >
                    <Volume2 className="h-3 w-3" /> Play
                  </button>
                )}
              </div>
              {isUser && (
                <div className="h-6 w-6 rounded-md bg-muted border border-border flex-shrink-0 flex items-center justify-center">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          );
        })}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
          </div>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-border flex items-center gap-2 bg-surface"
      >
        <Button
          type="button"
          onClick={toggleMic}
          size="icon"
          variant="ghost"
          className={`h-9 w-9 rounded-md ${listening ? "text-danger" : ""}`}
        >
          {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about the stadium…"
          className="h-9 rounded-md"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading}
          className="h-9 w-9 rounded-md"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}
