import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye, ChefHat } from "lucide-react";

interface PendingRecipe {
  id: string;
  title: string;
  author: string;
  category: string;
  submittedAt: string;
}

interface AdminRecipeModerationProps {
  recipes?: PendingRecipe[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onPreview?: (id: string) => void;
}

const defaultRecipes: PendingRecipe[] = [
  { id: "1", title: "Avokadolu Tost", author: "Ayse Yilmaz", category: "Kahvalti", submittedAt: "25 Sub 2026" },
  { id: "2", title: "Protein Smoothie Bowl", author: "Zeynep Ozturk", category: "Icecek", submittedAt: "24 Sub 2026" },
  { id: "3", title: "Firin Sebze", author: "Fatma Demir", category: "Sebze", submittedAt: "23 Sub 2026" },
];

export function AdminRecipeModeration({
  recipes = defaultRecipes,
  onApprove,
  onReject,
  onPreview,
}: AdminRecipeModerationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ChefHat className="h-4 w-4" />
          Tarif Moderasyonu
          <Badge variant="outline">{recipes.length} bekliyor</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recipes.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Bekleyen tarif yok.
          </p>
        ) : (
          recipes.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">
                  {r.author} &middot; {r.category} &middot; {r.submittedAt}
                </p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onPreview?.(r.id)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={() => onApprove?.(r.id)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => onReject?.(r.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
