import { useState } from "react";
import { RecipeCard } from "./recipe-card";
import { RecipeCategoryFilter } from "./recipe-category-filter";

interface Recipe {
  id: string;
  title: string;
  calories: number;
  time: number;
  difficulty: "kolay" | "orta" | "zor";
  category: string;
  imageUrl?: string;
}

interface RecipeGridProps {
  recipes?: Recipe[];
  onSelect?: (id: string) => void;
}

const defaultRecipes: Recipe[] = [
  { id: "1", title: "Izgara Tavuk Salata", calories: 350, time: 25, difficulty: "kolay", category: "Salata" },
  { id: "2", title: "Mercimek Corbasi", calories: 180, time: 40, difficulty: "kolay", category: "Corba" },
  { id: "3", title: "Kinoa Bowl", calories: 420, time: 30, difficulty: "orta", category: "Ana Yemek" },
  { id: "4", title: "Yulaf Pankek", calories: 280, time: 15, difficulty: "kolay", category: "Kahvalti" },
  { id: "5", title: "Somon Izgara", calories: 450, time: 35, difficulty: "orta", category: "Ana Yemek" },
  { id: "6", title: "Protein Smoothie", calories: 220, time: 5, difficulty: "kolay", category: "Icecek" },
];

export function RecipeGrid({ recipes = defaultRecipes, onSelect }: RecipeGridProps) {
  const [category, setCategory] = useState("Tumu");

  const categories = ["Tumu", ...new Set(recipes.map((r) => r.category))];
  const filtered = category === "Tumu" ? recipes : recipes.filter((r) => r.category === category);

  return (
    <div className="space-y-4">
      <RecipeCategoryFilter
        categories={categories}
        selected={category}
        onSelect={setCategory}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            title={recipe.title}
            calories={recipe.calories}
            time={recipe.time}
            difficulty={recipe.difficulty}
            category={recipe.category}
            imageUrl={recipe.imageUrl}
            onClick={() => onSelect?.(recipe.id)}
          />
        ))}
      </div>
    </div>
  );
}
