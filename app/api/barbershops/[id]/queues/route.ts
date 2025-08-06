import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/_lib/supabase'

// Função para verificar e criar filas automaticamente
async function ensureQueuesExist(barbershopId: string) {
  try {
    // Verificar se há barbeiros ativos
    const { data: activeBarbers, error: barbersError } = await supabaseAdmin
      .from('barber_status')
      .select(`
        id,
        barber_id,
        users!barber_status_barber_id_fkey (
          id,
          name
        )
      `)
      .eq('barbershop_id', barbershopId)
      .eq('is_active', true)

    if (barbersError) {
      console.error('Erro ao buscar barbeiros ativos:', barbersError)
      return
    }

    // Verificar filas existentes
    const { data: existingQueues, error: queuesError } = await supabaseAdmin
      .from('queues')
      .select('id, queue_type, is_active, name')
      .eq('barbershop_id', barbershopId)

    if (queuesError) {
      console.error('Erro ao buscar filas existentes:', queuesError)
      return
    }

    const hasGeneralQueue = existingQueues?.some(q => q.queue_type === 'general' && q.is_active)
    const hasSpecificQueue = existingQueues?.some(q => q.queue_type === 'specific' && q.is_active)

    // Criar fila geral se não existir
    if (!hasGeneralQueue) {
      await supabaseAdmin
        .from('queues')
        .insert({
          barbershop_id: barbershopId,
          name: 'Fila Geral',
          description: 'Fila para atendimento geral',
          queue_type: 'general',
          is_active: true,
          current_position: 0
        })
    }

    // Criar fila específica se há barbeiros ativos e não existe fila específica
    if (activeBarbers && activeBarbers.length > 0 && !hasSpecificQueue) {
      const barberName = activeBarbers[0].users?.name || 'Barbeiro'
      
      await supabaseAdmin
        .from('queues')
        .insert({
          barbershop_id: barbershopId,
          name: `Fila do ${barberName}`,
          description: `Fila específica para atendimento com ${barberName}`,
          queue_type: 'specific',
          is_active: true,
          current_position: 0
        })
    }
  } catch (error) {
    console.error('Erro ao verificar/criar filas:', error)
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const barbershopId = params.id

    // Garantir que as filas existem
    await ensureQueuesExist(barbershopId)

    // Buscar filas ativas da barbearia específica
    const { data: queues, error } = await supabaseAdmin
      .from('queues')
      .select(`
        *,
        barbershops!inner (
          id,
          name,
          address,
          phones,
          description,
          image_url,
          is_active
        )
      `)
      .eq('barbershop_id', barbershopId)
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Erro ao buscar filas:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar filas' },
        { status: 500 }
      )
    }

    // Para cada fila, buscar informações adicionais
    const queuesWithDetails = await Promise.all(
      queues?.map(async (queue) => {
        // Contar pessoas na fila
        const { count: peopleInQueue } = await supabaseAdmin
          .from('queue_entries')
          .select('*', { count: 'exact', head: true })
          .eq('queue_id', queue.id)
          .eq('status', 'waiting')

        // Buscar barbeiros ativos se for fila específica
        let activeBarbers = []
        if (queue.queue_type === 'specific') {
          const { data: barbers } = await supabaseAdmin
            .from('barber_status')
            .select(`
              id,
              barber_id,
              users!barber_status_barber_id_fkey (
                id,
                name,
                image_url
              )
            `)
            .eq('barbershop_id', barbershopId)
            .eq('is_active', true)

          activeBarbers = barbers?.map(barber => ({
            id: barber.id,
            users: {
              id: barber.users?.id || barber.barber_id,
              name: barber.users?.name || 'Barbeiro',
              avatar_url: barber.users?.image_url || null
            }
          })) || []
        }

        return {
          ...queue,
          peopleInQueue: peopleInQueue || 0,
          activeBarbers
        }
      }) || []
    )

    return NextResponse.json({ 
      queues: queuesWithDetails,
      barbershopId 
    })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
