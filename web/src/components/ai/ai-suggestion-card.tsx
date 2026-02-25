import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, X } from "lucide-react";

interface AiSuggestionCardProps {
  title: string;
  description: string;
  confidence?: number;
  onAccept?: () => void;
  onDismiss?: () => void;
}

export function AiSuggestionCard({
  title,
  description,
  confidence,
  onAccept,
  onDismiss,
}: AiSuggestionCardProps) {
  return (
    <Card className="border-purple-200 bg-purple-50/50">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100">
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
            {confidence !== undefined && (
              <p className="text-xs text-purple-600 mt-1">
                Guven orani: %{confidence}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 pl-11">
          <Button size="sm" variant="outline" className="flex-1" onClick={onAccept}>
            <Check className="mr-1 h-3 w-3" />
            Kabul Et
          </Button>
          <Button size="sm" variant="ghost" onClick={onDismiss}>
            <X className="mr-1 h-3 w-3" />
            Reddet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
