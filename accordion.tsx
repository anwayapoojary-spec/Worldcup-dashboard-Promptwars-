import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { ChatPanel } from "./chat-panel";

export function FloatingAssistant({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <>
      <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-30">
        <Button
          onClick={() => onOpenChange(true)}
          size="lg"
          className="h-11 w-11 rounded-full p-0 bg-primary hover:bg-primary/90 shadow-lg border border-primary/20"
          aria-label="Open AI assistant"
        >
          <Bot className="h-5 w-5 text-primary-foreground" />
        </Button>
      </div>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md p-0 bg-surface border-border flex flex-col">
          <SheetHeader className="p-4 border-b border-border">
            <SheetTitle className="flex items-center gap-2 text-foreground text-sm font-semibold">
              <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              Stadium AI Assistant
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 min-h-0">
            <ChatPanel compact />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
