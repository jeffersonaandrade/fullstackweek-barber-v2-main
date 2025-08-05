import BarbershopItem from "../_components/barbershop-item"
import Header from "../_components/header"
import Search from "../_components/search"
import { supabaseAdmin } from "../_lib/supabase"

interface BarbershopsPageProps {
  searchParams: {
    title?: string
    service?: string
  }
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
  let query = supabaseAdmin
    .from('barbershops')
    .select('*')
    .eq('is_active', true)

  // Aplicar filtros de busca
  if (searchParams?.title) {
    query = query.ilike('name', `%${searchParams.title}%`)
  }

  if (searchParams?.service) {
    // Para buscar por serviço, precisamos fazer uma busca mais complexa
    // Por enquanto, vamos buscar por nome da barbearia que contenha o serviço
    query = query.ilike('name', `%${searchParams.service}%`)
  }

  const { data: barbershops, error } = await query

  if (error) {
    console.error('Erro ao buscar barbearias:', error)
  }

  return (
    <div>
      <Header />
      <div className="my-6 px-5">
        <Search />
      </div>
      <div className="px-5">
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Resultados para &quot;{searchParams?.title || searchParams?.service}
          &quot;
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {barbershops?.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BarbershopsPage
