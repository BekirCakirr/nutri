import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip } from "lucide-react";

interface ChatInputProps {
  onSend?: (message: string) => void;
  onAttach?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  onSend,
  onAttach,
  placeholder = "Mesajinizi yazin...",
  disabled = false,
}: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSend() {
    if (!value.trim()) return;
    onSend?.(value.trim());
    setValue("");
  }

  return (
    <div className="flex items-center gap-2 border-t p-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={onAttach}
        disabled={disabled}
      >
        <Paperclip className="h-4 w-4" />
      </Button>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
        disabled={disabled}
        className="flex-1"
      />
      <Button size="icon" onClick={handleSend} disabled={disabled || !value.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
