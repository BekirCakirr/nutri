import type { Dietitian } from '@/types';
import { mockDietitian, mockDietitians } from '@/mock';

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export async function getPairedDietitian(): Promise<Dietitian | null> {
  await delay();
  return mockDietitian;
}

export async function requestPairing(code: string): Promise<Dietitian> {
  await delay(1000);
  return mockDietitian;
}

export async function unpairDietitian(): Promise<void> {
  await delay();
}

export async function getDietitians(): Promise<Dietitian[]> {
  await delay();
  return mockDietitians;
}

export async function getDietitianById(id: string): Promise<Dietitian | null> {
  await delay(400);
  return mockDietitians.find((d) => d.id === id) ?? null;
}
