import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatBubble } from "./chat-bubble";

interface ChatMessage {
  id: string;
  sender: "me" | "other";
  text: string;
  time: string;
}

interface ChatAreaProps {
  messages?: ChatMessage[];
}

const defaultMessages: ChatMessage[] = [
  { id: "1", sender: "other", text: "Merhabalar, bugunki ogunumu gonderdim.", time: "09:15" },
  { id: "2", sender: "me", text: "Tesekkurler! Kahvalti gayet dengeli gorunuyor.", time: "09:45" },
  { id: "3", sender: "other", text: "Ogle yemegi icin ne onerirsiniz?", time: "11:30" },
  { id: "4", sender: "me", text: "Planinizdaki tavuk salatasi ideal olur, protein hedefinizi tutturmaniza yardimci olur.", time: "11:42" },
  { id: "5", sender: "other", text: "Tamamdir, tesekkur ederim!", time: "11:45" },
];

export function ChatArea({ messages = defaultMessages }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-3">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            text={msg.text}
            time={msg.time}
            variant={msg.sender === "me" ? "sent" : "received"}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
