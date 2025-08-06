import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../_lib/auth"
import { supabaseAdmin } from "../../../_lib/supabase"
import { CentralValidator } from "../../../_lib/validation/central-validator"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    console.log('Buscando barbearias para admin:', session.user.id)

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

    console.log('Barbearias encontradas:', barbershops?.length || 0)
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
    
    // Usar central de validação
    const validator = CentralValidator.getInstance()
    const validation = await validator.validateBarbershop(body)
    
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Dados inválidos', 
        details: validation.errors 
      }, { status: 400 })
    }

    const validatedData = validation.data

    const { data: barbershop, error } = await supabaseAdmin
      .from('barbershops')
      .insert({
        ...validatedData,
        phones: validatedData.phones.filter((phone: string) => phone.trim() !== ""),
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