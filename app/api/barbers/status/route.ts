import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/_lib/auth'
import { supabaseAdmin } from '@/app/_lib/supabase'

export async function GET(request: NextRequest) {
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
    const { data: barberStatus, error } = await supabaseAdmin
      .from('barber_status')
      .select(`
        *,
        barbershop:barbershops(id, name, address)
      `)
      .eq('barber_id', session.user.id)
      .eq('is_active', true)
      .order('started_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Erro ao buscar status:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar status do barbeiro' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: barberStatus,
      message: barberStatus ? 'Status encontrado' : 'Nenhum status ativo encontrado'
    })

  } catch (error) {
    console.error('Erro ao buscar status do barbeiro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 