import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";

interface Message {
  id: string;
  sender: "dietitian" | "patient";
  text: string;
  time: string;
}

interface PatientMessagesTabProps {
  patientName?: string;
  messages?: Message[];
  onSendMessage?: (text: string) => void;
}

const defaultMessages: Message[] = [
  { id: "1", sender: "patient", text: "Merhabalar, bugunki ogunumu gonderdim.", time: "09:15" },
  { id: "2", sender: "dietitian", text: "Tesekkurler, inceleyecegim. Kahvalti gayet iyi gorunuyor.", time: "09:45" },
  { id: "3", sender: "patient", text: "Ogle yemeginde ne yesem iyi olur?", time: "11:30" },
  { id: "4", sender: "dietitian", text: "Planinizdaki tavuk salatayi tavsiye ederim. Protein acigini kapatir.", time: "11:42" },
  { id: "5", sender: "patient", text: "Tamamdir, tesekkur ederim!", time: "11:45" },
];

export function PatientMessagesTab({
  patientName = "Hasta",
  messages = defaultMessages,
  onSendMessage,
}: PatientMessagesTabProps) {
  const [input, setInput] = useState("");

  function handleSend() {
    if (!input.trim()) return;
    onSendMessage?.(input.trim());
    setInput("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Mesajlar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.sender === "dietitian" ? "justify-end" : ""}`}
            >
              {msg.sender === "patient" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {patientName[0]}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                  msg.sender === "dietitian"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p>{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender === "dietitian"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
              {msg.sender === "dietitian" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">DY</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Mesajinizi yazin..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button size="icon" onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
