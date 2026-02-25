export interface Allergen {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  severity: "low" | "medium" | "high";
  commonFoods: string[];
  icon: string;
}

export const allergens: Allergen[] = [
  {
    id: "alg-001",
    name: "Gluten",
    nameEn: "Gluten",
    description: "Buğday, arpa, çavdar ve yulaf gibi tahıllarda bulunan protein grubu",
    severity: "high",
    commonFoods: ["Ekmek", "Makarna", "Börek", "Pasta", "Bisküvi", "Bulgur"],
    icon: "wheat",
  },
  {
    id: "alg-002",
    name: "Laktoz",
    nameEn: "Lactose",
    description: "Süt ve süt ürünlerinde bulunan doğal şeker",
    severity: "medium",
    commonFoods: ["Süt", "Peynir", "Yoğurt", "Tereyağı", "Dondurma", "Krema"],
    icon: "milk",
  },
  {
    id: "alg-003",
    name: "Yumurta",
    nameEn: "Egg",
    description: "Yumurta ve yumurta içeren ürünlere karşı alerji",
    severity: "high",
    commonFoods: ["Yumurta", "Mayonez", "Pasta", "Kek", "Bisküvi", "Makarna"],
    icon: "egg",
  },
  {
    id: "alg-004",
    name: "Fıstık",
    nameEn: "Peanut",
    description: "Yer fıstığı ve yer fıstığı içeren ürünlere karşı alerji",
    severity: "high",
    commonFoods: ["Yer fıstığı", "Fıstık ezmesi", "Çikolata", "Snack bar"],
    icon: "nut",
  },
  {
    id: "alg-005",
    name: "Kabuklu Deniz Ürünleri",
    nameEn: "Shellfish",
    description: "Karides, yengeç, ıstakoz gibi kabuklu deniz ürünlerine karşı alerji",
    severity: "high",
    commonFoods: ["Karides", "Yengeç", "Istakoz", "Midye", "Kalamar"],
    icon: "shell",
  },
  {
    id: "alg-006",
    name: "Balık",
    nameEn: "Fish",
    description: "Balık ve balık ürünlerine karşı alerji",
    severity: "medium",
    commonFoods: ["Somon", "Levrek", "Hamsi", "Ton balığı", "Balık yağı"],
    icon: "fish",
  },
  {
    id: "alg-007",
    name: "Soya",
    nameEn: "Soy",
    description: "Soya fasulyesi ve soya içeren ürünlere karşı alerji",
    severity: "medium",
    commonFoods: ["Soya sosu", "Tofu", "Soya sütü", "Edamame", "Soya yağı"],
    icon: "bean",
  },
  {
    id: "alg-008",
    name: "Ağaç Kabuklu Yemişler",
    nameEn: "Tree Nuts",
    description: "Ceviz, badem, fındık gibi sert kabuklu yemişlere karşı alerji",
    severity: "high",
    commonFoods: ["Ceviz", "Badem", "Fındık", "Kaju", "Antep fıstığı"],
    icon: "tree-nut",
  },
  {
    id: "alg-009",
    name: "Susam",
    nameEn: "Sesame",
    description: "Susam ve susam içeren ürünlere karşı alerji",
    severity: "medium",
    commonFoods: ["Susam", "Tahin", "Simit", "Helva", "Humus"],
    icon: "sesame",
  },
  {
    id: "alg-010",
    name: "Kereviz",
    nameEn: "Celery",
    description: "Kereviz ve kereviz içeren ürünlere karşı alerji",
    severity: "low",
    commonFoods: ["Kereviz", "Çorba", "Salata", "Sebze suyu"],
    icon: "celery",
  },
  {
    id: "alg-011",
    name: "Hardal",
    nameEn: "Mustard",
    description: "Hardal ve hardal içeren ürünlere karşı alerji",
    severity: "low",
    commonFoods: ["Hardal", "Sos", "Salata sosu", "Marine", "Turşu"],
    icon: "mustard",
  },
  {
    id: "alg-012",
    name: "Sülfitler",
    nameEn: "Sulfites",
    description: "Sülfitler ve sülfit içeren ürünlere karşı hassasiyet",
    severity: "medium",
    commonFoods: ["Kuru meyve", "Şarap", "Sirke", "Konserve", "Kurutulmuş sebze"],
    icon: "chemical",
  },
];

export const allergenCategories = [
  { id: "food", label: "Gıda Alerjenleri", count: 8 },
  { id: "additive", label: "Katkı Maddeleri", count: 2 },
  { id: "environmental", label: "Çevresel Alerjenler", count: 2 },
];
