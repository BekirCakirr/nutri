import { Button } from "@/components/ui/button";
import { Save, Send, Trash2 } from "lucide-react";

interface PlanActionsProps {
  onSaveDraft?: () => void;
  onPublish?: () => void;
  onDelete?: () => void;
  isSaving?: boolean;
  isPublishing?: boolean;
}

export function PlanActions({
  onSaveDraft,
  onPublish,
  onDelete,
  isSaving = false,
  isPublishing = false,
}: PlanActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="destructive" size="sm" onClick={onDelete}>
        <Trash2 className="mr-1 h-4 w-4" />
        Sil
      </Button>
      <Button variant="outline" size="sm" onClick={onSaveDraft} disabled={isSaving}>
        <Save className="mr-1 h-4 w-4" />
        {isSaving ? "Kaydediliyor..." : "Taslak Kaydet"}
      </Button>
      <Button size="sm" onClick={onPublish} disabled={isPublishing}>
        <Send className="mr-1 h-4 w-4" />
        {isPublishing ? "Yayinlaniyor..." : "Yayinla"}
      </Button>
    </div>
  );
}
