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
    const { customerPhone } = body

    if (!queueId) {
      return NextResponse.json(
        { error: 'ID da fila é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar entrada do cliente na fila
    let entryQuery = supabaseAdmin
      .from('queue_entries')
      .select('*')
      .eq('queue_id', queueId)
      .eq('status', 'waiting')

    if (session?.user?.id) {
      entryQuery = entryQuery.eq('user_id', session.user.id)
    } else if (customerPhone) {
      entryQuery = entryQuery.eq('customer_phone', customerPhone)
    } else {
      return NextResponse.json(
        { error: 'Usuário não identificado' },
        { status: 400 }
      )
    }

    const { data: entry, error: findError } = await entryQuery.single()

    if (findError || !entry) {
      return NextResponse.json(
        { error: 'Entrada na fila não encontrada' },
        { status: 404 }
      )
    }

    // Atualizar status para 'left'
    const { error: updateError } = await supabaseAdmin
      .from('queue_entries')
      .update({
        status: 'left',
        left_at: new Date().toISOString()
      })
      .eq('id', entry.id)

    if (updateError) {
      console.error('Erro ao sair da fila:', updateError)
      return NextResponse.json(
        { error: 'Erro ao sair da fila' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Saiu da fila com sucesso!',
      entry
    })

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 