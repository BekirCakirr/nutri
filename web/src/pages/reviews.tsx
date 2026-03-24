import { useState, useEffect } from 'react'
import {
  Star,
  MessageSquare,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/shared/page-container'
import { ListPageSkeleton } from '@/components/shared/page-skeletons'
import { cn } from '@/lib/utils'
import { useReviews } from '@/hooks/use-reviews'

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
  const { reviews: fetchedReviews, averageRating, fetchReviews, respondToReview } = useReviews()
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => { fetchReviews(); const t = setTimeout(() => setIsLoading(false), 400); return () => clearTimeout(t) }, [])

  const handleReply = (reviewId: string) => {
    respondToReview(reviewId, replyText)
    setReplyingTo(null)
    setReplyText('')
  }

  // Derive stats from real data
  const totalReviews = fetchedReviews.length
  const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  fetchedReviews.forEach(r => {
    const rating = (r as any).rating ?? 0
    if (rating >= 1 && rating <= 5) ratingDistribution[rating]++
  })

  if (isLoading) return <ListPageSkeleton />

  return (
    <PageContainer
      title="Degerlendirmeler"
      description="Hastalarınızın degerlendirmeleri ve yorumları"
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
        {fetchedReviews.map(review => {
          const ratingBadge = getRatingBadge(review.rating)
          return (
            <Card key={review.id} className="py-0 gap-0 transition-all duration-[var(--duration-fast)] hover:shadow-md">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {review.patientName.split(' ').map(n => n[0]).join('')}
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
                          <StarRating rating={review.rating} />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>

                    {/* Title & Comment */}
                    {(review as any).title && (
                      <p className="text-sm font-semibold">{(review as any).title}</p>
                    )}
                    <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>

                    {/* Response */}
                    {((review as any).dietitianResponse || review.response) && (
                      <div className="rounded-lg border border-primary/10 bg-primary/5 p-3 mt-3">
                        <p className="text-xs font-medium text-primary mb-1">
                          <MessageSquare className="inline h-3 w-3 mr-1" />
                          Yanıtınız
                        </p>
                        <p className="text-sm text-muted-foreground">{(review as any).dietitianResponse || review.response}</p>
                      </div>
                    )}

                    {/* Reply button */}
                    {!((review as any).dietitianResponse || review.response) && replyingTo !== review.id && (
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
