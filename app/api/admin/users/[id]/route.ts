import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../_lib/auth"
import { supabaseAdmin } from "../../../../_lib/supabase"

// GET - Buscar um usuário específico
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

    // Buscar usuário no Supabase
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar usuário:', error)
      return NextResponse.json(
        { error: "Erro ao buscar usuário" },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    // Não retornar a senha
    const { password, ...userWithoutPassword } = data

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// PUT - Atualizar um usuário
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
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Nome e email são obrigatórios" },
        { status: 400 }
      )
    }

    // Verificar se o email já existe (exceto para o usuário atual)
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', body.email)
      .neq('id', id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Erro ao verificar email:', checkError)
      return NextResponse.json(
        { error: "Erro ao verificar email" },
        { status: 500 }
      )
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já está em uso por outro usuário" },
        { status: 400 }
      )
    }

    // Validação específica para recepcionistas
    if (body.role === 'receptionist' && !body.barbershop_id) {
      return NextResponse.json(
        { error: "Recepcionistas devem estar associados a uma barbearia" },
        { status: 400 }
      )
    }

    // Preparar dados para atualização
    const updateData = {
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      role: body.role,
      barbershop_id: body.barbershop_id || null,
      avatar_url: body.avatar_url || null,
      updated_at: new Date().toISOString()
    }

    // Atualizar usuário no Supabase
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar usuário:', error)
      return NextResponse.json(
        { error: "Erro ao atualizar usuário" },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    // Não retornar a senha
    const { password, ...userWithoutPassword } = data

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// DELETE - Excluir um usuário
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

    // Verificar se não está tentando excluir a si mesmo
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "Não é possível excluir seu próprio usuário" },
        { status: 400 }
      )
    }

    // Verificar se há dados associados (agendamentos, etc.)
    // TODO: Implementar verificações de dependências quando as tabelas forem criadas

    // Excluir usuário do Supabase
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao excluir usuário:', error)
      return NextResponse.json(
        { error: "Erro ao excluir usuário" },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: "Usuário excluído com sucesso" })
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
} 