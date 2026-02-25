import { subDays, subMonths, format } from "date-fns";

export interface Review {
  id: string;
  patientId: string;
  patientName: string;
  dietitianId: string;
  rating: number;
  title: string;
  comment: string;
  categories: {
    communication: number;
    expertise: number;
    planQuality: number;
    results: number;
    availability: number;
  };
  isPublic: boolean;
  dietitianResponse: string | null;
  createdAt: string;
}

const now = new Date();

export const reviews: Review[] = [
  {
    id: "rev-001",
    patientId: "pat-002",
    patientName: "Mehmet Kaya",
    dietitianId: "diet-001",
    rating: 5,
    title: "Diyabet yönetiminde büyük ilerleme",
    comment:
      "6 aydır Deniz Hanım ile çalışıyorum. Açlık kan şekerim 180'den 120'ye düştü. Benim için özel hazırlanan diyabet programı çok etkili oldu. Her aşamada yanımda oldu ve sorularıma hızlı yanıt verdi.",
    categories: {
      communication: 5,
      expertise: 5,
      planQuality: 5,
      results: 5,
      availability: 4,
    },
    isPublic: true,
    dietitianResponse:
      "Teşekkürler Mehmet Bey! Sizin disiplininiz ve uyumunuz bu başarıda en büyük pay sahibi. Birlikte daha da iyi sonuçlar alacağız.",
    createdAt: format(subDays(now, 5), "yyyy-MM-dd"),
  },
  {
    id: "rev-002",
    patientId: "pat-003",
    patientName: "Fatma Demir",
    dietitianId: "diet-001",
    rating: 5,
    title: "Glutensiz yaşamı çok kolaylaştırdı",
    comment:
      "Çölyak tanısı aldıktan sonra ne yiyeceğimi bilmiyordum. Deniz Hanım glutensiz beslenme konusunda çok bilgili ve yaratıcı bir diyetisyen. Kas geliştirme hedefime de ulaşmama yardımcı oluyor. Tarifler harika!",
    categories: {
      communication: 5,
      expertise: 5,
      planQuality: 5,
      results: 4,
      availability: 5,
    },
    isPublic: true,
    dietitianResponse:
      "Çok teşekkür ederim Fatma Hanım! Glutensiz beslenmenin sınırlayıcı olmadığını birlikte kanıtlıyoruz. Başarılarınız devam edecek.",
    createdAt: format(subDays(now, 2), "yyyy-MM-dd"),
  },
  {
    id: "rev-003",
    patientId: "pat-006",
    patientName: "Emre Arslan",
    dietitianId: "diet-001",
    rating: 4,
    title: "Sporcu beslenme planı çok iyi",
    comment:
      "Profesyonel olarak spor yapıyorum ve beslenme planımın performansımı doğrudan etkilediğini biliyorum. Deniz Hanım'ın hazırladığı plan antrenman günlerime göre uyarlanmış ve sonuçlar çok olumlu. Kas kütlem arttı, yağ oranım düştü.",
    categories: {
      communication: 4,
      expertise: 5,
      planQuality: 5,
      results: 4,
      availability: 3,
    },
    isPublic: true,
    dietitianResponse:
      "Teşekkürler Emre Bey! Performansınızdaki artışı görmek beni çok mutlu ediyor. Daha fazla bulunabilirlik konusunda geliştireceğim.",
    createdAt: format(subDays(now, 15), "yyyy-MM-dd"),
  },
  {
    id: "rev-004",
    patientId: "pat-001",
    patientName: "Ayşe Yılmaz",
    dietitianId: "diet-001",
    rating: 5,
    title: "Harika bir diyetisyen",
    comment:
      "3 aydır takipteyim ve 4.5 kg verdim. İnsülin direncim de iyileşme gösteriyor. Akşam atıştırma alışkanlığımı yenmemde çok yardımcı oldu. Mesajlara hızlı dönüyor, yemek kayıtlarıma detaylı yorum yapıyor.",
    categories: {
      communication: 5,
      expertise: 5,
      planQuality: 4,
      results: 5,
      availability: 5,
    },
    isPublic: true,
    dietitianResponse: null,
    createdAt: format(subDays(now, 20), "yyyy-MM-dd"),
  },
  {
    id: "rev-005",
    patientId: "pat-008",
    patientName: "Hasan Şahin",
    dietitianId: "diet-001",
    rating: 5,
    title: "Karaciğer yağlanması iyileşti",
    comment:
      "Karaciğer yağlanması grade 2'den grade 1'e düştü. Doktorum bile şaşırdı. Deniz Hanım'ın hazırladığı detoks programı çok etkili oldu. Kendimi çok daha enerjik hissediyorum.",
    categories: {
      communication: 4,
      expertise: 5,
      planQuality: 5,
      results: 5,
      availability: 4,
    },
    isPublic: true,
    dietitianResponse:
      "Hasan Bey, bu sonuçlar sizin emeğinizin karşılığı. Beslenme planına olan uyumunuz mükemmeldi. Birlikte grade 0'ı hedefliyoruz!",
    createdAt: format(subDays(now, 1), "yyyy-MM-dd"),
  },
  {
    id: "rev-006",
    patientId: "pat-004",
    patientName: "Ali Öztürk",
    dietitianId: "diet-001",
    rating: 4,
    title: "Kolesterol değerlerim düzeldi",
    comment:
      "8 aydır takipteyim. Kolesterol ilaçlarımın yanında beslenme planı çok işe yaradı. LDL değerim belirgin şekilde düştü. Sadece bazen öğünlerin tekdüze olduğunu düşünüyorum ama genel olarak çok memnunum.",
    categories: {
      communication: 4,
      expertise: 5,
      planQuality: 3,
      results: 5,
      availability: 4,
    },
    isPublic: true,
    dietitianResponse:
      "Teşekkürler Ali Bey! Çeşitlilik konusundaki geri bildiriminizi dikkate alıyorum. Planınıza yeni tarifler ekleyeceğim.",
    createdAt: format(subMonths(now, 1), "yyyy-MM-dd"),
  },
  {
    id: "rev-007",
    patientId: "pat-010",
    patientName: "Burak Aydın",
    dietitianId: "diet-001",
    rating: 4,
    title: "Kilo verme yolculuğum başladı",
    comment:
      "2 aydır diyete başladım ve 5 kg verdim. Laktoz intoleransım olmasına rağmen çok çeşitli bir plan hazırlandı. Online görüşmeler çok pratik. Daha sık görüşme yapılabilse daha iyi olurdu.",
    categories: {
      communication: 4,
      expertise: 4,
      planQuality: 4,
      results: 4,
      availability: 3,
    },
    isPublic: false,
    dietitianResponse: null,
    createdAt: format(subDays(now, 10), "yyyy-MM-dd"),
  },
];

export const reviewStats = {
  averageRating: 4.6,
  totalReviews: 7,
  ratingDistribution: {
    5: 4,
    4: 3,
    3: 0,
    2: 0,
    1: 0,
  },
  categoryAverages: {
    communication: 4.4,
    expertise: 4.9,
    planQuality: 4.4,
    results: 4.6,
    availability: 4.0,
  },
};
