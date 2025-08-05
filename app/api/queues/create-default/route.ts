import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/_lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { barbershopId } = await request.json()

    if (!barbershopId) {
      return NextResponse.json(
        { error: 'ID da barbearia é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se já existe uma fila para esta barbearia
    const { data: existingQueues, error: checkError } = await supabaseAdmin
      .from('queues')
      .select('id')
      .eq('barbershop_id', barbershopId)
      .eq('is_active', true)

    if (checkError) {
      console.error('Erro ao verificar filas existentes:', checkError)
      return NextResponse.json(
        { error: 'Erro ao verificar filas existentes' },
        { status: 500 }
      )
    }

    // Se já existe uma fila, retornar sucesso
    if (existingQueues && existingQueues.length > 0) {
      return NextResponse.json({
        message: 'Fila já existe para esta barbearia',
        queues: existingQueues
      })
    }

    // Criar fila padrão
    const { data: queue, error } = await supabaseAdmin
      .from('queues')
      .insert({
        barbershop_id: barbershopId,
        name: 'Fila Geral',
        description: 'Fila para atendimento geral',
        queue_type: 'general',
        is_active: true,
        current_position: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar fila padrão:', error)
      return NextResponse.json(
        { error: 'Erro ao criar fila padrão' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Fila padrão criada com sucesso',
      queue
    }, { status: 201 })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 