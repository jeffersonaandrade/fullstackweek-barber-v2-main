require('dotenv').config({ path: '.env' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Configurar Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function addPasswordColumn() {
  try {
    // Ler o arquivo SQL
    const sql = fs.readFileSync('./scripts/add-password-column.sql', 'utf8')
    
    console.log('🔧 Executando SQL para adicionar coluna password...')
    
    // Executar o SQL
    const { error } = await supabaseAdmin.rpc('exec_sql', { sql })
    
    if (error) {
      // Se o RPC não existir, tentar executar diretamente
      console.log('⚠️  RPC não disponível, tentando método alternativo...')
      
      // Verificar se a coluna já existe
      const { data: columns, error: checkError } = await supabaseAdmin
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'users')
        .eq('column_name', 'password')
      
      if (checkError) {
        console.error('❌ Erro ao verificar colunas:', checkError)
        return
      }
      
      if (columns && columns.length > 0) {
        console.log('✅ Coluna password já existe!')
        return
      }
      
      console.log('❌ Não foi possível adicionar a coluna automaticamente.')
      console.log('📝 Execute manualmente no Supabase SQL Editor:')
      console.log('ALTER TABLE users ADD COLUMN password TEXT;')
      return
    }
    
    console.log('✅ Coluna password adicionada com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro:', error)
    console.log('📝 Execute manualmente no Supabase SQL Editor:')
    console.log('ALTER TABLE users ADD COLUMN password TEXT;')
  }
}

// Executar
addPasswordColumn() 