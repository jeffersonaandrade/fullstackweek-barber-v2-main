import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/_lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/_lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const queueId = params.id
    const { searchParams } = new URL(request.url)
    const customerPhone = searchParams.get('phone')



    if (!queueId) {
      return NextResponse.json(
        { error: 'ID da fila é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a fila existe
    const { data: queue, error: queueError } = await supabaseAdmin
      .from('queues')
      .select(`
        *,
        barbershops (
          id,
          name,
          address,
          phones
        )
      `)
      .eq('id', queueId)
      .single()

    if (queueError || !queue) {
      return NextResponse.json(
        { error: 'Fila não encontrada' },
        { status: 404 }
      )
    }

    // Buscar estatísticas da fila
    const { data: waitingEntries, error: waitingError } = await supabaseAdmin
      .from('queue_entries')
      .select('id, position, estimated_time, joined_at')
      .eq('queue_id', queueId)
      .eq('status', 'waiting')
      .order('position', { ascending: true })

    if (waitingError) {
      console.error('Erro ao buscar entradas da fila:', waitingError)
      return NextResponse.json(
        { error: 'Erro ao buscar status da fila' },
        { status: 500 }
      )
    }



    // Buscar entrada do cliente atual (se logado ou por telefone)
    let clientEntry = null
    if (session?.user?.id) {
      // Buscar todas as entradas do usuário e pegar a mais recente
      const { data: userEntries, error: userEntryError } = await supabaseAdmin
        .from('queue_entries')
        .select('*')
        .eq('queue_id', queueId)
        .eq('user_id', session.user.id)
        .eq('status', 'waiting')
        .order('created_at', { ascending: false })
        .limit(1)
      
      
      
      clientEntry = userEntries?.[0] || null
    } else if (customerPhone) {
      // Buscar todas as entradas por telefone e pegar a mais recente
      const { data: phoneEntries, error: phoneEntryError } = await supabaseAdmin
        .from('queue_entries')
        .select('*')
        .eq('queue_id', queueId)
        .eq('customer_phone', customerPhone)
        .eq('status', 'waiting')
        .order('created_at', { ascending: false })
        .limit(1)
      
      
      
      clientEntry = phoneEntries?.[0] || null
    }



    // Calcular estatísticas
    const totalWaiting = waitingEntries?.length || 0
    const estimatedWaitTime = totalWaiting * 15 // 15 minutos por pessoa

    // Buscar barbeiros ativos
    const { data: activeBarbers } = await supabaseAdmin
      .from('barber_status')
      .select(`
        *,
        users!barber_status_barber_id_fkey (
          id,
          name,
          avatar_url
        )
      `)
      .eq('barbershop_id', queue.barbershop_id)
      .eq('is_active', true)

    return NextResponse.json({
      queue,
      statistics: {
        totalWaiting,
        estimatedWaitTime,
        activeBarbers: activeBarbers?.length || 0
      },
      clientEntry,
      waitingEntries: waitingEntries?.slice(0, 10) || [], // Primeiras 10 posições
      activeBarbers: activeBarbers || []
    })

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 