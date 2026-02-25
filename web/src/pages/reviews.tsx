import { useState } from 'react'
import { Star, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { reviews as mockReviews, reviewStats as mockReviewStats } from '@/mock/reviews'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`h-4 w-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const handleReply = (reviewId: string) => {
    console.log('Replying to', reviewId, replyText)
    setReplyingTo(null)
    setReplyText('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Değerlendirmeler</h1>
        <p className="text-muted-foreground">Hastalarınızın değerlendirmeleri ve yorumları</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold">{mockReviewStats.averageRating}</div>
            <div className="flex justify-center mt-2">
              <StarRating rating={Math.round(mockReviewStats.averageRating)} />
            </div>
            <p className="text-sm text-muted-foreground mt-1">{mockReviewStats.totalReviews} değerlendirme</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardContent className="p-6 space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = mockReviewStats.ratingDistribution[rating as keyof typeof mockReviewStats.ratingDistribution]
              const percent = (count / mockReviewStats.totalReviews) * 100
              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm w-6">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <Progress value={percent} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground w-8">{count}</span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {mockReviews.map(review => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>{review.patientName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{review.patientName}</p>
                      <StarRating rating={review.rating} />
                    </div>
                    <span className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <p className="text-sm">{review.comment}</p>

                  {review.response && (
                    <div className="bg-muted/50 rounded-lg p-3 mt-3">
                      <p className="text-xs text-muted-foreground mb-1">Yanıtınız:</p>
                      <p className="text-sm">{review.response}</p>
                    </div>
                  )}

                  {!review.response && replyingTo !== review.id && (
                    <Button variant="outline" size="sm" onClick={() => setReplyingTo(review.id)}>
                      <MessageSquare className="mr-2 h-3 w-3" />
                      Yanıtla
                    </Button>
                  )}

                  {replyingTo === review.id && (
                    <div className="space-y-2 mt-2">
                      <Textarea
                        placeholder="Yanıtınızı yazın..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleReply(review.id)} disabled={!replyText.trim()}>Gönder</Button>
                        <Button variant="outline" size="sm" onClick={() => { setReplyingTo(null); setReplyText('') }}>İptal</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
