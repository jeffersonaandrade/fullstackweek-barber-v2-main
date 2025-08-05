import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/_lib/auth'
import { supabaseAdmin } from '@/app/_lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { entryId } = await request.json()

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

    if (!entryId) {
      return NextResponse.json(
        { error: 'ID da entrada é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o barbeiro está ativo
    const { data: barberStatus, error: statusError } = await supabaseAdmin
      .from('barber_status')
      .select('*')
      .eq('barber_id', session.user.id)
      .eq('is_active', true)
      .single()

    if (statusError || !barberStatus) {
      return NextResponse.json(
        { error: 'Barbeiro não está ativo' },
        { status: 403 }
      )
    }

    // Buscar a entrada da fila
    const { data: queueEntry, error: entryError } = await supabaseAdmin
      .from('queue_entries')
      .select(`
        *,
        queues!queue_entries_queue_id_fkey (
          barbershop_id
        )
      `)
      .eq('id', entryId)
      .single()

    if (entryError || !queueEntry) {
      return NextResponse.json(
        { error: 'Entrada da fila não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se a entrada pertence à barbearia onde o barbeiro está ativo
    if (queueEntry.queues.barbershop_id !== barberStatus.barbershop_id) {
      return NextResponse.json(
        { error: 'Entrada não pertence à barbearia atual' },
        { status: 403 }
      )
    }

    // Verificar se o cliente está aguardando
    if (queueEntry.status !== 'waiting') {
      return NextResponse.json(
        { error: 'Cliente não está aguardando' },
        { status: 400 }
      )
    }

    // Aplicar timeout
    const { data: updatedEntry, error: updateError } = await supabaseAdmin
      .from('queue_entries')
      .update({
        status: 'timeout',
        timeout_at: new Date().toISOString()
      })
      .eq('id', entryId)
      .select('*')
      .single()

    if (updateError) {
      console.error('Erro ao aplicar timeout:', updateError)
      return NextResponse.json(
        { error: 'Erro ao aplicar timeout' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Timeout aplicado para ${queueEntry.customer_name || 'cliente sem nome'}`,
      entry: updatedEntry
    })

  } catch (error) {
    console.error('Erro na API de timeout:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 