import type { Dietitian } from '@/types';

export const mockDietitian: Dietitian = {
  id: 'diet-1',
  name: 'Dyt. Zeynep Kaya',
  avatar: 'https://i.pravatar.cc/150?u=zeynep',
  title: 'Klinik Diyetisyen',
  specializations: ['Kilo Y\u00f6netimi', 'Spor Beslenmesi', '\u00c7ocuk Beslenmesi'],
  rating: 4.8,
  reviewCount: 124,
  experience: 8,
  hospital: 'Ankara \u015eehir Hastanesi',
  available: true,
};

export const mockDietitians: Dietitian[] = [
  mockDietitian,
  {
    id: 'diet-2',
    name: 'Dyt. Ahmet \u00d6zt\u00fcrk',
    avatar: 'https://i.pravatar.cc/150?u=ahmet',
    title: 'Spor Diyetisyeni',
    specializations: ['Spor Beslenmesi', 'Kas Geli\u015fimi', 'Performans'],
    rating: 4.6,
    reviewCount: 89,
    experience: 5,
    hospital: '\u0130stanbul Fitness Merkezi',
    available: true,
  },
  {
    id: 'diet-3',
    name: 'Dyt. Fatma Demir',
    avatar: 'https://i.pravatar.cc/150?u=fatma',
    title: 'Pediatrik Diyetisyen',
    specializations: ['\u00c7ocuk Beslenmesi', 'Alerji', 'B\u00fcy\u00fcme Geli\u015fimi'],
    rating: 4.9,
    reviewCount: 210,
    experience: 12,
    hospital: 'Hacettepe \u00dcniversitesi Hastanesi',
    available: false,
  },
];
