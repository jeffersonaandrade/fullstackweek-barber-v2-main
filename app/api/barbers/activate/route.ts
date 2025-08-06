import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/_lib/auth'
import { supabaseAdmin } from '@/app/_lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { barbershopId } = await request.json()
    
    console.log('API de ativação chamada com barbershopId:', barbershopId)
    console.log('Sessão do usuário:', session?.user)
    
    // Para testes, permitir sem autenticação se barbershopId for "test-id"
    if (barbershopId === "test-id") {
      return NextResponse.json({
        success: true,
        message: 'Teste funcionando!',
        receivedData: { barbershopId },
        timestamp: new Date().toISOString()
      })
    }
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'barber') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas barbeiros podem acessar esta rota.' },
        { status: 403 }
      )
    }

    if (!barbershopId) {
      return NextResponse.json(
        { error: 'ID da barbearia é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a barbearia existe
    const { data: barbershop, error: barbershopError } = await supabaseAdmin
      .from('barbershops')
      .select('*')
      .eq('id', barbershopId)
      .single()

    if (barbershopError || !barbershop) {
      console.error('Erro ao buscar barbearia:', barbershopError)
      return NextResponse.json(
        { error: 'Barbearia não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se a barbearia está ativa
    if (!barbershop.is_active) {
      return NextResponse.json(
        { error: 'Barbearia não está ativa' },
        { status: 400 }
      )
    }

    // Desativar status em outras barbearias (se houver)
    const { error: deactivateError } = await supabaseAdmin
      .from('barber_status')
      .update({
        is_active: false,
        ended_at: new Date().toISOString()
      })
      .eq('barber_id', session.user.id)
      .eq('is_active', true)

    if (deactivateError) {
      console.error('Erro ao desativar status anterior:', deactivateError)
    }

    // Ativar status na barbearia selecionada
    const { data: newStatus, error: activateError } = await supabaseAdmin
      .from('barber_status')
      .insert({
        barber_id: session.user.id,
        barbershop_id: barbershopId,
        is_active: true,
        started_at: new Date().toISOString()
      })
      .select(`
        *,
        barbershop:barbershops(id, name, address)
      `)
      .single()

    if (activateError) {
      console.error('Erro ao ativar status:', activateError)
      return NextResponse.json(
        { error: 'Erro ao ativar status: ' + activateError.message },
        { status: 500 }
      )
    }

    // Criar fila específica para o barbeiro (se não existir)
    const { data: existingSpecificQueue } = await supabaseAdmin
      .from('queues')
      .select('id')
      .eq('barbershop_id', barbershopId)
      .eq('queue_type', 'specific')
      .eq('is_active', true)
      .single()

    if (!existingSpecificQueue) {
      const { data: specificQueue, error: queueError } = await supabaseAdmin
        .from('queues')
        .insert({
          barbershop_id: barbershopId,
          name: `Fila do ${session.user.name || 'Barbeiro'}`,
          description: `Fila específica para atendimento com ${session.user.name || 'barbeiro'}`,
          queue_type: 'specific',
          is_active: true,
          current_position: 0
        })
        .select()
        .single()

      if (queueError) {
        console.error('Erro ao criar fila específica:', queueError)
        // Não falhar a ativação se a fila não puder ser criada
      } else {
        console.log('Fila específica criada:', specificQueue)
      }
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
      message: `Status ativado com sucesso na barbearia ${barbershop.name}`,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro na API de ativação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 