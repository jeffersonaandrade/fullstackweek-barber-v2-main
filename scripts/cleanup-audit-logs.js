require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas!')
  console.log('📝 Verifique se NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão no .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function getAuditLogStats() {
  console.log('📊 Obtendo estatísticas dos logs de auditoria...')
  
  try {
    // Contar total de logs
    const { count: totalLogs, error: countError } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
    
    if (countError) throw countError
    
    // Contar logs dos últimos 7 dias
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { count: recentLogs, error: recentError } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString())
    
    if (recentError) throw recentError
    
    // Contar logs por ação
    const { data: actionStats, error: actionError } = await supabase
      .from('audit_logs')
      .select('action')
      .gte('created_at', sevenDaysAgo.toISOString())
    
    if (actionError) throw actionError
    
    const actionCounts = {}
    actionStats?.forEach(log => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1
    })
    
    console.log('')
    console.log('📈 Estatísticas dos logs de auditoria:')
    console.log(`   Total de logs: ${totalLogs}`)
    console.log(`   Logs dos últimos 7 dias: ${recentLogs}`)
    console.log('')
    console.log('📋 Logs por ação (últimos 7 dias):')
    Object.entries(actionCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([action, count]) => {
        console.log(`   ${action}: ${count}`)
      })
    
    return { totalLogs, recentLogs, actionCounts }
    
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error.message)
    return null
  }
}

async function cleanupOldLogs() {
  console.log('🧹 Limpando logs antigos...')
  
  try {
    // Remover logs com mais de 30 dias
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { data, error } = await supabase
      .from('audit_logs')
      .delete()
      .lt('created_at', thirtyDaysAgo.toISOString())
      .select()
    
    if (error) throw error
    
    console.log(`✅ ${data?.length || 0} logs antigos removidos`)
    return data?.length || 0
    
  } catch (error) {
    console.error('❌ Erro ao limpar logs:', error.message)
    return 0
  }
}

async function checkSupabaseUsage() {
  console.log('🔍 Verificando uso do Supabase...')
  
  try {
    // Verificar se a tabela audit_logs existe
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'audit_logs')
    
    if (error) throw error
    
    if (!tables || tables.length === 0) {
      console.log('⚠️  Tabela audit_logs não encontrada!')
      console.log('📝 Execute o script create-audit-logs-table.sql no Supabase')
      return false
    }
    
    console.log('✅ Tabela audit_logs encontrada')
    return true
    
  } catch (error) {
    console.error('❌ Erro ao verificar tabela:', error.message)
    return false
  }
}

async function main() {
  console.log('🔧 Script de limpeza e monitoramento de logs de auditoria')
  console.log('')
  
  // Verificar se a tabela existe
  const tableExists = await checkSupabaseUsage()
  if (!tableExists) {
    process.exit(1)
  }
  
  // Obter estatísticas
  const stats = await getAuditLogStats()
  if (!stats) {
    process.exit(1)
  }
  
  console.log('')
  
  // Perguntar se deve limpar logs antigos
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  rl.question('🧹 Deseja limpar logs com mais de 30 dias? (s/N): ', async (answer) => {
    if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'sim') {
      const removedCount = await cleanupOldLogs()
      console.log('')
      console.log(`✅ Limpeza concluída! ${removedCount} logs removidos`)
    } else {
      console.log('ℹ️  Limpeza cancelada')
    }
    
    console.log('')
    console.log('💡 Dicas para otimizar o uso:')
    console.log('   - Mantenha AUDIT_LOG_LEVEL=CRITICAL para produção')
    console.log('   - Execute este script semanalmente')
    console.log('   - Monitore o console do servidor para avisos de limite')
    console.log('   - Considere aumentar CLEANUP_DAYS se necessário')
    
    rl.close()
  })
}

main().catch(console.error) 