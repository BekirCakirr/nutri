import type { Food } from '@/types';

export const mockFoods: Food[] = [
  // Kahvaltilik
  { id: 'f-1', name: 'Beyaz Peynir', category: 'dairy', servingSize: 30, servingUnit: 'g', nutrition: { calories: 80, protein: 5, carbs: 1, fat: 6, fiber: 0, sugar: 0, sodium: 320 } },
  { id: 'f-2', name: 'Ka\u015far Peyniri', category: 'dairy', servingSize: 30, servingUnit: 'g', nutrition: { calories: 110, protein: 7, carbs: 0.5, fat: 9, fiber: 0, sugar: 0, sodium: 250 } },
  { id: 'f-3', name: 'Zeytin (Siyah)', category: 'fat', servingSize: 30, servingUnit: 'g', nutrition: { calories: 50, protein: 0.4, carbs: 1.5, fat: 5, fiber: 1, sugar: 0, sodium: 400 } },
  { id: 'f-4', name: 'Zeytin (Ye\u015fil)', category: 'fat', servingSize: 30, servingUnit: 'g', nutrition: { calories: 40, protein: 0.3, carbs: 1, fat: 4, fiber: 1, sugar: 0, sodium: 450 } },
  { id: 'f-5', name: 'Domates', category: 'vegetable', servingSize: 100, servingUnit: 'g', nutrition: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6, sodium: 5 } },
  { id: 'f-6', name: 'Sal\u0131atal\u0131k', category: 'vegetable', servingSize: 100, servingUnit: 'g', nutrition: { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, sugar: 1.7, sodium: 2 } },
  { id: 'f-7', name: 'Yumurta (Ha\u015flanm\u0131\u015f)', category: 'protein', servingSize: 1, servingUnit: 'adet', nutrition: { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1, sodium: 124 } },
  { id: 'f-8', name: 'Bal', category: 'other', servingSize: 15, servingUnit: 'g', nutrition: { calories: 46, protein: 0, carbs: 12.5, fat: 0, fiber: 0, sugar: 12.5, sodium: 1 } },
  { id: 'f-9', name: 'Tereya\u011f\u0131', category: 'fat', servingSize: 10, servingUnit: 'g', nutrition: { calories: 72, protein: 0.1, carbs: 0, fat: 8.1, fiber: 0, sugar: 0, sodium: 2 } },
  { id: 'f-10', name: 'Simit', category: 'grain', servingSize: 1, servingUnit: 'adet', nutrition: { calories: 280, protein: 8, carbs: 48, fat: 6, fiber: 2, sugar: 3, sodium: 500 } },

  // Ekmekler & Tahillar
  { id: 'f-11', name: 'Tam Bu\u011fday Ekme\u011fi', category: 'grain', servingSize: 1, servingUnit: 'dilim', nutrition: { calories: 70, protein: 3, carbs: 13, fat: 1, fiber: 2, sugar: 1, sodium: 130 } },
  { id: 'f-12', name: 'Beyaz Ekmek', category: 'grain', servingSize: 1, servingUnit: 'dilim', nutrition: { calories: 80, protein: 2.5, carbs: 15, fat: 1, fiber: 0.5, sugar: 1, sodium: 150 } },
  { id: 'f-13', name: 'Pilav', category: 'grain', servingSize: 150, servingUnit: 'g', nutrition: { calories: 195, protein: 4, carbs: 42, fat: 1, fiber: 0.5, sugar: 0, sodium: 5 } },
  { id: 'f-14', name: 'Bulgur Pilav\u0131', category: 'grain', servingSize: 150, servingUnit: 'g', nutrition: { calories: 170, protein: 5, carbs: 35, fat: 1.5, fiber: 4, sugar: 0, sodium: 10 } },
  { id: 'f-15', name: 'Makarna', category: 'grain', servingSize: 200, servingUnit: 'g', nutrition: { calories: 260, protein: 9, carbs: 50, fat: 2, fiber: 2, sugar: 1, sodium: 5 } },

  // Etler & Proteinler
  { id: 'f-16', name: 'Tavuk G\u00f6\u011fs\u00fc (Izgara)', category: 'protein', servingSize: 150, servingUnit: 'g', nutrition: { calories: 240, protein: 45, carbs: 0, fat: 5, fiber: 0, sugar: 0, sodium: 85 } },
  { id: 'f-17', name: 'K\u0131yma (Orta Ya\u011fl\u0131)', category: 'protein', servingSize: 100, servingUnit: 'g', nutrition: { calories: 250, protein: 17, carbs: 0, fat: 20, fiber: 0, sugar: 0, sodium: 70 } },
  { id: 'f-18', name: 'K\u00f6fte', category: 'protein', servingSize: 1, servingUnit: 'adet', nutrition: { calories: 120, protein: 8, carbs: 4, fat: 8, fiber: 0, sugar: 0, sodium: 200 } },
  { id: 'f-19', name: 'Mercimek \u00c7orbas\u0131', category: 'prepared', servingSize: 250, servingUnit: 'ml', nutrition: { calories: 180, protein: 10, carbs: 28, fat: 3, fiber: 6, sugar: 2, sodium: 600 } },
  { id: 'f-20', name: 'Kuru Fasulye', category: 'prepared', servingSize: 200, servingUnit: 'g', nutrition: { calories: 220, protein: 14, carbs: 34, fat: 4, fiber: 8, sugar: 2, sodium: 500 } },

  // Sebzeler
  { id: 'f-21', name: 'Ispanak', category: 'vegetable', servingSize: 100, servingUnit: 'g', nutrition: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4, sodium: 80 } },
  { id: 'f-22', name: 'Brokoli', category: 'vegetable', servingSize: 100, servingUnit: 'g', nutrition: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, sugar: 1.7, sodium: 33 } },
  { id: 'f-23', name: 'Havuc', category: 'vegetable', servingSize: 100, servingUnit: 'g', nutrition: { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, sugar: 4.7, sodium: 70 } },
  { id: 'f-24', name: 'Biber (Sivri)', category: 'vegetable', servingSize: 100, servingUnit: 'g', nutrition: { calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2, fiber: 1.7, sugar: 2.4, sodium: 3 } },
  { id: 'f-25', name: 'Patl\u0131can', category: 'vegetable', servingSize: 100, servingUnit: 'g', nutrition: { calories: 25, protein: 1, carbs: 6, fat: 0.2, fiber: 3, sugar: 3.5, sodium: 2 } },
  { id: 'f-26', name: 'Kabak', category: 'vegetable', servingSize: 100, servingUnit: 'g', nutrition: { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1, sugar: 2.5, sodium: 8 } },

  // Meyveler
  { id: 'f-27', name: 'Elma', category: 'fruit', servingSize: 1, servingUnit: 'adet', nutrition: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19, sodium: 2 } },
  { id: 'f-28', name: 'Muz', category: 'fruit', servingSize: 1, servingUnit: 'adet', nutrition: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14, sodium: 1 } },
  { id: 'f-29', name: 'Portakal', category: 'fruit', servingSize: 1, servingUnit: 'adet', nutrition: { calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, sugar: 12, sodium: 0 } },
  { id: 'f-30', name: '\u00c7ilek', category: 'fruit', servingSize: 100, servingUnit: 'g', nutrition: { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, sugar: 4.9, sodium: 1 } },
  { id: 'f-31', name: 'Karpuz', category: 'fruit', servingSize: 200, servingUnit: 'g', nutrition: { calories: 60, protein: 1.2, carbs: 15, fat: 0.3, fiber: 0.8, sugar: 12, sodium: 2 } },
  { id: 'f-32', name: '\u00dczum', category: 'fruit', servingSize: 100, servingUnit: 'g', nutrition: { calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9, sugar: 16, sodium: 2 } },

  // Icecekler
  { id: 'f-33', name: 'Ayran', category: 'beverage', servingSize: 200, servingUnit: 'ml', nutrition: { calories: 60, protein: 3, carbs: 4, fat: 3.5, fiber: 0, sugar: 4, sodium: 300 } },
  { id: 'f-34', name: '\u00c7ay (\u015eekersiz)', category: 'beverage', servingSize: 200, servingUnit: 'ml', nutrition: { calories: 2, protein: 0, carbs: 0.5, fat: 0, fiber: 0, sugar: 0, sodium: 0 } },
  { id: 'f-35', name: 'T\u00fcrk Kahvesi', category: 'beverage', servingSize: 65, servingUnit: 'ml', nutrition: { calories: 5, protein: 0.3, carbs: 0.7, fat: 0, fiber: 0, sugar: 0, sodium: 5 } },
  { id: 'f-36', name: 'Taze S\u0131k\u0131lm\u0131\u015f Portakal Suyu', category: 'beverage', servingSize: 200, servingUnit: 'ml', nutrition: { calories: 90, protein: 1.4, carbs: 21, fat: 0.4, fiber: 0.4, sugar: 17, sodium: 2 } },

  // Tatlilar & Atistirmalik
  { id: 'f-37', name: 'Baklava', category: 'snack', servingSize: 1, servingUnit: 'dilim', nutrition: { calories: 230, protein: 4, carbs: 28, fat: 12, fiber: 1, sugar: 18, sodium: 100 } },
  { id: 'f-38', name: 'S\u00fctla\u00e7', category: 'snack', servingSize: 200, servingUnit: 'g', nutrition: { calories: 180, protein: 5, carbs: 30, fat: 4, fiber: 0, sugar: 20, sodium: 80 } },
  { id: 'f-39', name: 'Kuruyemi\u015f Kar\u0131\u015f\u0131k', category: 'snack', servingSize: 30, servingUnit: 'g', nutrition: { calories: 175, protein: 5, carbs: 6, fat: 16, fiber: 2, sugar: 1, sodium: 3 } },
  { id: 'f-40', name: 'Hurma', category: 'fruit', servingSize: 2, servingUnit: 'adet', nutrition: { calories: 110, protein: 0.8, carbs: 29, fat: 0.1, fiber: 3, sugar: 25, sodium: 1 } },

  // Ana Yemekler
  { id: 'f-41', name: '\u0130mam Bay\u0131ld\u0131', category: 'prepared', servingSize: 200, servingUnit: 'g', nutrition: { calories: 160, protein: 3, carbs: 12, fat: 12, fiber: 4, sugar: 6, sodium: 350 } },
  { id: 'f-42', name: 'Etli D\u00f6ner', category: 'prepared', servingSize: 150, servingUnit: 'g', nutrition: { calories: 350, protein: 22, carbs: 15, fat: 22, fiber: 1, sugar: 2, sodium: 600 } },
  { id: 'f-43', name: 'Lahmacun', category: 'prepared', servingSize: 1, servingUnit: 'adet', nutrition: { calories: 270, protein: 12, carbs: 35, fat: 10, fiber: 2, sugar: 3, sodium: 550 } },
  { id: 'f-44', name: 'Pide (K\u0131ymal\u0131)', category: 'prepared', servingSize: 1, servingUnit: 'dilim', nutrition: { calories: 310, protein: 14, carbs: 38, fat: 12, fiber: 2, sugar: 2, sodium: 480 } },
  { id: 'f-45', name: 'Mant\u0131', category: 'prepared', servingSize: 250, servingUnit: 'g', nutrition: { calories: 340, protein: 16, carbs: 40, fat: 12, fiber: 2, sugar: 2, sodium: 550 } },
  { id: 'f-46', name: 'Karniyar\u0131k', category: 'prepared', servingSize: 250, servingUnit: 'g', nutrition: { calories: 280, protein: 12, carbs: 18, fat: 18, fiber: 5, sugar: 6, sodium: 400 } },
  { id: 'f-47', name: 'Ezogelin \u00c7orbas\u0131', category: 'prepared', servingSize: 250, servingUnit: 'ml', nutrition: { calories: 150, protein: 6, carbs: 25, fat: 3, fiber: 4, sugar: 2, sodium: 580 } },
  { id: 'f-48', name: 'Cacik', category: 'dairy', servingSize: 150, servingUnit: 'ml', nutrition: { calories: 50, protein: 3, carbs: 4, fat: 2.5, fiber: 0.3, sugar: 3, sodium: 200 } },
  { id: 'f-49', name: 'Zeytinyag\u0131', category: 'fat', servingSize: 10, servingUnit: 'ml', nutrition: { calories: 88, protein: 0, carbs: 0, fat: 10, fiber: 0, sugar: 0, sodium: 0 } },
  { id: 'f-50', name: 'Yo\u011furt', category: 'dairy', servingSize: 200, servingUnit: 'g', nutrition: { calories: 120, protein: 8, carbs: 9, fat: 6, fiber: 0, sugar: 9, sodium: 80 } },
  { id: 'f-51', name: '\u0130\u00e7 Pilav', category: 'prepared', servingSize: 150, servingUnit: 'g', nutrition: { calories: 220, protein: 5, carbs: 35, fat: 7, fiber: 1.5, sugar: 2, sodium: 300 } },
  { id: 'f-52', name: 'K\u0131s\u0131r', category: 'prepared', servingSize: 150, servingUnit: 'g', nutrition: { calories: 190, protein: 5, carbs: 30, fat: 6, fiber: 5, sugar: 3, sodium: 350 } },
  { id: 'f-53', name: 'Sigara B\u00f6re\u011fi', category: 'snack', servingSize: 1, servingUnit: 'adet', nutrition: { calories: 90, protein: 3, carbs: 8, fat: 5, fiber: 0.5, sugar: 0.5, sodium: 150 } },
  { id: 'f-54', name: '\u00c7i\u011f K\u00f6fte', category: 'prepared', servingSize: 100, servingUnit: 'g', nutrition: { calories: 160, protein: 6, carbs: 25, fat: 4, fiber: 4, sugar: 2, sodium: 400 } },
  { id: 'f-55', name: 'Humus', category: 'prepared', servingSize: 50, servingUnit: 'g', nutrition: { calories: 80, protein: 3, carbs: 8, fat: 4, fiber: 2, sugar: 0.5, sodium: 150 } },
];
