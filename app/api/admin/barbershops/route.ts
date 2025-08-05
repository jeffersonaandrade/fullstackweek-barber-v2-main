import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../_lib/auth"
import { supabaseAdmin } from "../../../_lib/supabase"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { data: barbershops, error } = await supabaseAdmin
      .from('barbershops')
      .select(`
        *,
        users!barbershops_admin_id_fkey (
          id,
          name,
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar barbearias:', error)
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }

    return NextResponse.json(barbershops)
  } catch (error) {
    console.error('Erro:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      address,
      phones,
      description,
      is_active,
      commission_rate,
      timeout_minutes
    } = body

    if (!name || !address) {
      return NextResponse.json({ error: 'Nome e endereço são obrigatórios' }, { status: 400 })
    }

    const { data: barbershop, error } = await supabaseAdmin
      .from('barbershops')
      .insert({
        name,
        address,
        phones: phones.filter((phone: string) => phone.trim() !== ""),
        description: description || null,
        is_active: is_active ?? true,
        commission_rate: commission_rate || 30,
        timeout_minutes: timeout_minutes || 10,
        admin_id: session.user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar barbearia:', error)
      return NextResponse.json({ error: 'Erro ao criar barbearia' }, { status: 500 })
    }

    return NextResponse.json(barbershop, { status: 201 })
  } catch (error) {
    console.error('Erro:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 