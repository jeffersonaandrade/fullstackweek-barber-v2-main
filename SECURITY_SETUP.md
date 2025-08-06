# 🔒 Configuração de Segurança

## Variáveis de Ambiente Necessárias

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase

# NextAuth
NEXTAUTH_SECRET=sua_chave_secreta_do_nextauth
NEXTAUTH_URL=http://localhost:3000

# Redis (para rate limiting em produção)
REDIS_URL=redis://localhost:6379

# Logs (opcional - para serviços externos)
LOG_LEVEL=info
SENTRY_DSN=sua_dsn_do_sentry
DATADOG_API_KEY=sua_chave_do_datadog

# Segurança
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_ENABLED=true
```

## Configuração do Banco de Dados

### 1. Executar Script de Logs de Auditoria

Execute o script SQL para criar a tabela de logs de auditoria:

```bash
# No Supabase SQL Editor ou via CLI
psql -h seu_host -U seu_usuario -d seu_banco -f scripts/create-audit-logs-table.sql
```

### 2. Verificar Políticas RLS

Certifique-se de que as políticas de Row Level Security estão ativas:

```sql
-- Verificar se RLS está ativo
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'audit_logs';
```

## Funcionalidades de Segurança Implementadas

### ✅ Central de Validação
- Validação centralizada com Zod
- Cache de validações para performance
- Schemas reutilizáveis

### ✅ Rate Limiting
- Limites por IP e usuário
- Configurações diferentes por tipo de endpoint
- Headers de rate limit informativos

### ✅ Logs de Auditoria
- Rastreamento de todas as ações
- Logs de segurança (tentativas de acesso não autorizado)
- Limpeza automática de logs antigos

### ✅ Middleware de Segurança
- Headers de segurança automáticos
- Verificação de autenticação
- CORS configurado
- Proteção contra ataques comuns

### ✅ Validação de Propriedade
- Verificação de ownership de recursos
- Controle de acesso baseado em roles

## Monitoramento e Alertas

### Logs de Segurança
Os seguintes eventos são automaticamente logados:

- Tentativas de acesso não autorizado
- Rate limit excedido
- Ações administrativas
- Criação/modificação de recursos críticos

### Métricas Importantes
- Número de tentativas de acesso não autorizado
- Rate limit excedido por IP
- Ações por usuário
- Performance das validações

## Próximos Passos Recomendados

### 1. Implementar Redis para Rate Limiting
```typescript
// Substituir cache em memória por Redis
import Redis from 'ioredis'
const redis = new Redis(process.env.REDIS_URL)
```

### 2. Adicionar Monitoramento
- Integrar com Sentry para erros
- Configurar alertas para eventos de segurança
- Dashboard de métricas

### 3. Implementar 2FA
- Autenticação de dois fatores para admins
- Backup codes para recuperação

### 4. Backup e Recuperação
- Backup automático dos logs de auditoria
- Procedimento de recuperação de dados

## Testes de Segurança

### Testes Automatizados
```bash
# Executar testes de segurança
npm run test:security

# Verificar vulnerabilidades
npm audit
```

### Testes Manuais
1. Tentar acessar rotas protegidas sem autenticação
2. Testar rate limiting fazendo muitas requisições
3. Verificar se logs de auditoria estão sendo criados
4. Testar validação de dados maliciosos

## Troubleshooting

### Problema: Rate limiting não funciona
**Solução:** Verificar se `RATE_LIMIT_ENABLED=true` está no .env

### Problema: Logs de auditoria não aparecem
**Solução:** Verificar se a tabela `audit_logs` foi criada e as políticas RLS estão corretas

### Problema: Validação falha
**Solução:** Verificar se os schemas Zod estão corretos e se a central de validação está sendo importada

## Contato de Segurança

Para reportar vulnerabilidades de segurança, entre em contato através de:
- Email: security@fswbarber.com
- GitHub Issues (privado) 