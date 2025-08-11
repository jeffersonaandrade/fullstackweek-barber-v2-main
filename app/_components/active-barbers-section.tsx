import { Card, CardContent, CardHeader, CardTitle } from '@/app/_components/ui/card'
import { Scissors, Users } from 'lucide-react'
import { BarberCard } from './barber-card'

interface ActiveBarber {
  id: string
  users: {
    id: string
    name: string
    avatar_url: string | null
  }
  rating?: number
  reviews_count?: number
  specialties?: string[]
  avg_service_time?: number
  clients_today?: number
}

interface ActiveBarbersSectionProps {
  barbers: ActiveBarber[]
  selectedBarberId?: string
  onSelectBarber?: (barberId: string) => void
}

export function ActiveBarbersSection({ 
  barbers, 
  selectedBarberId, 
  onSelectBarber 
}: ActiveBarbersSectionProps) {
  if (barbers.length === 0) {
    return null
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="h-5 w-5" />
          Barbeiros Ativos
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Escolha um barbeiro específico ou use a fila geral
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {barbers.map((barber) => (
            <BarberCard
              key={barber.id}
              barber={{
                id: barber.id,
                name: barber.users.name,
                avatar_url: barber.users.avatar_url,
                rating: barber.rating,
                reviews_count: barber.reviews_count,
                specialties: barber.specialties,
                avg_service_time: barber.avg_service_time,
                clients_today: barber.clients_today
              }}
              onSelectBarber={onSelectBarber}
              isSelected={selectedBarberId === barber.id}
            />
          ))}
        </div>
        
        {barbers.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {barbers.length} barbeiro{barbers.length > 1 ? 's' : ''} disponível{barbers.length > 1 ? 's' : ''} para atendimento
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
