"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "../_lib/supabase"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

interface CreateBookingParams {
  serviceId: string
  date: Date
}

export const createBooking = async (params: CreateBookingParams) => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    throw new Error("Usuário não autenticado")
  }

  // Buscar o usuário no Supabase pelo email
  const { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (userError || !user) {
    throw new Error("Usuário não encontrado")
  }

  // Criar o agendamento
  const { error: bookingError } = await supabaseAdmin
    .from('bookings')
    .insert({
      user_id: user.id,
      service_id: params.serviceId,
      date: params.date.toISOString(),
      status: 'confirmed'
    })

  if (bookingError) {
    console.error('Erro ao criar agendamento:', bookingError)
    throw new Error("Erro ao criar agendamento")
  }

  revalidatePath("/barbershops/[id]")
  revalidatePath("/bookings")
}
