import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "../../../_lib/supabase"
import { createUser } from "../../../_lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      password,
      role
    } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nome, email e senha são obrigatórios' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Senha deve ter pelo menos 6 caracteres' }, { status: 400 })
    }

    // Apenas clientes podem se registrar publicamente
    if (role !== 'client') {
      return NextResponse.json({ error: 'Apenas clientes podem se registrar publicamente' }, { status: 400 })
    }

    // Verificar se o email já existe
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 })
    }

    // Criar usuário cliente
    const { data: user, error } = await createUser({
      name,
      email,
      password,
      role: 'client',
      barbershop_id: null, // Clientes não são associados a uma barbearia específica
      phone: phone || null
    })

    if (error) {
      console.error('Erro ao criar usuário:', error)
      return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Conta criada com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Erro:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 