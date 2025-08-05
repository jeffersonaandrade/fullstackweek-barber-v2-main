import { supabaseAdmin } from '../app/_lib/supabase'
import { hashPassword } from '../app/_lib/auth'

async function createAdminUser() {
  try {
    // Dados do usuário admin
    const adminData = {
      name: 'Administrador',
      email: 'admin@barbearia.com',
      password: 'admin123', // Senha temporária - deve ser alterada
      role: 'admin' as const,
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

// Executar se chamado diretamente
if (require.main === module) {
  createAdminUser()
}

export { createAdminUser } 