import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/_lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/_lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const queueId = params.id
    const body = await request.json()
    const { selectedBarberId, customerName, customerPhone, isGuest, parentPhone } = body

    if (!queueId) {
      return NextResponse.json(
        { error: 'ID da fila é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a fila existe e está ativa
    const { data: queue, error: queueError } = await supabaseAdmin
      .from('queues')
      .select('*')
      .eq('id', queueId)
      .eq('is_active', true)
      .single()

    if (queueError || !queue) {
      return NextResponse.json(
        { error: 'Fila não encontrada ou inativa' },
        { status: 404 }
      )
    }

    // Se não for guest, verificar se o usuário está logado
    if (!isGuest && !session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    // Se for guest, verificar se tem nome e telefone
    if (isGuest && (!customerName || !customerPhone)) {
      return NextResponse.json(
        { error: 'Nome e telefone são obrigatórios para clientes sem conta' },
        { status: 400 }
      )
    }

    // Buscar a próxima posição disponível na fila
    const { data: lastEntry, error: positionError } = await supabaseAdmin
      .from('queue_entries')
      .select('position')
      .eq('queue_id', queueId)
      .eq('status', 'waiting')
      .order('position', { ascending: false })
      .limit(1)
      .single()

    const nextPosition = lastEntry ? lastEntry.position + 1 : 1

    // Calcular tempo estimado (15-20 minutos por cliente)
    const estimatedTime = nextPosition * 15

    // Criar entrada na fila
    const { data: entry, error: insertError } = await supabaseAdmin
      .from('queue_entries')
      .insert({
        queue_id: queueId,
        user_id: isGuest ? null : session?.user?.id,
        position: nextPosition,
        status: 'waiting',
        estimated_time: estimatedTime,
        selected_barber_id: selectedBarberId,
        customer_name: isGuest ? customerName : null,
        customer_phone: isGuest ? customerPhone : null,
        is_guest: isGuest,
        parent_phone: parentPhone
      })
      .select(`
        *,
        queues (
          id,
          name,
          queue_type,
          barbershops (
            id,
            name,
            address,
            phones
          )
        )
      `)
      .single()

    if (insertError) {
      console.error('Erro ao entrar na fila:', insertError)
      return NextResponse.json(
        { error: 'Erro ao entrar na fila' },
        { status: 500 }
      )
    }

    // Atualizar posição atual da fila
    await supabaseAdmin
      .from('queues')
      .update({ current_position: nextPosition })
      .eq('id', queueId)

    return NextResponse.json({ 
      entry,
      message: 'Entrou na fila com sucesso!',
      position: nextPosition,
      estimatedTime
    }, { status: 201 })

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 