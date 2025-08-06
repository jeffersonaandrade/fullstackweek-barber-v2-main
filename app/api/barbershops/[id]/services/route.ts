import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { CentralValidator } from '@/app/_lib/validation/central-validator'
import { ServiceSchema } from '@/app/_lib/validation/schemas'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    // 1. Validação centralizada
    const body = await request.json()
    const validation = await CentralValidator.validateEndpoint({
      requireAuth: true,
      requireOwnership: true,
      barbershopId: params.id,
      schema: ServiceSchema,
      data: body
    })

    if (!validation.success) {
      return new Response(validation.error, { 
        status: validation.error?.includes('Unauthorized') ? 401 : 400 
      })
    }

    const { data: validatedData, context } = validation

    // 2. Preparar dados para inserção
    const serviceData = {
      ...validatedData,
      barbershop_id: params.id
    }

    // 3. Inserção segura
    const { data, error } = await supabase
      .from('barbershop_services')
      .insert(serviceData)
      .select()
      .single()

    if (error) {
      console.error('Erro ao inserir serviço:', error)
      return new Response('Erro interno do servidor', { status: 500 })
    }

    // 4. Log de auditoria (implementar depois)
    // await logAuditEvent({
    //   action: 'CREATE_SERVICE',
    //   userId: context.userId!,
    //   barbershopId: params.id,
    //   serviceId: data.id,
    //   details: { name: data.name, price: data.price }
    // })

    return NextResponse.json({ service: data })

  } catch (error) {
    console.error('Erro ao criar serviço:', error)
    return new Response('Erro interno do servidor', { status: 500 })
  }
}

export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    // Validação mais simples para GET
    const validation = await CentralValidator.validateEndpoint({
      requireAuth: true,
      requireOwnership: true,
      barbershopId: params.id
    })

    if (!validation.success) {
      return new Response(validation.error, { 
        status: validation.error?.includes('Unauthorized') ? 401 : 400 
      })
    }

    const { data: services, error } = await supabase
      .from('barbershop_services')
      .select('*')
      .eq('barbershop_id', params.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar serviços:', error)
      return new Response('Erro interno do servidor', { status: 500 })
    }

    return NextResponse.json({ services })

  } catch (error) {
    console.error('Erro ao buscar serviços:', error)
    return new Response('Erro interno do servidor', { status: 500 })
  }
} 