import type { ProgressPhoto } from '@/types';

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

const mockPhotos: ProgressPhoto[] = [
  {
    id: 'pp-1',
    uri: 'https://picsum.photos/seed/progress1/400/600',
    date: '2025-12-01',
    weight: 72,
    note: 'Ba\u015flang\u0131\u00e7',
  },
  {
    id: 'pp-2',
    uri: 'https://picsum.photos/seed/progress2/400/600',
    date: '2026-01-01',
    weight: 70.5,
    note: '1. ay',
  },
  {
    id: 'pp-3',
    uri: 'https://picsum.photos/seed/progress3/400/600',
    date: '2026-02-01',
    weight: 69,
    note: '2. ay',
  },
];

export async function getProgressPhotos(): Promise<ProgressPhoto[]> {
  await delay();
  return mockPhotos;
}

export async function addProgressPhoto(photo: Omit<ProgressPhoto, 'id'>): Promise<ProgressPhoto> {
  await delay(800);
  return { ...photo, id: 'pp-' + Date.now() };
}

export async function deleteProgressPhoto(id: string): Promise<void> {
  await delay(400);
}
