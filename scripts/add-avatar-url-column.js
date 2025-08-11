const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas!')
  console.error('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão definidas no .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addAvatarUrlColumn() {
  try {
    console.log('🔄 Adicionando coluna avatar_url na tabela users...')
    
    // Adicionar a coluna avatar_url
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS avatar_url TEXT;
      `
    })

    if (alterError) {
      console.error('❌ Erro ao adicionar coluna:', alterError)
      return
    }

    // Adicionar comentário
    const { error: commentError } = await supabase.rpc('exec_sql', {
      sql: `
        COMMENT ON COLUMN users.avatar_url IS 'URL da foto de perfil do usuário/barbeiro';
      `
    })

    if (commentError) {
      console.warn('⚠️ Erro ao adicionar comentário (pode ser ignorado):', commentError)
    }

    // Verificar se a coluna foi criada
    const { data: columns, error: checkError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'users')
      .eq('column_name', 'avatar_url')

    if (checkError) {
      console.error('❌ Erro ao verificar coluna:', checkError)
      return
    }

    if (columns && columns.length > 0) {
      console.log('✅ Coluna avatar_url criada com sucesso!')
      console.log('📋 Detalhes da coluna:', columns[0])
    } else {
      console.log('⚠️ Coluna não encontrada após criação')
    }

    console.log('🎉 Migração concluída!')
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error)
  }
}

// Executar a migração
addAvatarUrlColumn()
