"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "../_lib/supabase"

export const deleteBooking = async (bookingId: string) => {
  const { error } = await supabaseAdmin
    .from('bookings')
    .delete()
    .eq('id', bookingId)

  if (error) {
    console.error('Erro ao deletar agendamento:', error)
    throw new Error("Erro ao deletar agendamento")
  }

  revalidatePath("/bookings")
}
