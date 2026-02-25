import { subMinutes, subHours, subDays, format } from "date-fns";

export type NotificationType =
  | "new_patient"
  | "meal_logged"
  | "appointment_reminder"
  | "appointment_cancelled"
  | "message_received"
  | "plan_completed"
  | "goal_reached"
  | "measurement_due"
  | "patient_inactive"
  | "review_received"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId: string | null;
  relatedType: "patient" | "appointment" | "meal" | "plan" | "review" | "system" | null;
  isRead: boolean;
  createdAt: string;
  actionUrl: string | null;
}

export const notificationTypeLabels: Record<NotificationType, string> = {
  new_patient: "Yeni Danışan",
  meal_logged: "Öğün Kaydı",
  appointment_reminder: "Randevu Hatırlatma",
  appointment_cancelled: "Randevu İptali",
  message_received: "Yeni Mesaj",
  plan_completed: "Plan Tamamlandı",
  goal_reached: "Hedef Ulaşıldı",
  measurement_due: "Ölçüm Zamanı",
  patient_inactive: "İnaktif Danışan",
  review_received: "Yeni Değerlendirme",
  system: "Sistem",
};

const now = new Date();

export const notifications: Notification[] = [
  {
    id: "notif-001",
    type: "meal_logged",
    title: "Yeni Öğün Kaydı",
    message: "Ayşe Yılmaz öğle yemeğini kaydetti.",
    relatedId: "meal-003",
    relatedType: "meal",
    isRead: false,
    createdAt: format(subMinutes(now, 10), "yyyy-MM-dd'T'HH:mm:ss"),
    actionUrl: "/patients/pat-001/meals",
  },
  {
    id: "notif-002",
    type: "message_received",
    title: "Yeni Mesaj",
    message: "Mehmet Kaya size bir dosya gönderdi.",
    relatedId: "conv-002",
    relatedType: "patient",
    isRead: false,
    createdAt: format(subHours(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
    actionUrl: "/messages/conv-002",
  },
  {
    id: "notif-003",
    type: "appointment_reminder",
    title: "Yarın Randevu",
    message: "Ayşe Yılmaz ile yarın saat 09:00'da kontrol randevunuz var.",
    relatedId: "apt-001",
    relatedType: "appointment",
    isRead: false,
    createdAt: format(subHours(now, 3), "yyyy-MM-dd'T'HH:mm:ss"),
    actionUrl: "/appointments/apt-001",
  },
  {
    id: "notif-004",
    type: "appointment_reminder",
    title: "Yarın Randevu",
    message: "Mehmet Kaya ile yarın saat 10:00'da ölçüm randevunuz var.",
    relatedId: "apt-002",
    relatedType: "appointment",
    isRead: false,
    createdAt: format(subHours(now, 3), "yyyy-MM-dd'T'HH:mm:ss"),
    actionUrl: "/appointments/apt-002",
  },
  {
    id: "notif-005",
    type: "new_patient",
    title: "Yeni Danışan Kaydı",
    message: "Selin Yıldız davet koduyla sisteme kaydoldu.",
    relatedId: "pat-009",
    relatedType: "patient",
    isRead: false,
    createdAt: format(subDays(now, 3), "yyyy-MM-dd'T'HH:mm:ss"),
    actionUrl: "/patients/pat-009",
  },
  {
    id: "notif-006",
    type: "meal_logged",
    title: "Yeni Öğün Kaydı",
    message: "Emre Arslan kahvaltısını kaydetti.",
    relatedId: "meal-009",
    relatedType: "meal",
    isRead: true,
    createdAt: format(subHours(now, 5), "yyyy-MM-dd'T'HH:mm:ss"),
    actionUrl: "/patients/pat-006/meals",
  },
  {
    id: "notif-007",
    type: "goal_reached",
    title: "Hedef Ulaşıldı!",
    message: "Hasan Şahin karaciğer yağlanması grade 1'e düştü. Tebrikler!",
    relatedId: "pat-008",
    relatedType: "patient",
    isRead: true,
    createdAt: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
    actionUrl: "/patients/pat-008",
  },
  {
    id: "notif-008",
    type: "review_received",
    title: "Yeni Değerlendirme",
    message: "Fatma Demir 5 yıldızlı bir değerlendirme bıraktı.",
    relatedId: "rev-002",
    relatedType: "review",
    isRead: true,
    createdAt: format(subDays(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
    actionUrl: "/reviews",
  },
  {
    id: "notif-009",
    type: "patient_inactive",
    title: "İnaktif Danışan Uyarısı",
    message: "Elif Koç 30 gündür öğün kaydı yapmadı ve randevulara gelmedi.",
    relatedId: "pat-007",
    relatedType: "patient",
    isRead: true,
    createdAt: format(subDays(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
    actionUrl: "/patients/pat-007",
  },
  {
    id: "notif-010",
    type: "appointment_cancelled",
    title: "Randevu İptali",
    message: "Burak Aydın iş seyahati nedeniyle randevusunu iptal etti.",
    relatedId: "apt-016",
    relatedType: "appointment",
    isRead: true,
    createdAt: format(subDays(now, 10), "yyyy-MM-dd'T'HH:mm:ss"),
    actionUrl: "/appointments/apt-016",
  },
  {
    id: "notif-011",
    type: "measurement_due",
    title: "Ölçüm Zamanı",
    message: "Ali Öztürk için aylık vücut analizi ölçüm zamanı geldi.",
    relatedId: "pat-004",
    relatedType: "patient",
    isRead: true,
    createdAt: format(subDays(now, 3), "yyyy-MM-dd'T'HH:mm:ss"),
    actionUrl: "/patients/pat-004",
  },
  {
    id: "notif-012",
    type: "plan_completed",
    title: "Plan Süresi Doldu",
    message: "Ayşe Yılmaz'ın 'Dengeli Kilo Verme Programı' 12 haftalık süresi doldu. Plan yenilenmelidir.",
    relatedId: "plan-001",
    relatedType: "plan",
    isRead: true,
    createdAt: format(subDays(now, 5), "yyyy-MM-dd'T'HH:mm:ss"),
    actionUrl: "/plans/plan-001",
  },
  {
    id: "notif-013",
    type: "system",
    title: "Sistem Güncellemesi",
    message: "NutriAI v2.3.0 güncellemesi yayınlandı. Yeni özellikler: gelişmiş yemek analizi, otomatik plan önerileri.",
    relatedId: null,
    relatedType: "system",
    isRead: true,
    createdAt: format(subDays(now, 7), "yyyy-MM-dd'T'HH:mm:ss"),
    actionUrl: null,
  },
  {
    id: "notif-014",
    type: "meal_logged",
    title: "Yeni Öğün Kaydı",
    message: "Mehmet Kaya öğle yemeğini kaydetti. Dikkat: Plan dışı gıda tespit edildi.",
    relatedId: "meal-005",
    relatedType: "meal",
    isRead: true,
    createdAt: format(subHours(now, 6), "yyyy-MM-dd'T'HH:mm:ss"),
    actionUrl: "/patients/pat-002/meals",
  },
  {
    id: "notif-015",
    type: "message_received",
    title: "Yeni Mesaj",
    message: "Emre Arslan size bir mesaj gönderdi.",
    relatedId: "conv-005",
    relatedType: "patient",
    isRead: false,
    createdAt: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
    actionUrl: "/messages/conv-005",
  },
];
