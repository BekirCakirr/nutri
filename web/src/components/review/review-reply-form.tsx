import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ReviewReplyFormProps {
  reviewId: string;
  onSubmit?: (reviewId: string, reply: string) => void;
}

export function ReviewReplyForm({ reviewId, onSubmit }: ReviewReplyFormProps) {
  const [reply, setReply] = useState("");

  function handleSubmit() {
    if (!reply.trim()) return;
    onSubmit?.(reviewId, reply.trim());
    setReply("");
  }

  return (
    <div className="space-y-2 pl-12">
      <Textarea
        placeholder="Yanitinizi yazin..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        rows={2}
      />
      <div className="flex justify-end">
        <Button size="sm" onClick={handleSubmit} disabled={!reply.trim()}>
          <Send className="mr-1 h-3 w-3" />
          Yanitla
        </Button>
      </div>
    </div>
  );
}
