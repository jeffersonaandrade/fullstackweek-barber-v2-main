import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/_lib/auth'
import { supabaseAdmin } from '@/app/_lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { barbershopId } = await request.json()

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

    // Buscar o próximo cliente aguardando
    const { data: nextClient, error: clientError } = await supabaseAdmin
      .from('queue_entries')
      .select('*')
      .eq('queue_id', queue.id)
      .eq('status', 'waiting')
      .order('position', { ascending: true })
      .limit(1)
      .single()

    if (clientError || !nextClient) {
      return NextResponse.json(
        { error: 'Nenhum cliente aguardando na fila' },
        { status: 404 }
      )
    }

    // Atualizar status do cliente para "chamado"
    const { data: updatedClient, error: updateError } = await supabaseAdmin
      .from('queue_entries')
      .update({
        status: 'called',
        called_at: new Date().toISOString()
      })
      .eq('id', nextClient.id)
      .select('*')
      .single()

    if (updateError) {
      console.error('Erro ao atualizar status do cliente:', updateError)
      return NextResponse.json(
        { error: 'Erro ao chamar próximo cliente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Cliente ${nextClient.customer_name || 'sem nome'} chamado com sucesso!`,
      client: updatedClient
    })

  } catch (error) {
    console.error('Erro na API de chamar próximo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 