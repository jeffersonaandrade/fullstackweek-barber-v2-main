import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/_lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const barbershopId = searchParams.get('barbershopId')

    if (!barbershopId) {
      return NextResponse.json(
        { error: 'ID da barbearia é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar filas ativas da barbearia
    const { data: queues, error } = await supabaseAdmin
      .from('queues')
      .select(`
        *,
        barbershops!inner (
          id,
          name,
          address,
          phones,
          description,
          image_url,
          is_active
        )
      `)
      .eq('barbershop_id', barbershopId)
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Erro ao buscar filas:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar filas' },
        { status: 500 }
      )
    }

    return NextResponse.json({ queues })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { barbershopId, name, description, queueType, maxCapacity } = body

    if (!barbershopId || !name) {
      return NextResponse.json(
        { error: 'ID da barbearia e nome são obrigatórios' },
        { status: 400 }
      )
    }

    // Criar nova fila
    const { data: queue, error } = await supabaseAdmin
      .from('queues')
      .insert({
        barbershop_id: barbershopId,
        name,
        description,
        queue_type: queueType || 'general',
        max_capacity: maxCapacity,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar fila:', error)
      return NextResponse.json(
        { error: 'Erro ao criar fila' },
        { status: 500 }
      )
    }

    return NextResponse.json({ queue }, { status: 201 })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 