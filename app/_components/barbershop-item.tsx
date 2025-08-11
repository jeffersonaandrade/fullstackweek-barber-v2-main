import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { StarIcon, Building2, Users } from "lucide-react"
import Link from "next/link"
import { Barbershop } from "../_lib/database.types"

interface BarbershopItemProps {
  barbershop: Barbershop
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  return (
    <Card className="h-full rounded-2xl transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-0 px-1 pt-1">
        {/* IMAGEM */}
        <div className="relative h-[159px] w-full lg:h-[180px] xl:h-[200px]">
          {barbershop.image_url ? (
            <Image
              alt={barbershop.name}
              fill
              className="rounded-2xl object-cover"
              src={barbershop.image_url}
              onError={(e) => {
                // Fallback para imagem quebrada
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          
          {/* Placeholder quando não há imagem */}
          <div className={`absolute inset-0 bg-muted rounded-2xl flex items-center justify-center ${barbershop.image_url ? 'hidden' : ''}`}>
            <Building2 className="h-12 w-12 text-muted-foreground" />
          </div>

          <Badge
            className="absolute left-2 top-2 space-x-1"
            variant="secondary"
          >
            <StarIcon size={12} className="fill-primary text-primary" />
            <p className="text-xs font-semibold">5,0</p>
          </Badge>
        </div>

        {/* TEXTO */}
        <div className="px-1 py-3 flex flex-col h-full">
          <div className="flex-1">
            <h3 className="truncate font-semibold text-sm lg:text-base">{barbershop.name}</h3>
            <p className="truncate text-sm text-gray-400">{barbershop.address}</p>
          </div>
          
          {/* BOTÕES */}
          <div className="mt-3 space-y-2">
            <Button variant="secondary" className="w-full text-xs lg:text-sm" asChild>
              <Link href={`/barbershops/${barbershop.id}`}>Reservar</Link>
            </Button>
            <Button variant="outline" className="w-full text-xs lg:text-sm" asChild>
              <Link href={`/barbershops/${barbershop.id}/queues`}>
                <Users className="h-4 w-4 mr-2" />
                Ver Fila
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BarbershopItem
