import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/_lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const barbershopId = params.id

    const { data: barbershop, error } = await supabaseAdmin
      .from('barbershops')
      .select('*')
      .eq('id', barbershopId)
      .single()

    if (error) {
      console.error('Erro ao buscar barbearia:', error)
      return NextResponse.json(
        { error: 'Barbearia não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      barbershop
    })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 