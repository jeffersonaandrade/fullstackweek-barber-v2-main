"use server"

import { endOfDay, startOfDay } from "date-fns"
import { supabaseAdmin } from "../_lib/supabase"

interface GetBookingsProps {
  serviceId: string
  date: Date
}

export const getBookings = async ({ date }: GetBookingsProps) => {
  const startDate = startOfDay(date).toISOString()
  const endDate = endOfDay(date).toISOString()

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)

  if (error) {
    console.error('Erro ao buscar agendamentos:', error)
    throw new Error("Erro ao buscar agendamentos")
  }

  return data || []
}
