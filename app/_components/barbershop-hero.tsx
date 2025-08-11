import { Card, CardContent, CardHeader, CardTitle } from '@/app/_components/ui/card'
import { Badge } from '@/app/_components/ui/badge'
import { MapPin, Phone, Clock, Star } from 'lucide-react'
import Image from 'next/image'

interface BarbershopHeroProps {
  barbershop: {
    id: string
    name: string
    address: string | null
    phones: string | null
    image_url?: string | null
    description?: string | null
  }
  activeBarbersCount: number
}

export function BarbershopHero({ barbershop, activeBarbersCount }: BarbershopHeroProps) {
  return (
    <div className="mb-8">
      {/* Hero Section com imagem de fundo */}
      <div className="relative h-48 md:h-64 w-full rounded-xl overflow-hidden mb-6">
        {barbershop.image_url ? (
          <Image
            src={barbershop.image_url}
            alt={barbershop.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-3xl font-bold">{barbershop.name}</h1>
            </div>
          </div>
        )}
        
        {/* Overlay com informações */}
        <div className="absolute inset-0 bg-black/30 flex items-end">
          <div className="p-6 w-full">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {barbershop.name}
            </h1>
            <div className="flex items-center gap-4 text-white/90 text-sm">
              {barbershop.address && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{barbershop.address}</span>
                </div>
              )}
              {barbershop.phones && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{barbershop.phones}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status da barbearia */}
      <Card className="mb-6 border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-700">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Barbearia Aberta
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-green-700">
                {activeBarbersCount} barbeiro{activeBarbersCount > 1 ? 's' : ''} ativo{activeBarbersCount > 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-1 text-green-700">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm">4.8 (127 avaliações)</span>
              </div>
            </div>
            <Badge variant="outline" className="border-green-300 text-green-700">
              Disponível para filas
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Descrição da barbearia */}
      {barbershop.description && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Sobre nós</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {barbershop.description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
