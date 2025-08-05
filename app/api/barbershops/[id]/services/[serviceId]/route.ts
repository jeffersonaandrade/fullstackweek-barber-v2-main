import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/_lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET - Buscar serviço específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; serviceId: string } }
) {
  try {
    const { serviceId } = params

    const { data: service, error } = await supabaseAdmin
      .from('barbershop_services')
      .select('*')
      .eq('id', serviceId)
      .single()

    if (error) {
      console.error('Erro ao buscar serviço:', error)
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      service
    })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar serviço
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; serviceId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { serviceId } = params
    const { name, description, category, price, estimated_time, is_active, image_url } = await request.json()

    // Validações
    if (!name || !category || !price) {
      return NextResponse.json(
        { error: 'Nome, categoria e preço são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o serviço existe
    const { data: existingService, error: checkError } = await supabaseAdmin
      .from('barbershop_services')
      .select('id')
      .eq('id', serviceId)
      .single()

    if (checkError || !existingService) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar serviço
    const { data: service, error } = await supabaseAdmin
      .from('barbershop_services')
      .update({
        name,
        description: description || '',
        category,
        price: parseFloat(price),
        estimated_time: estimated_time || 15,
        image_url: image_url || '',
        is_active: is_active !== undefined ? is_active : true,
        updated_at: new Date().toISOString()
      })
      .eq('id', serviceId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar serviço:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar serviço' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Serviço atualizado com sucesso',
      service
    })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar serviço (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; serviceId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { serviceId } = params

    // Verificar se o serviço existe
    const { data: existingService, error: checkError } = await supabaseAdmin
      .from('barbershop_services')
      .select('id')
      .eq('id', serviceId)
      .single()

    if (checkError || !existingService) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      )
    }

    // Soft delete - marcar como inativo
    const { error } = await supabaseAdmin
      .from('barbershop_services')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', serviceId)

    if (error) {
      console.error('Erro ao deletar serviço:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar serviço' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Serviço deletado com sucesso'
    })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 