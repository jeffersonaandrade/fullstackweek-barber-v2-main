"use server"

import { getServerSession } from "next-auth"
import { supabaseAdmin } from "../_lib/supabase"
import { authOptions } from "../_lib/auth"

export const getConcludedBookings = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return []

  // Buscar o usuário no Supabase pelo email
  const { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (userError || !user) {
    return []
  }

  // Buscar agendamentos concluídos do usuário
  const { data: bookings, error: bookingsError } = await supabaseAdmin
    .from('bookings')
    .select(`
      *,
      service:barbershop_services(
        *,
        barbershop:barbershops(*)
      )
    `)
    .eq('user_id', user.id)
    .lt('date', new Date().toISOString())
    .order('date', { ascending: true })

  if (bookingsError) {
    console.error('Erro ao buscar agendamentos concluídos:', bookingsError)
    return []
  }

  return bookings || []
}
