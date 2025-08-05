import { supabaseAdmin } from './supabase'
import { Database } from './database.types'

type User = Database['public']['Tables']['users']['Insert']
type Barbershop = Database['public']['Tables']['barbershops']['Insert']
type BarbershopService = Database['public']['Tables']['barbershop_services']['Insert']
type Booking = Database['public']['Tables']['bookings']['Insert']

export const migrationUtils = {
  // Migrar usuários
  async migrateUsers(users: User[]) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(users)
      .select()
    
    if (error) {
      console.error('Erro ao migrar usuários:', error)
      throw error
    }
    
    return data
  },

  // Migrar barbearias
  async migrateBarbershops(barbershops: Barbershop[]) {
    const { data, error } = await supabaseAdmin
      .from('barbershops')
      .insert(barbershops)
      .select()
    
    if (error) {
      console.error('Erro ao migrar barbearias:', error)
      throw error
    }
    
    return data
  },

  // Migrar serviços
  async migrateServices(services: BarbershopService[]) {
    const { data, error } = await supabaseAdmin
      .from('barbershop_services')
      .insert(services)
      .select()
    
    if (error) {
      console.error('Erro ao migrar serviços:', error)
      throw error
    }
    
    return data
  },

  // Migrar agendamentos
  async migrateBookings(bookings: Booking[]) {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert(bookings)
      .select()
    
    if (error) {
      console.error('Erro ao migrar agendamentos:', error)
      throw error
    }
    
    return data
  },

  // Verificar se a tabela existe e tem dados
  async checkTableData(tableName: string) {
    const { data, error } = await supabaseAdmin
      .from(tableName)
      .select('*')
      .limit(1)
    
    if (error) {
      console.error(`Erro ao verificar tabela ${tableName}:`, error)
      return false
    }
    
    return data.length > 0
  },

  // Limpar tabela (cuidado!)
  async clearTable(tableName: string) {
    const { error } = await supabaseAdmin
      .from(tableName)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Deleta todos os registros
    
    if (error) {
      console.error(`Erro ao limpar tabela ${tableName}:`, error)
      throw error
    }
    
    console.log(`Tabela ${tableName} limpa com sucesso`)
  }
} 