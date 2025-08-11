import { Star } from 'lucide-react'

interface RatingStarsProps {
  rating: number
  reviewsCount?: number
}

export function RatingStars({ rating, reviewsCount }: RatingStarsProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
      ))}
      {hasHalfStar && (
        <Star key="half" className="h-4 w-4 text-yellow-400 fill-yellow-400 opacity-50" />
      )}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      ))}
      {reviewsCount !== undefined && (
        <span className="ml-2 text-sm text-muted-foreground">({reviewsCount})</span>
      )}
    </div>
  )
}
