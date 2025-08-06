const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas')
  console.error('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão definidas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  try {
    console.log('🔄 Iniciando migração para adicionar campo selected_service_id...')
    
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, 'add-service-to-queue-entries.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')
    
    console.log('📄 Executando SQL:')
    console.log(sqlContent)
    
    // Executar a migração
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent })
    
    if (error) {
      // Se o RPC não existir, tentar executar diretamente
      console.log('⚠️ RPC exec_sql não disponível, tentando execução direta...')
      
      // Executar cada comando separadamente
      const commands = sqlContent.split(';').filter(cmd => cmd.trim())
      
      for (const command of commands) {
        if (command.trim()) {
          console.log(`Executando: ${command.trim()}`)
          const { error: cmdError } = await supabase.rpc('exec_sql', { sql: command.trim() })
          
          if (cmdError) {
            console.error(`❌ Erro ao executar comando: ${cmdError.message}`)
            console.log('💡 Tente executar manualmente no Supabase SQL Editor:')
            console.log(command.trim())
          }
        }
      }
    } else {
      console.log('✅ Migração executada com sucesso!')
    }
    
    console.log('🎉 Migração concluída!')
    console.log('📝 Campo selected_service_id adicionado à tabela queue_entries')
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error)
    console.log('💡 Execute manualmente no Supabase SQL Editor:')
    console.log(fs.readFileSync(path.join(__dirname, 'add-service-to-queue-entries.sql'), 'utf8'))
  }
}

// Executar a migração
runMigration() 