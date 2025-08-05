import { PrismaClient } from '@prisma/client'
import { migrationUtils } from '../app/_lib/migration-utils'

const prisma = new PrismaClient()

async function migrateToSupabase() {
  try {
    console.log('🚀 Iniciando migração para Supabase...')

    // 1. Migrar usuários
    console.log('📦 Migrando usuários...')
    const users = await prisma.user.findMany()
    if (users.length > 0) {
      const usersToMigrate = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role as any,
        barbershop_id: user.barbershopId,
        created_at: user.createdAt.toISOString(),
        updated_at: user.updatedAt.toISOString()
      }))
      
      await migrationUtils.migrateUsers(usersToMigrate)
      console.log(`✅ ${users.length} usuários migrados`)
    }

    // 2. Migrar barbearias
    console.log('🏪 Migrando barbearias...')
    const barbershops = await prisma.barbershop.findMany()
    if (barbershops.length > 0) {
      const barbershopsToMigrate = barbershops.map(shop => ({
        id: shop.id,
        name: shop.name,
        address: shop.address,
        phones: shop.phones as string[],
        description: shop.description,
        image_url: shop.imageUrl,
        is_active: shop.isActive,
        admin_id: shop.adminId,
        commission_rate: shop.commissionRate,
        timeout_minutes: shop.timeoutMinutes,
        created_at: shop.createdAt.toISOString(),
        updated_at: shop.updatedAt.toISOString()
      }))
      
      await migrationUtils.migrateBarbershops(barbershopsToMigrate)
      console.log(`✅ ${barbershops.length} barbearias migradas`)
    }

    // 3. Migrar serviços
    console.log('✂️ Migrando serviços...')
    const services = await prisma.barbershopService.findMany()
    if (services.length > 0) {
      const servicesToMigrate = services.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description,
        image_url: service.imageUrl,
        price: service.price,
        barbershop_id: service.barbershopId,
        created_at: service.createdAt.toISOString()
      }))
      
      await migrationUtils.migrateServices(servicesToMigrate)
      console.log(`✅ ${services.length} serviços migrados`)
    }

    // 4. Migrar agendamentos
    console.log('📅 Migrando agendamentos...')
    const bookings = await prisma.booking.findMany()
    if (bookings.length > 0) {
      const bookingsToMigrate = bookings.map(booking => ({
        id: booking.id,
        user_id: booking.userId,
        service_id: booking.serviceId,
        date: booking.date.toISOString(),
        status: booking.status as any,
        created_at: booking.createdAt.toISOString(),
        updated_at: booking.updatedAt.toISOString()
      }))
      
      await migrationUtils.migrateBookings(bookingsToMigrate)
      console.log(`✅ ${bookings.length} agendamentos migrados`)
    }

    console.log('🎉 Migração concluída com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar migração se o script for chamado diretamente
if (require.main === module) {
  migrateToSupabase()
    .then(() => {
      console.log('✅ Script de migração executado com sucesso')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Erro no script de migração:', error)
      process.exit(1)
    })
}

export { migrateToSupabase } 