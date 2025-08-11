import Header from "./_components/header"
import { Button } from "./_components/ui/button"
import Image from "next/image"
import { supabaseAdmin } from "./_lib/supabase"
import BarbershopItem from "./_components/barbershop-item"
import { quickSearchOptions } from "./_constants/search"
import BookingItem from "./_components/booking-item"
import Search from "./_components/search"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "./_lib/auth"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getConfirmedBookings } from "./_data/get-confirmed-bookings"
import WelcomeSection from "./_components/welcome-section"

const Home = async () => {
  const session = await getServerSession(authOptions)
  
  // Buscar barbearias
  const { data: barbershops, error: barbershopsError } = await supabaseAdmin
    .from('barbershops')
    .select('*')
    .eq('is_active', true)
  
  if (barbershopsError) {
    console.error('Erro ao buscar barbearias:', barbershopsError)
  }
  
  // Buscar barbearias populares (ordenadas por nome)
  const { data: popularBarbershops, error: popularError } = await supabaseAdmin
    .from('barbershops')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: false })
  
  if (popularError) {
    console.error('Erro ao buscar barbearias populares:', popularError)
  }
  
  const confirmedBookings = await getConfirmedBookings()

  return (
    <div className="min-h-screen bg-background">
      {/* header */}
      <Header />
      
      {/* Container principal responsivo */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {/* SEÇÃO DE BOAS-VINDAS (Client Component) */}
          <WelcomeSection />

          {/* BUSCA */}
          <div className="mt-6">
            <Search />
          </div>

          {/* BUSCA RÁPIDA */}
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden lg:flex-wrap lg:overflow-visible">
            {quickSearchOptions.map((option) => (
              <Button
                className="gap-2 flex-shrink-0 lg:flex-shrink"
                variant="secondary"
                key={option.title}
                asChild
              >
                <Link href={`/barbershops?service=${option.title}`}>
                  <Image
                    src={option.imageUrl}
                    width={16}
                    height={16}
                    alt={option.title}
                  />
                  {option.title}
                </Link>
              </Button>
            ))}
          </div>

          {/* IMAGEM */}
          <div className="relative mt-6 h-[150px] w-full lg:h-[200px] xl:h-[250px]">
            <Image
              alt="Agende nos melhores com FSW Barber"
              src="/banner-01.png"
              fill
              className="rounded-xl object-cover"
            />
          </div>

          {confirmedBookings.length > 0 && (
            <>
              <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
                Agendamentos
              </h2>

              {/* AGENDAMENTO */}
              <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4 lg:overflow-visible">
                {confirmedBookings.map((booking) => (
                  <BookingItem
                    key={booking.id}
                    booking={JSON.parse(JSON.stringify(booking))}
                  />
                ))}
              </div>
            </>
          )}

          <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
            Recomendados
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {barbershops?.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </div>

          <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
            Populares
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {popularBarbershops?.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
