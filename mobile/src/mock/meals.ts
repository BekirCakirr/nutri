import type { Meal } from '@/types';
import { mockFoods } from './foods';

const find = (id: string) => mockFoods.find((f) => f.id === id)!;

export const mockMeals: Meal[] = [
  {
    id: 'meal-1',
    type: 'breakfast',
    date: '2026-02-25',
    time: '08:30',
    items: [
      { food: find('f-7'), quantity: 1, unit: 'adet' },
      { food: find('f-1'), quantity: 2, unit: 'dilim' },
      { food: find('f-3'), quantity: 1, unit: 'porsiyon' },
      { food: find('f-5'), quantity: 1, unit: 'adet' },
      { food: find('f-6'), quantity: 0.5, unit: 'adet' },
      { food: find('f-11'), quantity: 2, unit: 'dilim' },
      { food: find('f-34'), quantity: 1, unit: 'bardak' },
    ],
    totalNutrition: { calories: 470, protein: 25, carbs: 40, fat: 28, fiber: 6 },
    notes: 'G\u00fczel bir T\u00fcrk kahvalt\u0131s\u0131',
  },
  {
    id: 'meal-2',
    type: 'lunch',
    date: '2026-02-25',
    time: '12:30',
    items: [
      { food: find('f-19'), quantity: 1, unit: 'kase' },
      { food: find('f-16'), quantity: 1, unit: 'porsiyon' },
      { food: find('f-14'), quantity: 1, unit: 'porsiyon' },
      { food: find('f-33'), quantity: 1, unit: 'bardak' },
    ],
    totalNutrition: { calories: 650, protein: 63, carbs: 67, fat: 13, fiber: 10 },
  },
  {
    id: 'meal-3',
    type: 'snack',
    date: '2026-02-25',
    time: '15:30',
    items: [
      { food: find('f-27'), quantity: 1, unit: 'adet' },
      { food: find('f-39'), quantity: 1, unit: 'avu\u00e7' },
    ],
    totalNutrition: { calories: 270, protein: 5.5, carbs: 31, fat: 16.3, fiber: 6.4 },
  },
  {
    id: 'meal-4',
    type: 'dinner',
    date: '2026-02-25',
    time: '19:00',
    items: [
      { food: find('f-47'), quantity: 1, unit: 'kase' },
      { food: find('f-46'), quantity: 1, unit: 'porsiyon' },
      { food: find('f-50'), quantity: 1, unit: 'kase' },
    ],
    totalNutrition: { calories: 550, protein: 26, carbs: 52, fat: 27, fiber: 9 },
  },
  {
    id: 'meal-5',
    type: 'breakfast',
    date: '2026-02-24',
    time: '09:00',
    items: [
      { food: find('f-10'), quantity: 1, unit: 'adet' },
      { food: find('f-35'), quantity: 1, unit: 'fincan' },
      { food: find('f-1'), quantity: 1, unit: 'dilim' },
    ],
    totalNutrition: { calories: 365, protein: 13.3, carbs: 49.2, fat: 12, fiber: 2 },
  },
  {
    id: 'meal-6',
    type: 'lunch',
    date: '2026-02-24',
    time: '13:00',
    items: [
      { food: find('f-43'), quantity: 1, unit: 'adet' },
      { food: find('f-33'), quantity: 1, unit: 'bardak' },
    ],
    totalNutrition: { calories: 330, protein: 15, carbs: 39, fat: 13.5, fiber: 2 },
  },
];
