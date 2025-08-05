import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/_lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const barbershopId = params.id

    // Buscar barbeiros ativos na barbearia específica
    const { data: activeBarbers, error } = await supabaseAdmin
      .from('barber_status')
      .select(`
        id,
        barber_id,
        users!barber_status_barber_id_fkey (
          id,
          name,
          image_url
        )
      `)
      .eq('barbershop_id', barbershopId)
      .eq('is_active', true)

    if (error) {
      console.error('Erro ao buscar barbeiros ativos:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar barbeiros ativos' },
        { status: 500 }
      )
    }

    // Mapear os dados para o formato esperado pela interface
    const mappedBarbers = activeBarbers?.map(barber => ({
      id: barber.id,
      users: {
        id: barber.users?.id || barber.barber_id,
        name: barber.users?.name || 'Barbeiro',
        avatar_url: barber.users?.image_url || null
      }
    })) || []

    return NextResponse.json({
      barbers: mappedBarbers
    })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 