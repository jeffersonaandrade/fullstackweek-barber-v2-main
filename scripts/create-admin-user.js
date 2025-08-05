require('dotenv').config({ path: '.env' })
const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')

// Configurar Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!')
  console.error('Verifique se o arquivo .env existe e contém:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function hashPassword(password) {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

async function createAdminUser() {
  try {
    // Dados do usuário admin
    const adminData = {
      name: 'Administrador',
      email: 'admin@barbearia.com',
      password: 'admin123', // Senha temporária - deve ser alterada
      role: 'admin',
      phone: '(11) 99999-9999'
    }

    // Verificar se o usuário já existe
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', adminData.email)
      .single()

    if (existingUser) {
      console.log('❌ Usuário admin já existe!')
      return
    }

    // Criar hash da senha
    const hashedPassword = await hashPassword(adminData.password)

    // Inserir usuário admin
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role,
        phone: adminData.phone
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao criar usuário admin:', error)
      return
    }

    console.log('✅ Usuário admin criado com sucesso!')
    console.log('📧 Email:', adminData.email)
    console.log('🔑 Senha:', adminData.password)
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!')

  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

// Executar
createAdminUser() 