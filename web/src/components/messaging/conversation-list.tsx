import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationItem } from "./conversation-item";

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  avatarUrl?: string;
  online?: boolean;
}

interface ConversationListProps {
  conversations?: Conversation[];
  activeId?: string;
  onSelect?: (id: string) => void;
}

const defaultConversations: Conversation[] = [
  { id: "1", name: "Ayse Yilmaz", lastMessage: "Tesekkurler, anladim.", time: "09:45", unreadCount: 2, online: true },
  { id: "2", name: "Mehmet Kaya", lastMessage: "Ogle yemegimi gonderdim", time: "11:30", unreadCount: 0, online: true },
  { id: "3", name: "Fatma Demir", lastMessage: "Randevu icin musait miyim?", time: "Dun", unreadCount: 1, online: false },
  { id: "4", name: "Ali Celik", lastMessage: "Diyet listesini goremiyorum", time: "Dun", unreadCount: 0, online: false },
  { id: "5", name: "Zeynep Ozturk", lastMessage: "Merhabalar", time: "2 gun once", unreadCount: 0, online: false },
];

export function ConversationList({
  conversations = defaultConversations,
  activeId,
  onSelect,
}: ConversationListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            name={conv.name}
            lastMessage={conv.lastMessage}
            time={conv.time}
            unreadCount={conv.unreadCount}
            online={conv.online}
            isActive={conv.id === activeId}
            onClick={() => onSelect?.(conv.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
