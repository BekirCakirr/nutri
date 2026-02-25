import { subDays, addDays, subMonths, format } from "date-fns";

export type InviteCodeStatus = "active" | "used" | "expired" | "revoked";

export interface InviteCode {
  id: string;
  code: string;
  dietitianId: string;
  dietitianName: string;
  patientName: string | null;
  patientEmail: string | null;
  status: InviteCodeStatus;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
  notes: string;
}

const now = new Date();

export const inviteCodes: InviteCode[] = [
  {
    id: "inv-001",
    code: "NUTRI-2026-A7XK",
    dietitianId: "diet-001",
    dietitianName: "Dyt. Deniz Yilmaz",
    patientName: null,
    patientEmail: null,
    status: "active",
    createdAt: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
    expiresAt: format(addDays(now, 29), "yyyy-MM-dd'T'HH:mm:ss"),
    usedAt: null,
    notes: "Genel davet kodu",
  },
  {
    id: "inv-002",
    code: "NUTRI-2026-B3MP",
    dietitianId: "diet-001",
    dietitianName: "Dyt. Deniz Yilmaz",
    patientName: "Selin Yildiz",
    patientEmail: "selin.yildiz@email.com",
    status: "used",
    createdAt: format(subDays(now, 5), "yyyy-MM-dd'T'HH:mm:ss"),
    expiresAt: format(addDays(now, 25), "yyyy-MM-dd'T'HH:mm:ss"),
    usedAt: format(subDays(now, 3), "yyyy-MM-dd'T'HH:mm:ss"),
    notes: "Universite ogrencisi, arkadasin tavsiyesiyle",
  },
  {
    id: "inv-003",
    code: "NUTRI-2026-C9RB",
    dietitianId: "diet-001",
    dietitianName: "Dyt. Deniz Yilmaz",
    patientName: null,
    patientEmail: null,
    status: "expired",
    createdAt: format(subMonths(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
    expiresAt: format(subMonths(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
    usedAt: null,
    notes: "Suresi doldu, kullanilmadi",
  },
  {
    id: "inv-004",
    code: "NUTRI-2026-D5TW",
    dietitianId: "diet-001",
    dietitianName: "Dyt. Deniz Yilmaz",
    patientName: "Burak Aydin",
    patientEmail: "burak.aydin@email.com",
    status: "used",
    createdAt: format(subMonths(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
    expiresAt: format(subMonths(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
    usedAt: format(subMonths(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
    notes: "Is arkadasinin tavsiyesiyle",
  },
  {
    id: "inv-005",
    code: "NUTRI-2026-E2FN",
    dietitianId: "diet-001",
    dietitianName: "Dyt. Deniz Yilmaz",
    patientName: null,
    patientEmail: "yeni.hasta@email.com",
    status: "active",
    createdAt: format(subDays(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
    expiresAt: format(addDays(now, 28), "yyyy-MM-dd'T'HH:mm:ss"),
    usedAt: null,
    notes: "Instagram uzerinden basvuran hasta icin",
  },
  {
    id: "inv-006",
    code: "NUTRI-2026-F8GH",
    dietitianId: "diet-001",
    dietitianName: "Dyt. Deniz Yilmaz",
    patientName: null,
    patientEmail: null,
    status: "revoked",
    createdAt: format(subDays(now, 20), "yyyy-MM-dd'T'HH:mm:ss"),
    expiresAt: format(addDays(now, 10), "yyyy-MM-dd'T'HH:mm:ss"),
    usedAt: null,
    notes: "Yanlis olusturuldu, iptal edildi",
  },
  {
    id: "inv-007",
    code: "NUTRI-2026-G1JK",
    dietitianId: "diet-001",
    dietitianName: "Dyt. Deniz Yilmaz",
    patientName: "Ayse Yilmaz",
    patientEmail: "ayse.yilmaz@email.com",
    status: "used",
    createdAt: format(subMonths(now, 4), "yyyy-MM-dd'T'HH:mm:ss"),
    expiresAt: format(subMonths(now, 3), "yyyy-MM-dd'T'HH:mm:ss"),
    usedAt: format(subMonths(now, 3), "yyyy-MM-dd'T'HH:mm:ss"),
    notes: "Doktor yonlendirmesiyle",
  },
  {
    id: "inv-008",
    code: "NUTRI-2026-H4LM",
    dietitianId: "diet-001",
    dietitianName: "Dyt. Deniz Yilmaz",
    patientName: null,
    patientEmail: null,
    status: "active",
    createdAt: format(now, "yyyy-MM-dd'T'HH:mm:ss"),
    expiresAt: format(addDays(now, 30), "yyyy-MM-dd'T'HH:mm:ss"),
    usedAt: null,
    notes: "Sosyal medya kampanyasi icin",
  },
];

export const inviteCodeStats = {
  total: 8,
  active: 3,
  used: 3,
  expired: 1,
  revoked: 1,
};

export const inviteCodeStatusLabels: Record<InviteCodeStatus, string> = {
  active: "Aktif",
  used: "Kullanildi",
  expired: "Suresi Doldu",
  revoked: "Iptal Edildi",
};
