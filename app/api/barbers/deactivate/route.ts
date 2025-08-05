import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/_lib/auth'
import { supabaseAdmin } from '@/app/_lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

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

    // Buscar status ativo do barbeiro
    const { data: activeStatus, error: findError } = await supabaseAdmin
      .from('barber_status')
      .select(`
        *,
        barbershop:barbershops(id, name)
      `)
      .eq('barber_id', session.user.id)
      .eq('is_active', true)
      .single()

    if (findError || !activeStatus) {
      return NextResponse.json(
        { error: 'Nenhum status ativo encontrado' },
        { status: 404 }
      )
    }

    // Desativar o status
    const { data: updatedStatus, error: updateError } = await supabaseAdmin
      .from('barber_status')
      .update({
        is_active: false,
        ended_at: new Date().toISOString()
      })
      .eq('id', activeStatus.id)
      .select(`
        *,
        barbershop:barbershops(id, name)
      `)
      .single()

    if (updateError) {
      console.error('Erro ao desativar status:', updateError)
      return NextResponse.json(
        { error: 'Erro ao desativar status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: updatedStatus,
      message: `Status desativado com sucesso da barbearia ${activeStatus.barbershop.name}`
    })

  } catch (error) {
    console.error('Erro ao desativar status do barbeiro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 