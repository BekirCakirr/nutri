import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Flame, ChefHat, Users } from "lucide-react";
import { RecipeIngredientList } from "./recipe-ingredient-list";
import { RecipeNutritionInfo } from "./recipe-nutrition-info";

interface Ingredient {
  name: string;
  amount: string;
}

interface RecipeDetailViewProps {
  title?: string;
  description?: string;
  category?: string;
  difficulty?: "kolay" | "orta" | "zor";
  time?: number;
  servings?: number;
  calories?: number;
  imageUrl?: string;
  ingredients?: Ingredient[];
  steps?: string[];
  nutrition?: { protein: number; carbs: number; fat: number; fiber: number };
}

const defaultIngredients: Ingredient[] = [
  { name: "Tavuk gogsu", amount: "200g" },
  { name: "Kinoa", amount: "100g" },
  { name: "Avokado", amount: "1 adet" },
  { name: "Cherry domates", amount: "8 adet" },
  { name: "Ispanak", amount: "1 avuc" },
  { name: "Zeytinyagi", amount: "2 yemek kasigi" },
  { name: "Limon suyu", amount: "1 yemek kasigi" },
];

const defaultSteps = [
  "Kinoayi yikayip, 2 su bardagi su ile haslayin. 15 dakika pisirin.",
  "Tavuk gogsunu tuzlayip, izgarada her iki tarafi 6-7 dakika pisirin.",
  "Avokadoyu dilimleyin, domatesleri ikiye bolin.",
  "Ispanaklari yikayip bir tabaga serin.",
  "Pisen kinoayi, tavugu, avokadoyu ve domatesleri uzerine yerlestin.",
  "Zeytinyagi ve limon suyu ile soslayin. Afiyet olsun!",
];

export function RecipeDetailView({
  title = "Kinoa Tavuk Bowl",
  description = "Protein zengini, saglikli ve doyurucu bir ogun.",
  category = "Ana Yemek",
  difficulty = "orta",
  time = 30,
  servings = 2,
  calories = 420,
  imageUrl,
  ingredients = defaultIngredients,
  steps = defaultSteps,
  nutrition = { protein: 35, carbs: 42, fat: 18, fiber: 8 },
}: RecipeDetailViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="h-64 w-full md:w-80 rounded-lg bg-muted flex items-center justify-center shrink-0">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="h-full w-full object-cover rounded-lg" />
          ) : (
            <ChefHat className="h-16 w-16 text-muted-foreground" />
          )}
        </div>
        <div className="space-y-3">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{category}</Badge>
            <Badge variant="outline" className="capitalize">{difficulty}</Badge>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{time} dk</span>
            <span className="flex items-center gap-1"><Users className="h-4 w-4" />{servings} kisi</span>
            <span className="flex items-center gap-1"><Flame className="h-4 w-4" />{calories} kcal</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <RecipeIngredientList ingredients={ingredients} />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Yapilisi</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <RecipeNutritionInfo
          calories={calories}
          protein={nutrition.protein}
          carbs={nutrition.carbs}
          fat={nutrition.fat}
          fiber={nutrition.fiber}
        />
      </div>
    </div>
  );
}
