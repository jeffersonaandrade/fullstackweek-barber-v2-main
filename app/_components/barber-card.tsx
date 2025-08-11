import { Card, CardContent, CardHeader, CardTitle } from '@/app/_components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/_components/ui/avatar'
import { Badge } from '@/app/_components/ui/badge'
import { Button } from '@/app/_components/ui/button'
import { Star, Clock, Users } from 'lucide-react'

interface BarberCardProps {
  barber: {
    id: string
    name: string
    avatar_url: string | null
    rating?: number // Média das avaliações
    reviews_count?: number // Número de avaliações
    specialties?: string[] // Ex: ['Corte', 'Barba']
    avg_service_time?: number // Tempo médio por atendimento em minutos
    clients_today?: number // Número de clientes atendidos hoje
  }
  onSelectBarber?: (barberId: string) => void
  isSelected?: boolean
}

export function BarberCard({ barber, onSelectBarber, isSelected = false }: BarberCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : i < rating 
            ? 'fill-yellow-400/50 text-yellow-400/50' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <Card className={`flex flex-col items-center text-center p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${
      isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/20'
    }`}>
      <Avatar className="h-24 w-24 mb-4 border-2 border-primary/20">
        <AvatarImage src={barber.avatar_url || undefined} alt={barber.name} />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
          {getInitials(barber.name)}
        </AvatarFallback>
      </Avatar>
      
      <CardHeader className="p-0 mb-2">
        <CardTitle className="text-lg font-semibold">{barber.name}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 w-full space-y-3">
        {/* Avaliação */}
        {barber.rating !== undefined && barber.reviews_count !== undefined && (
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              {renderStars(barber.rating)}
            </div>
            <p className="text-sm text-muted-foreground">
              {barber.rating.toFixed(1)} ({barber.reviews_count} avaliações)
            </p>
          </div>
        )}

        {/* Especialidades */}
        {barber.specialties && barber.specialties.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1">
            {barber.specialties.slice(0, 3).map((spec, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
            {barber.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{barber.specialties.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Estatísticas */}
        <div className="text-sm text-muted-foreground space-y-1">
          {barber.avg_service_time && (
            <div className="flex items-center justify-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{barber.avg_service_time} min/serviço</span>
            </div>
          )}
          {barber.clients_today !== undefined && (
            <div className="flex items-center justify-center gap-1">
              <Users className="h-3 w-3" />
              <span>{barber.clients_today} clientes hoje</span>
            </div>
          )}
        </div>

        {/* Status de disponibilidade */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-600 font-medium">Disponível</span>
        </div>

        {/* Informação adicional */}
        <div className="mt-2 text-xs text-muted-foreground">
          Clique na fila específica abaixo
        </div>
      </CardContent>
    </Card>
  )
}
