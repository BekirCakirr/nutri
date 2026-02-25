import { subDays, subHours, format } from "date-fns";

export interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  pendingPatients: number;
  inactivePatients: number;
  todayAppointments: number;
  weekAppointments: number;
  unreadMessages: number;
  pendingMealReviews: number;
  activePlans: number;
  averageAdherence: number;
  averageRating: number;
  totalReviews: number;
}

export interface DashboardAlert {
  id: string;
  type: "warning" | "info" | "success" | "error";
  title: string;
  message: string;
  actionUrl: string | null;
  createdAt: string;
}

export interface RecentActivity {
  id: string;
  type: "meal_logged" | "appointment_completed" | "message_sent" | "patient_joined" | "plan_assigned" | "review_received" | "goal_reached";
  description: string;
  patientName: string;
  patientId: string;
  timestamp: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface DashboardChartData {
  weeklyCalorieAdherence: ChartDataPoint[];
  patientGoalDistribution: ChartDataPoint[];
  monthlyNewPatients: ChartDataPoint[];
  dailyMealsLogged: ChartDataPoint[];
  appointmentTypeDistribution: ChartDataPoint[];
  weeklyRevenueEstimate: ChartDataPoint[];
}

const now = new Date();

export const dashboardStats: DashboardStats = {
  totalPatients: 10,
  activePatients: 7,
  pendingPatients: 1,
  inactivePatients: 2,
  todayAppointments: 3,
  weekAppointments: 7,
  unreadMessages: 4,
  pendingMealReviews: 5,
  activePlans: 3,
  averageAdherence: 89.5,
  averageRating: 4.6,
  totalReviews: 7,
};

export const dashboardAlerts: DashboardAlert[] = [
  {
    id: "alert-001",
    type: "warning",
    title: "Inaktif Danisan",
    message: "Elif Koc 30 gundur sisteme giris yapmadi ve randevulara gelmedi.",
    actionUrl: "/patients/pat-007",
    createdAt: format(subDays(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "alert-002",
    type: "info",
    title: "Yeni Danisan Bekliyor",
    message: "Selin Yildiz ilk gorusme icin randevu bekliyor.",
    actionUrl: "/patients/pat-009",
    createdAt: format(subDays(now, 3), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "alert-003",
    type: "success",
    title: "Hedef Basarisi",
    message: "Hasan Sahin karaciger yaglanmasinda grade 1'e dustu!",
    actionUrl: "/patients/pat-008",
    createdAt: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "alert-004",
    type: "warning",
    title: "Plan Suresi Doluyor",
    message: "Ayse Yilmaz'in beslenme plani 1 hafta icinde sona eriyor.",
    actionUrl: "/plans/plan-001",
    createdAt: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "alert-005",
    type: "error",
    title: "Plan Disi Beslenme",
    message: "Mehmet Kaya bugun 3 ogunde plan disi gida tuketti.",
    actionUrl: "/patients/pat-002/meals",
    createdAt: format(subHours(now, 4), "yyyy-MM-dd'T'HH:mm:ss"),
  },
];

export const recentActivity: RecentActivity[] = [
  {
    id: "act-001",
    type: "meal_logged",
    description: "Ogle yemegini kaydetti",
    patientName: "Ayse Yilmaz",
    patientId: "pat-001",
    timestamp: format(subHours(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "act-002",
    type: "meal_logged",
    description: "Kahvaltisini kaydetti",
    patientName: "Emre Arslan",
    patientId: "pat-006",
    timestamp: format(subHours(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "act-003",
    type: "meal_logged",
    description: "Ogle yemegini kaydetti (plan disi gida tespit edildi)",
    patientName: "Mehmet Kaya",
    patientId: "pat-002",
    timestamp: format(subHours(now, 3), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "act-004",
    type: "appointment_completed",
    description: "Kontrol randevusu tamamlandi",
    patientName: "Emre Arslan",
    patientId: "pat-006",
    timestamp: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "act-005",
    type: "review_received",
    description: "5 yildizli degerlendirme birakti",
    patientName: "Hasan Sahin",
    patientId: "pat-008",
    timestamp: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "act-006",
    type: "goal_reached",
    description: "Karaciger yaglanmasi grade 1'e dustu",
    patientName: "Hasan Sahin",
    patientId: "pat-008",
    timestamp: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "act-007",
    type: "patient_joined",
    description: "Davet koduyla sisteme kaydoldu",
    patientName: "Selin Yildiz",
    patientId: "pat-009",
    timestamp: format(subDays(now, 3), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "act-008",
    type: "message_sent",
    description: "Kan sekeri takip dosyasi gonderdi",
    patientName: "Mehmet Kaya",
    patientId: "pat-002",
    timestamp: format(subHours(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "act-009",
    type: "plan_assigned",
    description: "Diyabetik Beslenme Programi atandi",
    patientName: "Burak Aydin",
    patientId: "pat-010",
    timestamp: format(subDays(now, 4), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "act-010",
    type: "appointment_completed",
    description: "Olcum randevusu tamamlandi - Kolesterol dususte",
    patientName: "Ali Ozturk",
    patientId: "pat-004",
    timestamp: format(subDays(now, 12), "yyyy-MM-dd'T'HH:mm:ss"),
  },
];

export const dashboardChartData: DashboardChartData = {
  weeklyCalorieAdherence: [
    { label: "Pzt", value: 92 },
    { label: "Sal", value: 88 },
    { label: "Car", value: 95 },
    { label: "Per", value: 90 },
    { label: "Cum", value: 87 },
    { label: "Cmt", value: 78 },
    { label: "Paz", value: 82 },
  ],
  patientGoalDistribution: [
    { label: "Kilo Verme", value: 5 },
    { label: "Kas Yapma", value: 2 },
    { label: "Saglik Iyilestirme", value: 2 },
    { label: "Kilo Koruma", value: 1 },
  ],
  monthlyNewPatients: [
    { label: "Eyl", value: 2 },
    { label: "Eki", value: 1 },
    { label: "Kas", value: 2 },
    { label: "Ara", value: 1 },
    { label: "Oca", value: 1 },
    { label: "Sub", value: 3 },
  ],
  dailyMealsLogged: [
    { label: "Pzt", value: 32 },
    { label: "Sal", value: 28 },
    { label: "Car", value: 35 },
    { label: "Per", value: 30 },
    { label: "Cum", value: 27 },
    { label: "Cmt", value: 22 },
    { label: "Paz", value: 20 },
  ],
  appointmentTypeDistribution: [
    { label: "Kontrol", value: 8 },
    { label: "Olcum", value: 3 },
    { label: "Plan Degerlendirme", value: 2 },
    { label: "Ilk Gorusme", value: 1 },
    { label: "Online", value: 2 },
  ],
  weeklyRevenueEstimate: [
    { label: "Hafta 1", value: 4500 },
    { label: "Hafta 2", value: 5200 },
    { label: "Hafta 3", value: 4800 },
    { label: "Hafta 4", value: 5500 },
  ],
};
