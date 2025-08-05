import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/_lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/_lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { barbershopId } = body

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    if (!barbershopId) {
      return NextResponse.json(
        { error: 'ID da barbearia é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o usuário é barbeiro
    if (session.user.role !== 'barber') {
      return NextResponse.json(
        { error: 'Apenas barbeiros podem ativar status' },
        { status: 403 }
      )
    }

    // Verificar se a barbearia existe
    const { data: barbershop, error: barbershopError } = await supabaseAdmin
      .from('barbershops')
      .select('id, name')
      .eq('id', barbershopId)
      .eq('is_active', true)
      .single()

    if (barbershopError || !barbershop) {
      return NextResponse.json(
        { error: 'Barbearia não encontrada ou inativa' },
        { status: 404 }
      )
    }

    // Desativar status em outras barbearias
    await supabaseAdmin
      .from('barber_status')
      .update({
        is_active: false,
        ended_at: new Date().toISOString()
      })
      .eq('barber_id', session.user.id)
      .eq('is_active', true)

    // Verificar se já existe um status ativo para esta barbearia
    const { data: existingStatus } = await supabaseAdmin
      .from('barber_status')
      .select('id')
      .eq('barber_id', session.user.id)
      .eq('barbershop_id', barbershopId)
      .single()

    if (existingStatus) {
      // Atualizar status existente
      const { data: updatedStatus, error: updateError } = await supabaseAdmin
        .from('barber_status')
        .update({
          is_active: true,
          started_at: new Date().toISOString(),
          ended_at: null
        })
        .eq('id', existingStatus.id)
        .select()
        .single()

      if (updateError) {
        console.error('Erro ao ativar status:', updateError)
        return NextResponse.json(
          { error: 'Erro ao ativar status' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: `Status ativado em ${barbershop.name}`,
        status: updatedStatus
      })
    } else {
      // Criar novo status
      const { data: newStatus, error: insertError } = await supabaseAdmin
        .from('barber_status')
        .insert({
          barber_id: session.user.id,
          barbershop_id: barbershopId,
          is_active: true,
          started_at: new Date().toISOString()
        })
        .select()
        .single()

      if (insertError) {
        console.error('Erro ao criar status:', insertError)
        return NextResponse.json(
          { error: 'Erro ao ativar status' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: `Status ativado em ${barbershop.name}`,
        status: newStatus
      }, { status: 201 })
    }

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 