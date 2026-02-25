import type { Appointment } from '@/types';

export const mockAppointments: Appointment[] = [
  {
    id: 'apt-1',
    dietitianId: 'diet-1',
    dietitianName: 'Dyt. Zeynep Kaya',
    date: '2026-02-26',
    time: '14:00',
    duration: 45,
    type: 'online',
    status: 'scheduled',
    notes: 'Haftal\u0131k kontrol randevusu',
  },
  {
    id: 'apt-2',
    dietitianId: 'diet-1',
    dietitianName: 'Dyt. Zeynep Kaya',
    date: '2026-02-19',
    time: '14:00',
    duration: 45,
    type: 'online',
    status: 'completed',
    notes: '\u0130lk g\u00f6r\u00fc\u015fme ve plan olu\u015fturma',
  },
  {
    id: 'apt-3',
    dietitianId: 'diet-1',
    dietitianName: 'Dyt. Zeynep Kaya',
    date: '2026-03-05',
    time: '10:00',
    duration: 30,
    type: 'in_person',
    status: 'scheduled',
    notes: 'Ayl\u0131k de\u011ferlendirme',
  },
];
