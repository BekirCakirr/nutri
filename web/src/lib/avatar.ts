// Deterministic avatar URLs for demo accounts.
// Pravatar img IDs grouped by gender so demo patients get the right look.
// Female: 1, 5, 9, 16, 19, 23, 24, 25, 26, 32, 36, 38, 41, 44, 47, 49
// Male:   3, 7, 8, 11, 12, 13, 14, 15, 17, 22, 33, 51, 52, 53, 54

const FEMALE_KEYWORDS = [
  "ayse", "ayşe", "elif", "fatma", "zeynep", "selin", "meryem", "sevgi",
  "gul", "gül", "aysel", "demo", "yeni", "ms.", "bayan",
];

const FEMALE_IMGS = [1, 5, 9, 16, 19, 23, 24, 25, 26, 32, 36, 38, 41, 44, 47, 49];
const MALE_IMGS = [3, 7, 8, 11, 12, 13, 14, 15, 17, 22, 33, 51, 52, 53, 54];

// Specific overrides for known demo accounts so they look consistent across pages
const SPECIFIC: Record<string, number> = {
  "ayse": 5,
  "ayşe": 5,
  "ayse.yilmaz": 5,
  "ayse yilmaz": 5,
  "elif": 1,
  "elif.kaya": 1,
  "elif kaya": 1,
  "fatma": 9,
  "fatma.demir": 9,
  "fatma demir": 9,
  "zeynep": 16,
  "zeynep.celik": 16,
  "zeynep celik": 16,
  "mehmet": 12,
  "mehmet.kaya": 12,
  "mehmet kaya": 12,
  "demo": 32,
  "demo hasta": 32,
  "yeni": 47,
  "yeni hasta": 47,
};

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function isFemale(seed: string): boolean {
  const lower = seed.toLowerCase();
  return FEMALE_KEYWORDS.some((k) => lower.includes(k));
}

/**
 * Returns a stable pravatar URL for a person.
 * @param seed name + email + id, anything identifying the person
 * @param size px (default 150)
 */
export function avatarFor(seed: string | undefined | null, size = 150): string {
  const key = String(seed ?? "").trim().toLowerCase();
  if (!key) return `https://i.pravatar.cc/${size}?img=10`;

  // Exact override match (full email or full name)
  if (SPECIFIC[key] !== undefined) {
    return `https://i.pravatar.cc/${size}?img=${SPECIFIC[key]}`;
  }
  // Partial match
  for (const k of Object.keys(SPECIFIC)) {
    if (key.includes(k)) {
      return `https://i.pravatar.cc/${size}?img=${SPECIFIC[k]}`;
    }
  }

  const list = isFemale(key) ? FEMALE_IMGS : MALE_IMGS;
  const img = list[hashStr(key) % list.length];
  return `https://i.pravatar.cc/${size}?img=${img}`;
}

// Curated Unsplash food photo URLs for meal review thumbnails.
// Each meal type maps to multiple photos to add variety.
const FOOD_BY_MEAL: Record<string, string[]> = {
  breakfast: [
    "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop", // Turkish breakfast
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop", // Eggs + toast
    "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop", // Pancakes
    "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop",    // Menemen
  ],
  lunch: [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",    // Healthy bowl
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop", // Chicken plate
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop", // Salad
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop", // Turkish lunch
  ],
  dinner: [
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop", // Salmon
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",    // Steak
    "https://images.unsplash.com/photo-1432139509613-5c4255815697?w=400&h=300&fit=crop", // Pasta
    "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop",    // Soup
  ],
  snack: [
    "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=300&fit=crop", // Yogurt fruits
    "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=400&h=300&fit=crop", // Smoothie
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop", // Nuts
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop", // Fruit bowl
  ],
};

const MEAL_TYPE_NORMALIZE: Record<string, keyof typeof FOOD_BY_MEAL> = {
  breakfast: "breakfast",
  kahvaltı: "breakfast",
  kahvalti: "breakfast",
  morning_snack: "snack",
  lunch: "lunch",
  öğle: "lunch",
  ogle: "lunch",
  afternoon_snack: "snack",
  ikindi: "snack",
  dinner: "dinner",
  akşam: "dinner",
  aksam: "dinner",
  evening_snack: "snack",
  snack: "snack",
  "ara öğün": "snack",
  "ara ogun": "snack",
  other: "lunch",
};

/**
 * Returns a stable Unsplash food photo URL based on meal type and id.
 * Always returns a real food image (no laptops, oceans, etc.).
 */
export function mealPhotoFor(mealType: string | undefined | null, id: string | undefined | null): string {
  const t = String(mealType ?? "").toLowerCase();
  const bucket = MEAL_TYPE_NORMALIZE[t] ?? "lunch";
  const list = FOOD_BY_MEAL[bucket];
  const idx = hashStr(String(id ?? bucket)) % list.length;
  return list[idx];
}
