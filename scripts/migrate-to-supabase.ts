import { migrationUtils } from '../app/_lib/migration-utils'

async function migrateToSupabase() {
  try {
    console.log('🚀 Iniciando migração para Supabase...')
    console.log('✅ Migração já concluída - projeto usando Supabase')
    console.log('📝 Para migrar dados de um banco Prisma existente, use o script original')
  } catch (error) {
    console.error('❌ Erro durante migração:', error)
  }
}

migrateToSupabase() 