import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/_lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const barberId = params.id

    // Buscar avaliações do barbeiro
    const { data: reviews, error: reviewsError } = await supabaseAdmin
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        created_at,
        users!reviews_user_id_fkey (
          name
        )
      `)
      .eq('barber_id', barberId)
      .order('created_at', { ascending: false })

    if (reviewsError) {
      console.error('Erro ao buscar avaliações:', reviewsError)
      return NextResponse.json({ error: 'Erro ao buscar avaliações' }, { status: 500 })
    }

    // Calcular média das avaliações
    const totalRating = reviews?.reduce((sum, review) => sum + review.rating, 0) || 0
    const averageRating = reviews && reviews.length > 0 ? totalRating / reviews.length : 0

    // Buscar estatísticas do barbeiro
    const { data: stats, error: statsError } = await supabaseAdmin
      .from('queue_entries')
      .select('*')
      .eq('selected_barber_id', barberId)
      .gte('created_at', new Date().toISOString().split('T')[0]) // Hoje

    if (statsError) {
      console.error('Erro ao buscar estatísticas:', statsError)
    }

    const clientsToday = stats?.length || 0

    // Buscar especialidades (baseado nos serviços mais realizados)
    const { data: services, error: servicesError } = await supabaseAdmin
      .from('queue_entries')
      .select(`
        selected_service_id,
        barbershop_services!queue_entries_selected_service_id_fkey (
          name,
          category
        )
      `)
      .eq('selected_barber_id', barberId)
      .not('selected_service_id', 'is', null)

    if (servicesError) {
      console.error('Erro ao buscar serviços:', servicesError)
    }

    // Calcular especialidades mais comuns
    const serviceCounts: { [key: string]: number } = {}
    services?.forEach(entry => {
      if (entry.barbershop_services) {
        const category = entry.barbershop_services.category
        serviceCounts[category] = (serviceCounts[category] || 0) + 1
      }
    })

    const specialties = Object.entries(serviceCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category)

    return NextResponse.json({
      reviews: reviews || [],
      averageRating: Math.round(averageRating * 10) / 10, // Arredondar para 1 casa decimal
      totalReviews: reviews?.length || 0,
      clientsToday,
      specialties: specialties.length > 0 ? specialties : ['Corte', 'Barba'], // Fallback
      avgServiceTime: 25 // Valor padrão, pode ser calculado baseado em dados reais
    })
  } catch (error) {
    console.error('Erro na API de avaliações:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
