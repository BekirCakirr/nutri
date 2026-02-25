import type { User, Profile } from '@/types';

export const mockUser: User = {
  id: 'user-1',
  email: 'ayse@nutriai.com',
  name: 'Ay\u015fe Y\u0131lmaz',
  avatar: 'https://i.pravatar.cc/150?u=ayse',
  phone: '+905551234567',
  birthDate: '1992-03-15',
  gender: 'female',
  height: 165,
  weight: 68,
  targetWeight: 60,
  activityLevel: 'moderate',
  goal: 'lose',
  createdAt: '2025-11-01T10:00:00Z',
};

export const mockProfile: Profile = {
  ...mockUser,
  allergies: ['F\u0131nd\u0131k', 'Deniz \u00dcr\u00fcnleri'],
  preferences: ['gluten_free'],
  familyMembers: [
    {
      id: 'fm-1',
      name: 'Mehmet Y\u0131lmaz',
      relationship: 'E\u015f',
      birthDate: '1990-07-20',
      allergies: [],
    },
    {
      id: 'fm-2',
      name: 'Elif Y\u0131lmaz',
      relationship: '\u00c7ocuk',
      birthDate: '2018-01-10',
      allergies: ['S\u00fct'],
    },
  ],
};
