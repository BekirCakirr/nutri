import { subDays, format } from "date-fns";

export interface ShoppingList {
  id: string;
  name: string;
  planId: string;
  planName: string;
  patientId: string | null;
  patientName: string | null;
  weekNumber: number;
  status: "active" | "completed" | "archived";
  items: ShoppingItem[];
  totalEstimatedCost: number;
  createdAt: string;
  completedAt: string | null;
}

export interface ShoppingItem {
  id: string;
  category: string;
  name: string;
  amount: number;
  unit: string;
  isChecked: boolean;
  estimatedCost: number;
  notes: string | null;
}

const now = new Date();

export const shoppingLists: ShoppingList[] = [
  {
    id: "sl-001",
    name: "Haftalık Alışveriş - Kilo Verme Programı",
    planId: "plan-001",
    planName: "Dengeli Kilo Verme Programı",
    patientId: "pat-001",
    patientName: "Ayşe Yılmaz",
    weekNumber: 12,
    status: "active",
    totalEstimatedCost: 850,
    createdAt: format(subDays(now, 2), "yyyy-MM-dd"),
    completedAt: null,
    items: [
      // Protein
      { id: "si-001", category: "Et ve Balık", name: "Tavuk göğsü", amount: 1, unit: "kg", isChecked: false, estimatedCost: 180, notes: "Derisiz" },
      { id: "si-002", category: "Et ve Balık", name: "Somon fileto", amount: 400, unit: "g", isChecked: false, estimatedCost: 220, notes: "Taze" },
      { id: "si-003", category: "Et ve Balık", name: "Levrek", amount: 500, unit: "g", isChecked: false, estimatedCost: 160, notes: null },
      { id: "si-004", category: "Et ve Balık", name: "Hindi füme", amount: 200, unit: "g", isChecked: true, estimatedCost: 65, notes: "Düşük tuzlu" },
      // Sut urunleri
      { id: "si-005", category: "Süt Ürünleri", name: "Yoğurt (yarım yağlı)", amount: 1, unit: "kg", isChecked: false, estimatedCost: 45, notes: null },
      { id: "si-006", category: "Süt Ürünleri", name: "Beyaz peynir (light)", amount: 250, unit: "g", isChecked: true, estimatedCost: 55, notes: "Laktozsuz alternatif" },
      { id: "si-007", category: "Süt Ürünleri", name: "Lor peyniri", amount: 250, unit: "g", isChecked: false, estimatedCost: 35, notes: null },
      // Sebzeler
      { id: "si-008", category: "Sebzeler", name: "Domates", amount: 1, unit: "kg", isChecked: true, estimatedCost: 25, notes: null },
      { id: "si-009", category: "Sebzeler", name: "Salatalık", amount: 1, unit: "kg", isChecked: true, estimatedCost: 20, notes: null },
      { id: "si-010", category: "Sebzeler", name: "Brokoli", amount: 500, unit: "g", isChecked: false, estimatedCost: 30, notes: null },
      { id: "si-011", category: "Sebzeler", name: "Ispanak", amount: 500, unit: "g", isChecked: false, estimatedCost: 25, notes: null },
      { id: "si-012", category: "Sebzeler", name: "Havuç", amount: 500, unit: "g", isChecked: true, estimatedCost: 12, notes: null },
      { id: "si-013", category: "Sebzeler", name: "Kabak", amount: 500, unit: "g", isChecked: false, estimatedCost: 15, notes: null },
      // Meyveler
      { id: "si-014", category: "Meyveler", name: "Elma", amount: 1, unit: "kg", isChecked: false, estimatedCost: 35, notes: null },
      { id: "si-015", category: "Meyveler", name: "Çilek", amount: 500, unit: "g", isChecked: false, estimatedCost: 45, notes: "Mevsiminde" },
      { id: "si-016", category: "Meyveler", name: "Portakal", amount: 1, unit: "kg", isChecked: false, estimatedCost: 25, notes: null },
      // Tahillar
      { id: "si-017", category: "Tahıllar", name: "Bulgur", amount: 500, unit: "g", isChecked: true, estimatedCost: 18, notes: null },
      { id: "si-018", category: "Tahıllar", name: "Tam buğday ekmeği", amount: 1, unit: "adet", isChecked: false, estimatedCost: 25, notes: "Günlük taze alınacak" },
      { id: "si-019", category: "Tahıllar", name: "Yulaf ezmesi", amount: 500, unit: "g", isChecked: true, estimatedCost: 40, notes: null },
      // Baklagiller
      { id: "si-020", category: "Baklagiller", name: "Kırmızı mercimek", amount: 500, unit: "g", isChecked: false, estimatedCost: 28, notes: null },
      // Kuruyemisler
      { id: "si-021", category: "Kuruyemişler", name: "Ceviz", amount: 200, unit: "g", isChecked: false, estimatedCost: 65, notes: null },
      { id: "si-022", category: "Kuruyemişler", name: "Badem", amount: 200, unit: "g", isChecked: false, estimatedCost: 55, notes: null },
      // Diger
      { id: "si-023", category: "Diğer", name: "Zeytinyağı (sızma)", amount: 500, unit: "ml", isChecked: true, estimatedCost: 120, notes: "Soğuk sıkım" },
      { id: "si-024", category: "Diğer", name: "Limon", amount: 5, unit: "adet", isChecked: false, estimatedCost: 10, notes: null },
    ],
  },
  {
    id: "sl-002",
    name: "Haftalık Alışveriş - Diyabetik Program",
    planId: "plan-002",
    planName: "Diyabetik Beslenme Programı",
    patientId: "pat-002",
    patientName: "Mehmet Kaya",
    weekNumber: 20,
    status: "active",
    totalEstimatedCost: 780,
    createdAt: format(subDays(now, 1), "yyyy-MM-dd"),
    completedAt: null,
    items: [
      { id: "si-101", category: "Et ve Balık", name: "Tavuk göğsü", amount: 800, unit: "g", isChecked: false, estimatedCost: 145, notes: null },
      { id: "si-102", category: "Et ve Balık", name: "Somon", amount: 300, unit: "g", isChecked: false, estimatedCost: 165, notes: null },
      { id: "si-103", category: "Et ve Balık", name: "Yumurta", amount: 15, unit: "adet", isChecked: true, estimatedCost: 75, notes: "Serbest gezen" },
      { id: "si-104", category: "Süt Ürünleri", name: "Yoğurt (yarım yağlı)", amount: 1, unit: "kg", isChecked: false, estimatedCost: 45, notes: null },
      { id: "si-105", category: "Süt Ürünleri", name: "Beyaz peynir (light)", amount: 300, unit: "g", isChecked: false, estimatedCost: 65, notes: null },
      { id: "si-106", category: "Süt Ürünleri", name: "Lor peyniri", amount: 250, unit: "g", isChecked: false, estimatedCost: 35, notes: null },
      { id: "si-107", category: "Sebzeler", name: "Domates", amount: 1, unit: "kg", isChecked: true, estimatedCost: 25, notes: null },
      { id: "si-108", category: "Sebzeler", name: "Salatalık", amount: 1, unit: "kg", isChecked: true, estimatedCost: 20, notes: null },
      { id: "si-109", category: "Sebzeler", name: "Brokoli", amount: 500, unit: "g", isChecked: false, estimatedCost: 30, notes: null },
      { id: "si-110", category: "Sebzeler", name: "Karnabahar", amount: 1, unit: "adet", isChecked: false, estimatedCost: 22, notes: null },
      { id: "si-111", category: "Sebzeler", name: "Patlıcan", amount: 500, unit: "g", isChecked: false, estimatedCost: 18, notes: null },
      { id: "si-112", category: "Meyveler", name: "Elma (yeşil)", amount: 1, unit: "kg", isChecked: false, estimatedCost: 35, notes: "Düşük şekerli" },
      { id: "si-113", category: "Meyveler", name: "Greyfurt", amount: 3, unit: "adet", isChecked: false, estimatedCost: 30, notes: null },
      { id: "si-114", category: "Tahıllar", name: "Bulgur", amount: 500, unit: "g", isChecked: false, estimatedCost: 18, notes: null },
      { id: "si-115", category: "Tahıllar", name: "Tam buğday ekmeği", amount: 1, unit: "adet", isChecked: false, estimatedCost: 25, notes: null },
      { id: "si-116", category: "Baklagiller", name: "Nohut", amount: 500, unit: "g", isChecked: false, estimatedCost: 22, notes: null },
      { id: "si-117", category: "Baklagiller", name: "Kuru fasulye", amount: 500, unit: "g", isChecked: false, estimatedCost: 30, notes: null },
      { id: "si-118", category: "Kuruyemişler", name: "Ceviz", amount: 200, unit: "g", isChecked: false, estimatedCost: 65, notes: null },
      { id: "si-119", category: "Diğer", name: "Zeytinyağı (sızma)", amount: 500, unit: "ml", isChecked: true, estimatedCost: 120, notes: null },
      { id: "si-120", category: "Diğer", name: "Limon", amount: 4, unit: "adet", isChecked: false, estimatedCost: 8, notes: null },
    ],
  },
  {
    id: "sl-003",
    name: "Haftalık Alışveriş - Sporcu Programı",
    planId: "plan-003",
    planName: "Sporcu Kas Geliştirme Programı",
    patientId: "pat-006",
    patientName: "Emre Arslan",
    weekNumber: 8,
    status: "active",
    totalEstimatedCost: 1250,
    createdAt: format(subDays(now, 3), "yyyy-MM-dd"),
    completedAt: null,
    items: [
      { id: "si-201", category: "Et ve Balık", name: "Tavuk göğsü", amount: 2, unit: "kg", isChecked: false, estimatedCost: 360, notes: null },
      { id: "si-202", category: "Et ve Balık", name: "Biftek", amount: 500, unit: "g", isChecked: false, estimatedCost: 250, notes: null },
      { id: "si-203", category: "Et ve Balık", name: "Somon", amount: 500, unit: "g", isChecked: false, estimatedCost: 275, notes: null },
      { id: "si-204", category: "Et ve Balık", name: "Yumurta", amount: 30, unit: "adet", isChecked: true, estimatedCost: 150, notes: null },
      { id: "si-205", category: "Et ve Balık", name: "Hindi füme", amount: 300, unit: "g", isChecked: false, estimatedCost: 95, notes: null },
      { id: "si-206", category: "Süt Ürünleri", name: "Süt (yarım yağlı)", amount: 3, unit: "litre", isChecked: false, estimatedCost: 75, notes: null },
      { id: "si-207", category: "Süt Ürünleri", name: "Yoğurt", amount: 2, unit: "kg", isChecked: false, estimatedCost: 90, notes: null },
      { id: "si-208", category: "Meyveler", name: "Muz", amount: 2, unit: "kg", isChecked: true, estimatedCost: 60, notes: null },
      { id: "si-209", category: "Meyveler", name: "Çilek", amount: 1, unit: "kg", isChecked: false, estimatedCost: 90, notes: null },
      { id: "si-210", category: "Sebzeler", name: "Brokoli", amount: 1, unit: "kg", isChecked: false, estimatedCost: 60, notes: null },
      { id: "si-211", category: "Sebzeler", name: "Tatlı patates", amount: 1, unit: "kg", isChecked: false, estimatedCost: 45, notes: null },
      { id: "si-212", category: "Sebzeler", name: "Avokado", amount: 4, unit: "adet", isChecked: false, estimatedCost: 80, notes: null },
      { id: "si-213", category: "Tahıllar", name: "Yulaf ezmesi", amount: 1, unit: "kg", isChecked: true, estimatedCost: 75, notes: null },
      { id: "si-214", category: "Tahıllar", name: "Bulgur", amount: 1, unit: "kg", isChecked: false, estimatedCost: 35, notes: null },
      { id: "si-215", category: "Tahıllar", name: "Pirinç", amount: 500, unit: "g", isChecked: false, estimatedCost: 28, notes: null },
      { id: "si-216", category: "Kuruyemişler", name: "Badem", amount: 300, unit: "g", isChecked: false, estimatedCost: 80, notes: null },
      { id: "si-217", category: "Kuruyemişler", name: "Ceviz", amount: 200, unit: "g", isChecked: false, estimatedCost: 65, notes: null },
      { id: "si-218", category: "Diğer", name: "Fıstık ezmesi (şekersiz)", amount: 350, unit: "g", isChecked: false, estimatedCost: 85, notes: null },
    ],
  },
  {
    id: "sl-004",
    name: "Geçen Hafta - Kilo Verme Programı",
    planId: "plan-001",
    planName: "Dengeli Kilo Verme Programı",
    patientId: "pat-001",
    patientName: "Ayşe Yılmaz",
    weekNumber: 11,
    status: "completed",
    totalEstimatedCost: 820,
    createdAt: format(subDays(now, 9), "yyyy-MM-dd"),
    completedAt: format(subDays(now, 3), "yyyy-MM-dd"),
    items: [
      { id: "si-301", category: "Et ve Balık", name: "Tavuk göğsü", amount: 1, unit: "kg", isChecked: true, estimatedCost: 180, notes: null },
      { id: "si-302", category: "Et ve Balık", name: "Levrek", amount: 500, unit: "g", isChecked: true, estimatedCost: 160, notes: null },
      { id: "si-303", category: "Sebzeler", name: "Karışık sebze", amount: 2, unit: "kg", isChecked: true, estimatedCost: 80, notes: null },
      { id: "si-304", category: "Meyveler", name: "Mevsim meyveleri", amount: 2, unit: "kg", isChecked: true, estimatedCost: 100, notes: null },
      { id: "si-305", category: "Tahıllar", name: "Bulgur + yulaf", amount: 1, unit: "kg", isChecked: true, estimatedCost: 55, notes: null },
      { id: "si-306", category: "Süt Ürünleri", name: "Süt ürünleri paketi", amount: 1, unit: "paket", isChecked: true, estimatedCost: 130, notes: null },
      { id: "si-307", category: "Diğer", name: "Zeytinyağı + baharat", amount: 1, unit: "set", isChecked: true, estimatedCost: 115, notes: null },
    ],
  },
];
