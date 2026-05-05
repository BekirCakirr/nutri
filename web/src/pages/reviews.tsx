import { useState, useEffect } from 'react'
import {
  Star,
  MessageSquare,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/shared/page-container'
import { ListPageSkeleton } from '@/components/shared/page-skeletons'
import { cn } from '@/lib/utils'
import { useReviews } from '@/hooks/use-reviews'
import { useAuthStore } from '@/stores/auth-store'
import type { Review } from '@/types/review'

type ExtendedReview = Review & {
  rating?: number;
  dietitianResponse?: string;
  patientName: string;
  patientAvatar?: string;
}

const mockReviews: ExtendedReview[] = [
  {
    id: 'mock-r1', reviewerId: 'p1', reviewerName: 'Ayşe Yılmaz', targetType: 'dietitian', targetId: 'd1', status: 'approved',
    overallRating: 5, rating: 5, title: 'Harika bir deneyim', comment: 'Diyetisyenim beni çok iyi anlıyor, kişiye özel plan hazırladı. İlk ayda 4 kilo verdim. Kesinlikle tavsiye ederim!',
    helpfulCount: 12, unhelpfulCount: 0, isVerified: true, isAnonymous: false,
    patientName: 'Ayşe Yılmaz', patientAvatar: 'https://i.pravatar.cc/80?img=5', createdAt: '2026-04-10T10:00:00Z', updatedAt: '2026-04-10T10:00:00Z',
    dietitianResponse: 'Teşekkür ederim Ayşe Hanım, başarılarınız devam edecek!',
  },
  {
    id: 'mock-r2', reviewerId: 'p2', reviewerName: 'Mehmet Kaya', targetType: 'dietitian', targetId: 'd1', status: 'approved',
    overallRating: 4, rating: 4, title: 'Memnunum', comment: 'Planlar gerçekçi ve uygulanabilir. Sadece randevu saatleri biraz daha esnek olabilir. Genel olarak çok memnunum.',
    helpfulCount: 8, unhelpfulCount: 1, isVerified: true, isAnonymous: false,
    patientName: 'Mehmet Kaya', patientAvatar: 'https://i.pravatar.cc/80?img=12', createdAt: '2026-04-08T14:30:00Z', updatedAt: '2026-04-08T14:30:00Z',
  },
  {
    id: 'mock-r3', reviewerId: 'p3', reviewerName: 'Fatma Demir', targetType: 'dietitian', targetId: 'd1', status: 'approved',
    overallRating: 5, rating: 5, title: 'Çok profesyonel', comment: 'Her görüşmede detaylı bilgi veriyor, sorularıma sabırla cevap veriyor. Kan değerlerim düzeldi, enerji seviyem arttı.',
    helpfulCount: 15, unhelpfulCount: 0, isVerified: true, isAnonymous: false,
    patientName: 'Fatma Demir', patientAvatar: 'https://i.pravatar.cc/80?img=9', createdAt: '2026-04-05T09:15:00Z', updatedAt: '2026-04-05T09:15:00Z',
    dietitianResponse: 'Fatma Hanım, sağlık değerlerinizdeki iyileşme beni çok mutlu etti. Devam edelim!',
  },
  {
    id: 'mock-r4', reviewerId: 'p4', reviewerName: 'Zeynep Çelik', targetType: 'dietitian', targetId: 'd1', status: 'approved',
    overallRating: 3, rating: 3, title: 'İdare eder', comment: 'Beslenme planı fena değil ama biraz daha çeşitlilik olabilirdi. Aynı yemekler tekrar ediyor.',
    helpfulCount: 5, unhelpfulCount: 2, isVerified: true, isAnonymous: false,
    patientName: 'Zeynep Çelik', patientAvatar: 'https://i.pravatar.cc/80?img=16', createdAt: '2026-04-02T16:45:00Z', updatedAt: '2026-04-02T16:45:00Z',
  },
  {
    id: 'mock-r5', reviewerId: 'p5', reviewerName: 'Ali Öztürk', targetType: 'dietitian', targetId: 'd1', status: 'approved',
    overallRating: 5, rating: 5, title: 'Sonuçlar muhteşem', comment: 'Spor ve beslenmeyi birlikte planlıyoruz. 3 ayda hedef kilomu yakaladım. Kas kütlem arttı, yağ oranım düştü.',
    helpfulCount: 20, unhelpfulCount: 0, isVerified: true, isAnonymous: false,
    patientName: 'Ali Öztürk', patientAvatar: 'https://i.pravatar.cc/80?img=14', createdAt: '2026-03-28T11:00:00Z', updatedAt: '2026-03-28T11:00:00Z',
  },
  {
    id: 'mock-r6', reviewerId: 'p6', reviewerName: 'Selin Aydın', targetType: 'dietitian', targetId: 'd1', status: 'approved',
    overallRating: 4, rating: 4, title: 'İyi takip', comment: 'Uygulama üzerinden takip çok pratik. Öğün fotoğraflarına hızlı geri dönüş yapıyor. Tek eksik video görüşme seçeneği.',
    helpfulCount: 7, unhelpfulCount: 0, isVerified: true, isAnonymous: false,
    patientName: 'Selin Aydın', patientAvatar: 'https://i.pravatar.cc/80?img=23', createdAt: '2026-03-25T08:30:00Z', updatedAt: '2026-03-25T08:30:00Z',
  },
  {
    id: 'mock-r7', reviewerId: 'p7', reviewerName: 'Hakan Yıldız', targetType: 'dietitian', targetId: 'd1', status: 'approved',
    overallRating: 4, rating: 4, title: 'Güvenilir ve bilgili', comment: 'Diyabet hastası olarak özel planıma çok dikkat ediyor. Şeker değerlerim kontrol altında. Teşekkürler.',
    helpfulCount: 10, unhelpfulCount: 1, isVerified: true, isAnonymous: false,
    patientName: 'Hakan Yıldız', patientAvatar: 'https://i.pravatar.cc/80?img=15', createdAt: '2026-03-20T13:00:00Z', updatedAt: '2026-03-20T13:00:00Z',
    dietitianResponse: 'Hakan Bey, düzenli takibiniz sayesinde harika ilerliyorsunuz.',
  },
  {
    id: 'mock-r8', reviewerId: 'p8', reviewerName: 'Elif Arslan', targetType: 'dietitian', targetId: 'd1', status: 'approved',
    overallRating: 3, rating: 3, title: 'Fena değil ama gelişebilir', comment: 'Genel yaklaşım iyi fakat hafta sonu programları biraz zor oluyor. Sosyal hayata uygun alternatifler sunulabilir.',
    helpfulCount: 4, unhelpfulCount: 3, isVerified: true, isAnonymous: false,
    patientName: 'Elif Arslan', patientAvatar: 'https://i.pravatar.cc/80?img=1', createdAt: '2026-03-15T17:20:00Z', updatedAt: '2026-03-15T17:20:00Z',
  },
]

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'md' ? 'h-5 w-5' : 'h-3.5 w-3.5'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={cn(
            sizeClass,
            'transition-colors',
            i <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'text-muted-foreground/30'
          )}
        />
      ))}
    </div>
  )
}

function getRatingBadge(rating: number) {
  if (rating === 5) return { label: 'Mukemmel', variant: 'success' as const }
  if (rating === 4) return { label: 'Iyi', variant: 'info' as const }
  if (rating === 3) return { label: 'Orta', variant: 'warning' as const }
  return { label: 'Dusuk', variant: 'destructive' as const }
}

export default function ReviewsPage() {
  const { reviews: fetchedReviews, averageRating: apiAverageRating, fetchReviews, respondToReview, isLoading } = useReviews()
  const user = useAuthStore(s => s.user)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    // Backend requires UUID; only call when we have an authenticated dietitian id
    fetchReviews(user?.id)
  }, [user?.id, fetchReviews])

  const handleReply = (reviewId: string) => {
    respondToReview(reviewId, replyText)
    setReplyingTo(null)
    setReplyText('')
  }

  // Use mock data as fallback when API returns empty
  const safeFetched = Array.isArray(fetchedReviews) ? fetchedReviews : []
  const usingMockData = safeFetched.length === 0
  const reviews = usingMockData ? (mockReviews as unknown as Review[]) : safeFetched
  const averageRating = usingMockData ? 4.1 : apiAverageRating

  // Derive stats from real data
  const totalReviews = reviews.length
  const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  reviews.forEach(raw => {
    const r = raw as unknown as ExtendedReview;
    const rating = r.rating ?? r.overallRating ?? 0;
    if (rating >= 1 && rating <= 5) ratingDistribution[rating]++
  })

  if (isLoading) return <ListPageSkeleton />

  return (
    <PageContainer
      title="Degerlendirmeler"
      description="Hastalarınızın degerlendirmeleri ve yorumları"
      actions={usingMockData ? (
        <Badge variant="warning" className="text-[11px]">Demo Veri</Badge>
      ) : undefined}
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-in-stagger">
        {/* Featured average rating card */}
        <Card className="py-0 gap-0">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Ortalama Puan
            </p>
            <p className="text-4xl font-bold tabular-nums">{averageRating}</p>
            <div className="mt-2">
              <StarRating rating={Math.round(averageRating)} size="md" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {totalReviews} degerlendirme
            </p>
          </CardContent>
        </Card>

        {/* Rating distribution */}
        <Card className="md:col-span-2 py-0 gap-0">
          <CardContent className="p-6 space-y-2.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
              Puan Dagılımı
            </p>
            {[5, 4, 3, 2, 1].map(rating => {
              const count = ratingDistribution[rating]
              const percent = totalReviews > 0
                ? (count / totalReviews) * 100
                : 0
              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-8 shrink-0">
                    <span className="text-sm font-medium tabular-nums">{rating}</span>
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  </div>
                  <Progress value={percent} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground w-8 text-right tabular-nums">
                    {count}
                  </span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Category averages */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6 animate-in-stagger">
        {[
          { key: 'communication', label: 'Iletisim' },
          { key: 'expertise', label: 'Uzmanlık' },
          { key: 'planQuality', label: 'Plan Kalitesi' },
          { key: 'results', label: 'Sonuclar' },
          { key: 'availability', label: 'Ulasılabilirlik' },
        ].map(({ key, label }) => (
          <Card key={key} className="py-0 gap-0">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="text-lg font-bold tabular-nums">
                {averageRating}
              </p>
              <StarRating
                rating={Math.round(
                  averageRating
                )}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reviews */}
      <div className="space-y-4 animate-in-stagger">
        {reviews.map(rawReview => {
          const review = rawReview as unknown as ExtendedReview;
          const ratingBadge = getRatingBadge(review.rating ?? review.overallRating ?? 0)
          const responseText = review.dietitianResponse || review.response?.content;
          return (
            <Card key={review.id} className="py-0 gap-0 transition-all duration-[var(--duration-fast)] hover:shadow-md">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 shrink-0">
                    {review.patientAvatar && <AvatarImage src={review.patientAvatar} alt={review.patientName} />}
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {(review.patientName ?? '').split(' ').map(n => n[0]).join('') || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{review.patientName}</p>
                          <Badge variant={ratingBadge.variant} className="text-[10px]">
                            {ratingBadge.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarRating rating={review.rating ?? review.overallRating ?? 0} />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>

                    {/* Title & Comment */}
                    {review.title && (
                      <p className="text-sm font-semibold">{review.title}</p>
                    )}
                    <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>

                    {/* Response */}
                    {responseText && (
                      <div className="rounded-lg border border-primary/10 bg-primary/5 p-3 mt-3">
                        <p className="text-xs font-medium text-primary mb-1">
                          <MessageSquare className="inline h-3 w-3 mr-1" />
                          Yanıtınız
                        </p>
                        <p className="text-sm text-muted-foreground">{responseText}</p>
                      </div>
                    )}

                    {/* Reply button */}
                    {!responseText && replyingTo !== review.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReplyingTo(review.id)}
                        className="mt-1"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        Yanıtla
                      </Button>
                    )}

                    {/* Reply form */}
                    {replyingTo === review.id && (
                      <div className="space-y-2 mt-2 animate-fade-up">
                        <Textarea
                          placeholder="Yanıtınızı yazın..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleReply(review.id)}
                            disabled={!replyText.trim()}
                          >
                            Gonder
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setReplyingTo(null); setReplyText('') }}
                          >
                            Iptal
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </PageContainer>
  )
}
