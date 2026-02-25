export interface AdminStats {
  totalUsers: number;
  totalDietitians: number;
  totalPatients: number;
  activeSessions: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  systemUptime: string;
  avgResponseTime: string;
  totalMealsLogged: number;
  totalAppointments: number;
  totalRevenue: number;
}

export interface SystemHealth {
  service: string;
  status: "healthy" | "degraded" | "down";
  latency: number;
  uptime: number;
  details: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "dietitian" | "patient";
  status: "active" | "inactive" | "pending" | "suspended";
  city: string;
  createdAt: string;
  lastLogin: string | null;
  patientCount: number | null;
  rating: number | null;
}

export const adminStats: AdminStats = {
  totalUsers: 156,
  totalDietitians: 12,
  totalPatients: 142,
  activeSessions: 34,
  newUsersToday: 2,
  newUsersThisWeek: 8,
  newUsersThisMonth: 23,
  systemUptime: "99.8%",
  avgResponseTime: "145ms",
  totalMealsLogged: 8420,
  totalAppointments: 512,
  totalRevenue: 187500,
};

export const systemHealth: SystemHealth[] = [
  {
    service: "API Sunucusu",
    status: "healthy",
    latency: 45,
    uptime: 99.9,
    details: "Tum endpointler normal calisiyor",
  },
  {
    service: "Veritabani (PostgreSQL)",
    status: "healthy",
    latency: 12,
    uptime: 99.95,
    details: "Baglanti havuzu: 23/100 aktif",
  },
  {
    service: "Dosya Depolama",
    status: "healthy",
    latency: 85,
    uptime: 99.9,
    details: "Kullanim: 34.2 GB / 100 GB (%34.2)",
  },
  {
    service: "AI Servis (NutriAI)",
    status: "degraded",
    latency: 320,
    uptime: 98.5,
    details: "Yanitlama suresi normalin uzerinde, izleniyor",
  },
  {
    service: "WebSocket Sunucusu",
    status: "healthy",
    latency: 8,
    uptime: 99.8,
    details: "Aktif baglanti: 34 / 1000",
  },
  {
    service: "E-posta Servisi",
    status: "healthy",
    latency: 210,
    uptime: 99.7,
    details: "Kuyrukta 0 e-posta",
  },
  {
    service: "Bildirim Servisi",
    status: "healthy",
    latency: 15,
    uptime: 99.9,
    details: "Push ve in-app bildirimler aktif",
  },
];

export const adminUsers: AdminUser[] = [
  {
    id: "admin-001",
    name: "Ahmet Yildirim",
    email: "ahmet@nutriai.com.tr",
    role: "admin",
    status: "active",
    city: "Istanbul",
    createdAt: "2025-01-01",
    lastLogin: "2026-02-25T09:00:00",
    patientCount: null,
    rating: null,
  },
  {
    id: "diet-001",
    name: "Dyt. Deniz Yilmaz",
    email: "deniz.yilmaz@nutriai.com.tr",
    role: "dietitian",
    status: "active",
    city: "Istanbul",
    createdAt: "2025-03-15",
    lastLogin: "2026-02-25T08:30:00",
    patientCount: 10,
    rating: 4.6,
  },
  {
    id: "diet-002",
    name: "Dyt. Berk Ozkan",
    email: "berk.ozkan@nutriai.com.tr",
    role: "dietitian",
    status: "active",
    city: "Ankara",
    createdAt: "2025-05-20",
    lastLogin: "2026-02-25T10:15:00",
    patientCount: 15,
    rating: 4.8,
  },
  {
    id: "diet-003",
    name: "Dyt. Canan Kara",
    email: "canan.kara@nutriai.com.tr",
    role: "dietitian",
    status: "active",
    city: "Izmir",
    createdAt: "2025-06-10",
    lastLogin: "2026-02-24T16:00:00",
    patientCount: 8,
    rating: 4.9,
  },
  {
    id: "diet-004",
    name: "Dyt. Serkan Dogan",
    email: "serkan.dogan@nutriai.com.tr",
    role: "dietitian",
    status: "active",
    city: "Bursa",
    createdAt: "2025-08-01",
    lastLogin: "2026-02-25T07:45:00",
    patientCount: 12,
    rating: 4.5,
  },
  {
    id: "diet-005",
    name: "Dyt. Gamze Tekin",
    email: "gamze.tekin@nutriai.com.tr",
    role: "dietitian",
    status: "pending",
    city: "Antalya",
    createdAt: "2026-02-20",
    lastLogin: null,
    patientCount: 0,
    rating: null,
  },
  {
    id: "pat-001",
    name: "Ayse Yilmaz",
    email: "ayse.yilmaz@email.com",
    role: "patient",
    status: "active",
    city: "Istanbul",
    createdAt: "2025-11-15",
    lastLogin: "2026-02-25T08:45:00",
    patientCount: null,
    rating: null,
  },
  {
    id: "pat-002",
    name: "Mehmet Kaya",
    email: "mehmet.kaya@email.com",
    role: "patient",
    status: "active",
    city: "Ankara",
    createdAt: "2025-08-20",
    lastLogin: "2026-02-25T07:50:00",
    patientCount: null,
    rating: null,
  },
  {
    id: "pat-007",
    name: "Elif Koc",
    email: "elif.koc@email.com",
    role: "patient",
    status: "inactive",
    city: "Gaziantep",
    createdAt: "2025-04-10",
    lastLogin: "2026-01-10T12:00:00",
    patientCount: null,
    rating: null,
  },
  {
    id: "diet-006",
    name: "Dyt. Hakan Celik",
    email: "hakan.celik@nutriai.com.tr",
    role: "dietitian",
    status: "suspended",
    city: "Konya",
    createdAt: "2025-07-15",
    lastLogin: "2026-01-05T14:00:00",
    patientCount: 3,
    rating: 3.2,
  },
];

export const adminDietitianStats = {
  totalDietitians: 12,
  activeDietitians: 9,
  pendingApproval: 2,
  suspended: 1,
  averageRating: 4.5,
  averagePatientsPerDietitian: 11.8,
  topPerformer: {
    name: "Dyt. Canan Kara",
    rating: 4.9,
    patientCount: 8,
    adherenceRate: 94,
  },
};

export const adminMonthlyGrowth = [
  { month: "Eylul", users: 12, dietitians: 1, patients: 11 },
  { month: "Ekim", users: 15, dietitians: 2, patients: 13 },
  { month: "Kasim", users: 18, dietitians: 1, patients: 17 },
  { month: "Aralik", users: 14, dietitians: 2, patients: 12 },
  { month: "Ocak", users: 20, dietitians: 1, patients: 19 },
  { month: "Subat", users: 23, dietitians: 3, patients: 20 },
];
