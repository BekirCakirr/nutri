import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarRating } from "./star-rating";

interface ReviewCardProps {
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  avatarUrl?: string;
}

export function ReviewCard({
  patientName,
  rating,
  comment,
  date,
  avatarUrl,
}: ReviewCardProps) {
  const initials = patientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {avatarUrl && <img src={avatarUrl} alt={patientName} className="object-cover" />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-sm">{patientName}</p>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
          <StarRating rating={rating} />
        </div>
        <p className="text-sm text-muted-foreground">{comment}</p>
      </CardContent>
    </Card>
  );
}
