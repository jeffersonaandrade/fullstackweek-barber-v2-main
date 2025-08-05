import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/_lib/auth'
import { supabaseAdmin } from '@/app/_lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const barbershopId = searchParams.get('barbershopId')

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'barber') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas barbeiros podem acessar esta rota.' },
        { status: 403 }
      )
    }

    if (!barbershopId) {
      return NextResponse.json(
        { error: 'ID da barbearia é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o barbeiro está ativo nesta barbearia
    const { data: barberStatus, error: statusError } = await supabaseAdmin
      .from('barber_status')
      .select('*')
      .eq('barber_id', session.user.id)
      .eq('barbershop_id', barbershopId)
      .eq('is_active', true)
      .single()

    if (statusError || !barberStatus) {
      return NextResponse.json(
        { error: 'Barbeiro não está ativo nesta barbearia' },
        { status: 403 }
      )
    }

    // Buscar dados da barbearia
    const { data: barbershop, error: barbershopError } = await supabaseAdmin
      .from('barbershops')
      .select('id, name, address')
      .eq('id', barbershopId)
      .single()

    if (barbershopError || !barbershop) {
      return NextResponse.json(
        { error: 'Barbearia não encontrada' },
        { status: 404 }
      )
    }

    // Buscar fila da barbearia
    const { data: queue, error: queueError } = await supabaseAdmin
      .from('queues')
      .select('id')
      .eq('barbershop_id', barbershopId)
      .eq('queue_type', 'general')
      .single()

    if (queueError || !queue) {
      return NextResponse.json(
        { error: 'Fila não encontrada para esta barbearia' },
        { status: 404 }
      )
    }

    // Buscar todas as entradas da fila
    const { data: queueEntries, error: entriesError } = await supabaseAdmin
      .from('queue_entries')
      .select(`
        id,
        position,
        status,
        estimated_time,
        joined_at,
        customer_name,
        customer_phone,
        is_guest,
        user_id
      `)
      .eq('queue_id', queue.id)
      .in('status', ['waiting', 'called', 'in_service'])
      .order('position', { ascending: true })

    if (entriesError) {
      console.error('Erro ao buscar entradas da fila:', entriesError)
      return NextResponse.json(
        { error: 'Erro ao buscar dados da fila' },
        { status: 500 }
      )
    }

    // Buscar barbeiros ativos na barbearia
    const { data: activeBarbers, error: barbersError } = await supabaseAdmin
      .from('barber_status')
      .select('id')
      .eq('barbershop_id', barbershopId)
      .eq('is_active', true)

    if (barbersError) {
      console.error('Erro ao buscar barbeiros ativos:', barbersError)
    }

    // Calcular estatísticas
    const waitingEntries = queueEntries?.filter(entry => entry.status === 'waiting') || []
    const totalWaiting = waitingEntries.length
    const estimatedWaitTime = totalWaiting * 15 // 15 minutos por pessoa
    const activeBarbersCount = activeBarbers?.length || 0

    const statistics = {
      totalWaiting,
      estimatedWaitTime,
      activeBarbers: activeBarbersCount
    }

    return NextResponse.json({
      queueEntries: queueEntries || [],
      barbershop,
      statistics
    })

  } catch (error) {
    console.error('Erro na API de fila do barbeiro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 