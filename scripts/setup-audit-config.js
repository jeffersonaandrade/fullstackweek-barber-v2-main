const fs = require('fs')
const path = require('path')

console.log('🔧 Configurando sistema de logs de auditoria otimizado...')

// Verificar se o arquivo .env existe
const envPath = path.join(process.cwd(), '.env')
if (!fs.existsSync(envPath)) {
  console.error('❌ Arquivo .env não encontrado!')
  console.log('📝 Crie um arquivo .env na raiz do projeto com as seguintes variáveis:')
  console.log('')
  console.log('NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima')
  console.log('SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role')
  console.log('NEXTAUTH_SECRET=seu_secret_do_nextauth')
  console.log('NEXTAUTH_URL=http://localhost:3000')
  console.log('AUDIT_LOG_LEVEL=CRITICAL')
  console.log('')
  process.exit(1)
}

// Ler o arquivo .env
let envContent = fs.readFileSync(envPath, 'utf8')

// Verificar se AUDIT_LOG_LEVEL já existe
if (!envContent.includes('AUDIT_LOG_LEVEL=')) {
  console.log('✅ Adicionando AUDIT_LOG_LEVEL=CRITICAL ao .env...')
  envContent += '\n# Configuração de logs de auditoria (CRITICAL, IMPORTANT, ALL)\nAUDIT_LOG_LEVEL=CRITICAL\n'
  fs.writeFileSync(envPath, envContent)
  console.log('✅ AUDIT_LOG_LEVEL configurado como CRITICAL')
} else {
  console.log('ℹ️  AUDIT_LOG_LEVEL já configurado')
}

console.log('')
console.log('📊 Configuração de logs de auditoria:')
console.log('')
console.log('🔴 CRITICAL (padrão):')
console.log('   - Apenas eventos críticos de segurança')
console.log('   - Acesso não autorizado')
console.log('   - Atividade suspeita')
console.log('   - Acesso administrativo')
console.log('   - Exclusões de barbearias')
console.log('   - Processamento de pagamentos')
console.log('')
console.log('🟡 IMPORTANT:')
console.log('   - Inclui CRITICAL +')
console.log('   - Login/registro de usuários')
console.log('   - Criação/edição de barbearias')
console.log('   - Criação de agendamentos')
console.log('   - Rate limit excedido')
console.log('')
console.log('🟢 ALL:')
console.log('   - Todos os eventos (não recomendado para plano gratuito)')
console.log('')
console.log('💡 Para alterar o nível, edite AUDIT_LOG_LEVEL no arquivo .env')
console.log('')
console.log('⚙️  Configurações ativas:')
console.log('   - Máximo 100 logs por hora')
console.log('   - Limpeza automática após 30 dias')
console.log('   - Processamento em lotes de 10')
console.log('   - Rate limiting baseado em memória (sem Redis)')
console.log('')
console.log('✅ Configuração concluída!')
console.log('')
console.log('🚀 Para testar o sistema:')
console.log('   1. npm run dev')
console.log('   2. Tente acessar /admin sem estar logado')
console.log('   3. Verifique os logs no Supabase (tabela audit_logs)')
console.log('')
console.log('📈 Para monitorar o uso:')
console.log('   - Verifique a tabela audit_logs no Supabase')
console.log('   - Monitore o console do servidor para avisos de limite')
console.log('   - Use o script de limpeza: node scripts/cleanup-audit-logs.js') 