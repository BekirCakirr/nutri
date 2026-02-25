import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Ingredient {
  name: string;
  amount: string;
}

interface RecipeIngredientListProps {
  ingredients: Ingredient[];
}

export function RecipeIngredientList({ ingredients }: RecipeIngredientListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Malzemeler</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {ingredients.map((ing, i) => (
            <li key={i} className="flex items-center justify-between text-sm border-b pb-2 last:border-0 last:pb-0">
              <span>{ing.name}</span>
              <span className="text-muted-foreground">{ing.amount}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
