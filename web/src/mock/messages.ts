import { subDays, subHours, subMinutes, format } from "date-fns";

export interface Conversation {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string | null;
  dietitianId: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: "dietitian" | "patient";
  senderName: string;
  content: string;
  type: "text" | "image" | "file" | "meal_log";
  attachmentUrl: string | null;
  attachmentName: string | null;
  readAt: string | null;
  createdAt: string;
}

const now = new Date();

export const conversations: Conversation[] = [
  {
    id: "conv-001",
    patientId: "pat-001",
    patientName: "Ayşe Yılmaz",
    patientAvatar: null,
    dietitianId: "diet-001",
    lastMessage: "Teşekkürler hocam, kahvaltıda lor peyniri ile değiştirdim.",
    lastMessageAt: format(subMinutes(now, 15), "yyyy-MM-dd'T'HH:mm:ss"),
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: "conv-002",
    patientId: "pat-002",
    patientName: "Mehmet Kaya",
    patientAvatar: null,
    dietitianId: "diet-001",
    lastMessage: "Kan şekeri ölçümlerimi gönderdim, bakabilir misiniz?",
    lastMessageAt: format(subHours(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
    unreadCount: 2,
    isOnline: false,
  },
  {
    id: "conv-003",
    patientId: "pat-003",
    patientName: "Fatma Demir",
    patientAvatar: null,
    dietitianId: "diet-001",
    lastMessage: "Glutensiz makarna markası öneriniz var mı?",
    lastMessageAt: format(subHours(now, 5), "yyyy-MM-dd'T'HH:mm:ss"),
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "conv-004",
    patientId: "pat-005",
    patientName: "Zeynep Çelik",
    patientAvatar: null,
    dietitianId: "diet-001",
    lastMessage: "Yarınki online görüşme için hazırım.",
    lastMessageAt: format(subHours(now, 8), "yyyy-MM-dd'T'HH:mm:ss"),
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "conv-005",
    patientId: "pat-006",
    patientName: "Emre Arslan",
    patientAvatar: null,
    dietitianId: "diet-001",
    lastMessage: "Antrenman sonrası protein ihtiyacımı karşılamak için ne önerirsiniz?",
    lastMessageAt: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: "conv-006",
    patientId: "pat-008",
    patientName: "Hasan Şahin",
    patientAvatar: null,
    dietitianId: "diet-001",
    lastMessage: "Ultrason sonuçlarım çıktı, ekte gönderiyorum.",
    lastMessageAt: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "conv-007",
    patientId: "pat-010",
    patientName: "Burak Aydın",
    patientAvatar: null,
    dietitianId: "diet-001",
    lastMessage: "Hocam süt ürünü yerine ne kullanabilirim?",
    lastMessageAt: format(subDays(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
    unreadCount: 0,
    isOnline: false,
  },
];

export const messages: Message[] = [
  // Conversation with Ayse Yilmaz (conv-001)
  {
    id: "msg-001",
    conversationId: "conv-001",
    senderId: "diet-001",
    senderType: "dietitian",
    senderName: "Dyt. Deniz Yılmaz",
    content: "Günaydın Ayşe Hanım! Bugünkü kahvaltınızı inceledim, çok güzel bir seçim olmuş. Protein oranı gayet iyi.",
    type: "text",
    attachmentUrl: null,
    attachmentName: null,
    readAt: format(subMinutes(now, 45), "yyyy-MM-dd'T'HH:mm:ss"),
    createdAt: format(subHours(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "msg-002",
    conversationId: "conv-001",
    senderId: "diet-001",
    senderType: "dietitian",
    senderName: "Dyt. Deniz Yılmaz",
    content: "Sadece bir öneri: beyaz peynir yerine lor peyniri tercih ederseniz, daha az yağ alırsınız ve protein oranı da biraz daha yüksek olur.",
    type: "text",
    attachmentUrl: null,
    attachmentName: null,
    readAt: format(subMinutes(now, 45), "yyyy-MM-dd'T'HH:mm:ss"),
    createdAt: format(subMinutes(now, 58), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "msg-003",
    conversationId: "conv-001",
    senderId: "pat-001",
    senderType: "patient",
    senderName: "Ayşe Yılmaz",
    content: "Teşekkürler hocam, kahvaltıda lor peyniri ile değiştirdim.",
    type: "text",
    attachmentUrl: null,
    attachmentName: null,
    readAt: null,
    createdAt: format(subMinutes(now, 15), "yyyy-MM-dd'T'HH:mm:ss"),
  },

  // Conversation with Mehmet Kaya (conv-002)
  {
    id: "msg-004",
    conversationId: "conv-002",
    senderId: "pat-002",
    senderType: "patient",
    senderName: "Mehmet Kaya",
    content: "Hocam merhaba, bugünkü öğle yemeğimde pirinç pilavı yedim ama bulgur bulamadım. Sorun olur mu?",
    type: "text",
    attachmentUrl: null,
    attachmentName: null,
    readAt: format(subHours(now, 3), "yyyy-MM-dd'T'HH:mm:ss"),
    createdAt: format(subHours(now, 4), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "msg-005",
    conversationId: "conv-002",
    senderId: "diet-001",
    senderType: "dietitian",
    senderName: "Dyt. Deniz Yılmaz",
    content: "Merhaba Mehmet Bey, arada bir sorun olmaz ama bulgur pilavı kan şekerinizi daha az etkiler. Mümkünse bulgur tercih edin. Öğle yemeğinizi düzeltme olarak işaretledim, bir sonraki öğünde dikkat edelim.",
    type: "text",
    attachmentUrl: null,
    attachmentName: null,
    readAt: format(subHours(now, 2.5), "yyyy-MM-dd'T'HH:mm:ss"),
    createdAt: format(subHours(now, 3), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "msg-006",
    conversationId: "conv-002",
    senderId: "pat-002",
    senderType: "patient",
    senderName: "Mehmet Kaya",
    content: "Kan şekeri ölçümlerimi gönderdim, bakabilir misiniz?",
    type: "text",
    attachmentUrl: null,
    attachmentName: null,
    readAt: null,
    createdAt: format(subHours(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "msg-007",
    conversationId: "conv-002",
    senderId: "pat-002",
    senderType: "patient",
    senderName: "Mehmet Kaya",
    content: "kan_sekeri_takibi.pdf",
    type: "file",
    attachmentUrl: "/uploads/kan_sekeri_takibi.pdf",
    attachmentName: "kan_sekeri_takibi.pdf",
    readAt: null,
    createdAt: format(subHours(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
  },

  // Conversation with Fatma Demir (conv-003)
  {
    id: "msg-008",
    conversationId: "conv-003",
    senderId: "pat-003",
    senderType: "patient",
    senderName: "Fatma Demir",
    content: "Glutensiz makarna markası öneriniz var mı?",
    type: "text",
    attachmentUrl: null,
    attachmentName: null,
    readAt: format(subHours(now, 4), "yyyy-MM-dd'T'HH:mm:ss"),
    createdAt: format(subHours(now, 5), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "msg-009",
    conversationId: "conv-003",
    senderId: "diet-001",
    senderType: "dietitian",
    senderName: "Dyt. Deniz Yılmaz",
    content: "Merhaba Fatma Hanım! Pirinç unu veya mısır unu bazlı makarnalar iyi bir seçenek. Marketlerde glutensiz ürün reyonlarında bulabilirsiniz. Nohut unu makarnaları da protein açısından çok zengin, denemenizi tavsiye ederim.",
    type: "text",
    attachmentUrl: null,
    attachmentName: null,
    readAt: format(subHours(now, 4), "yyyy-MM-dd'T'HH:mm:ss"),
    createdAt: format(subHours(now, 4.5), "yyyy-MM-dd'T'HH:mm:ss"),
  },

  // Conversation with Zeynep Celik (conv-004)
  {
    id: "msg-010",
    conversationId: "conv-004",
    senderId: "diet-001",
    senderType: "dietitian",
    senderName: "Dyt. Deniz Yılmaz",
    content: "Merhaba Zeynep Hanım, yarınki online görüşmemiz 11:00'de. Lütfen son 1 haftanın yemek kayıtlarını kontrol edin ve varsa sorularınızı not edin.",
    type: "text",
    attachmentUrl: null,
    attachmentName: null,
    readAt: format(subHours(now, 7), "yyyy-MM-dd'T'HH:mm:ss"),
    createdAt: format(subHours(now, 9), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "msg-011",
    conversationId: "conv-004",
    senderId: "pat-005",
    senderType: "patient",
    senderName: "Zeynep Çelik",
    content: "Yarınki online görüşme için hazırım.",
    type: "text",
    attachmentUrl: null,
    attachmentName: null,
    readAt: format(subHours(now, 7), "yyyy-MM-dd'T'HH:mm:ss"),
    createdAt: format(subHours(now, 8), "yyyy-MM-dd'T'HH:mm:ss"),
  },

  // Conversation with Emre Arslan (conv-005)
  {
    id: "msg-012",
    conversationId: "conv-005",
    senderId: "pat-006",
    senderType: "patient",
    senderName: "Emre Arslan",
    content: "Hocam bugün ağırlık antrenmanından sonra çok acıktım. Protein ihtiyacımı hızlıca karşılamak için ne önerirsiniz?",
    type: "text",
    attachmentUrl: null,
    attachmentName: null,
    readAt: null,
    createdAt: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "msg-013",
    conversationId: "conv-005",
    senderId: "pat-006",
    senderType: "patient",
    senderName: "Emre Arslan",
    content: "Antrenman sonrası protein ihtiyacımı karşılamak için ne önerirsiniz?",
    type: "text",
    attachmentUrl: null,
    attachmentName: null,
    readAt: null,
    createdAt: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },

  // Conversation with Hasan Sahin (conv-006)
  {
    id: "msg-014",
    conversationId: "conv-006",
    senderId: "pat-008",
    senderType: "patient",
    senderName: "Hasan Şahin",
    content: "Hocam merhaba, ultrason sonuçlarım çıktı. Karaciğer yağlanması grade 2'den grade 1'e düşmüş!",
    type: "text",
    attachmentUrl: null,
    attachmentName: null,
    readAt: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
    createdAt: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "msg-015",
    conversationId: "conv-006",
    senderId: "pat-008",
    senderType: "patient",
    senderName: "Hasan Şahin",
    content: "Ultrason sonuçlarım çıktı, ekte gönderiyorum.",
    type: "file",
    attachmentUrl: "/uploads/ultrason_raporu_hasan.pdf",
    attachmentName: "ultrason_raporu_hasan.pdf",
    readAt: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
    createdAt: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "msg-016",
    conversationId: "conv-006",
    senderId: "diet-001",
    senderType: "dietitian",
    senderName: "Dyt. Deniz Yılmaz",
    content: "Harika haber Hasan Bey! Bu sonuçlar çok olumlu, diyetinize uyumunuzun karşılığını aldığınızı gösteriyor. Aynı şekilde devam edelim, online görüşmemizde detaylı değerlendireceğiz.",
    type: "text",
    attachmentUrl: null,
    attachmentName: null,
    readAt: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
    createdAt: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },

  // Conversation with Burak Aydin (conv-007)
  {
    id: "msg-017",
    conversationId: "conv-007",
    senderId: "pat-010",
    senderType: "patient",
    senderName: "Burak Aydın",
    content: "Hocam süt ürünü yerine ne kullanabilirim? Laktoz intoleransım olduğu için zorluk çekiyorum.",
    type: "text",
    attachmentUrl: null,
    attachmentName: null,
    readAt: format(subDays(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
    createdAt: format(subDays(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "msg-018",
    conversationId: "conv-007",
    senderId: "diet-001",
    senderType: "dietitian",
    senderName: "Dyt. Deniz Yılmaz",
    content: "Merhaba Burak Bey, laktozsuz süt ürünleri kullanabilirsiniz. Ayrıca badem sütü, hindistan cevizi yoğurdu gibi bitkisel alternatifler de iyi birer seçenek. Kalsiyum ihtiyacınızı karşılamak için brokoli, badem ve susam gibi gıdalara ağırlık verelim.",
    type: "text",
    attachmentUrl: null,
    attachmentName: null,
    readAt: format(subDays(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
    createdAt: format(subDays(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
  },
];
