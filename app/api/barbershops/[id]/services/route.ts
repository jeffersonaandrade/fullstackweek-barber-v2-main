import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/_lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET - Listar serviços da barbearia
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const barbershopId = params.id

    const { data: services, error } = await supabaseAdmin
      .from('barbershop_services')
      .select('*')
      .eq('barbershop_id', barbershopId)
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Erro ao buscar serviços:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar serviços' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      services: services || []
    })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo serviço
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const barbershopId = params.id
    const { name, description, category, price, estimated_time, image_url } = await request.json()

    // Validações
    if (!name || !category || !price) {
      return NextResponse.json(
        { error: 'Nome, categoria e preço são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se a barbearia existe
    const { data: barbershop, error: barbershopError } = await supabaseAdmin
      .from('barbershops')
      .select('id')
      .eq('id', barbershopId)
      .single()

    if (barbershopError || !barbershop) {
      return NextResponse.json(
        { error: 'Barbearia não encontrada' },
        { status: 404 }
      )
    }

    // Criar serviço
    const { data: service, error } = await supabaseAdmin
      .from('barbershop_services')
      .insert({
        barbershop_id: barbershopId,
        name,
        description: description || '',
        category,
        price: parseFloat(price),
        estimated_time: estimated_time || 15,
        image_url: image_url || '',
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar serviço:', error)
      return NextResponse.json(
        { error: 'Erro ao criar serviço' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Serviço criado com sucesso',
      service
    }, { status: 201 })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 