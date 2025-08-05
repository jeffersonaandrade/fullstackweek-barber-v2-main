import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/_lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Buscar apenas barbearias ativas
    const { data: barbershops, error } = await supabaseAdmin
      .from('barbershops')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      console.error('Erro ao buscar barbearias:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar barbearias' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      barbershops: barbershops || []
    })

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 