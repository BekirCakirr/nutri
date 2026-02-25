import type { Badge, Challenge } from '@/types';

export const mockBadges: Badge[] = [
  {
    id: 'badge-1',
    name: '\u0130lk Ad\u0131m',
    description: '\u0130lk \u00f6\u011f\u00fcn\u00fcn\u00fc kaydet',
    icon: 'star',
    unlockedAt: '2025-11-01T12:00:00Z',
  },
  {
    id: 'badge-2',
    name: '7 G\u00fcn Seri',
    description: '7 g\u00fcn \u00fcst \u00fcste \u00f6\u011f\u00fcn kaydet',
    icon: 'flame',
    unlockedAt: '2026-02-24T20:00:00Z',
  },
  {
    id: 'badge-3',
    name: 'Su Kahraman\u0131',
    description: '7 g\u00fcn boyunca su hedefini tuttur',
    icon: 'water',
    unlockedAt: '2026-02-20T21:00:00Z',
  },
  {
    id: 'badge-4',
    name: 'Makro Ustas\u0131',
    description: 'Makro hedeflerini 5 g\u00fcn \u00fcst \u00fcste tuttur',
    icon: 'target',
  },
  {
    id: 'badge-5',
    name: 'A\u015f\u00e7\u0131ba\u015f\u0131',
    description: '10 farkl\u0131 tarif dene',
    icon: 'chef-hat',
  },
  {
    id: 'badge-6',
    name: 'Spor Tutkunu',
    description: '30 g\u00fcn boyunca egzersiz yap',
    icon: 'dumbbell',
  },
  {
    id: 'badge-7',
    name: 'Kilo Hedefi',
    description: 'Hedef kilona ula\u015f',
    icon: 'trophy',
  },
  {
    id: 'badge-8',
    name: 'Sosyal Kelebek',
    description: 'Diyetisyen ile 10 mesajla\u015f',
    icon: 'chat',
  },
];

export const mockChallenges: Challenge[] = [
  {
    id: 'ch-1',
    title: 'G\u00fcnl\u00fck Su Hedefi',
    description: 'Bug\u00fcn 2.5 litre su i\u00e7',
    type: 'daily',
    target: 2500,
    current: 1600,
    xpReward: 50,
    startDate: '2026-02-25',
    endDate: '2026-02-25',
  },
  {
    id: 'ch-2',
    title: 'Haftal\u0131k Egzersiz',
    description: 'Bu hafta toplam 150 dakika egzersiz yap',
    type: 'weekly',
    target: 150,
    current: 95,
    xpReward: 200,
    startDate: '2026-02-23',
    endDate: '2026-03-01',
  },
  {
    id: 'ch-3',
    title: 'Sebze Severler',
    description: 'Bu hafta her g\u00fcn en az 3 porsiyon sebze ye',
    type: 'weekly',
    target: 21,
    current: 12,
    xpReward: 150,
    startDate: '2026-02-23',
    endDate: '2026-03-01',
  },
  {
    id: 'ch-4',
    title: 'Kalori Takip\u00e7isi',
    description: 'Bu ay her g\u00fcn \u00f6\u011f\u00fcnlerini kaydet',
    type: 'monthly',
    target: 28,
    current: 22,
    xpReward: 500,
    startDate: '2026-02-01',
    endDate: '2026-02-28',
  },
];

export const mockGamificationData = {
  level: 5,
  xp: 1250,
  xpToNextLevel: 2000,
  streak: 7,
  totalBadges: mockBadges.filter((b) => b.unlockedAt).length,
};
