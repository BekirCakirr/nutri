import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles } from "lucide-react";

interface AiChatInputProps {
  onSend?: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function AiChatInput({
  onSend,
  disabled = false,
  placeholder = "NutriAI'ya sorun...",
}: AiChatInputProps) {
  const [value, setValue] = useState("");

  function handleSend() {
    if (!value.trim()) return;
    onSend?.(value.trim());
    setValue("");
  }

  return (
    <div className="border-t p-3 space-y-2">
      <div className="relative">
        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={disabled}
          rows={2}
          className="pr-12 resize-none"
        />
        <Button
          size="icon"
          className="absolute right-2 bottom-2 h-8 w-8"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        <Sparkles className="h-3 w-3" />
        NutriAI beslenme ve diyet konularinda yardimci olur.
      </p>
    </div>
  );
}
