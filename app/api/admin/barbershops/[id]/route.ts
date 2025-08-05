import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../_lib/auth"
import { supabaseAdmin } from "../../../../_lib/supabase"

// GET - Buscar uma barbearia específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verificar se é admin
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const { id } = params

    // Buscar barbearia no Supabase
    const { data, error } = await supabaseAdmin
      .from('barbershops')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar barbearia:', error)
      return NextResponse.json(
        { error: "Erro ao buscar barbearia" },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: "Barbearia não encontrada" },
        { status: 404 }
      )
    }

    // Converter phones de string para array
    const barbershop = {
      ...data,
      phones: data.phones ? JSON.parse(data.phones) : []
    }

    return NextResponse.json(barbershop)
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// PUT - Atualizar uma barbearia
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verificar se é admin
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const { id } = params
    const body = await request.json()

    // Validação dos campos obrigatórios
    if (!body.name || !body.address) {
      return NextResponse.json(
        { error: "Nome e endereço são obrigatórios" },
        { status: 400 }
      )
    }

    // Preparar dados para atualização
    const updateData = {
      name: body.name,
      address: body.address,
      phones: JSON.stringify(body.phones || []),
      description: body.description || null,
      image_url: body.image_url || null,
      is_active: body.is_active ?? true,
      commission_rate: body.commission_rate || 30,
      timeout_minutes: body.timeout_minutes || 10,
      updated_at: new Date().toISOString()
    }

    // Atualizar barbearia no Supabase
    const { data, error } = await supabaseAdmin
      .from('barbershops')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar barbearia:', error)
      return NextResponse.json(
        { error: "Erro ao atualizar barbearia" },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: "Barbearia não encontrada" },
        { status: 404 }
      )
    }

    // Converter phones de string para array
    const barbershop = {
      ...data,
      phones: data.phones ? JSON.parse(data.phones) : []
    }

    return NextResponse.json(barbershop)
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// DELETE - Excluir uma barbearia
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verificar se é admin
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const { id } = params

    // Verificar se há usuários associados
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('barbershop_id', id)

    if (usersError) {
      console.error('Erro ao verificar usuários:', usersError)
      return NextResponse.json(
        { error: "Erro ao verificar dependências" },
        { status: 500 }
      )
    }

    if (users && users.length > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir uma barbearia que possui usuários associados" },
        { status: 400 }
      )
    }

    // Excluir barbearia do Supabase
    const { error } = await supabaseAdmin
      .from('barbershops')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao excluir barbearia:', error)
      return NextResponse.json(
        { error: "Erro ao excluir barbearia" },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: "Barbearia excluída com sucesso" })
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
} 