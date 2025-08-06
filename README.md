# FullStackWeek Barber V2

Sistema de gerenciamento de filas para barbearias desenvolvido durante a FullStackWeek.

## 🚀 Deploy no Bolt AI

### Pré-requisitos

1. Conta no [Bolt AI](https://bolt.dev)
2. Projeto no Supabase configurado
3. Variáveis de ambiente configuradas

### Passos para Deploy

1. **Clone o repositório**
   ```bash
   git clone https://github.com/jeffersonaandrade/fullstackweek-barber-v2-main.git
   cd fullstackweek-barber-v2-main
   ```

2. **Configure as variáveis de ambiente**
   - Edite o arquivo `bolt.json`
   - Substitua os valores das variáveis de ambiente pelos seus valores reais:
     - `NEXTAUTH_URL`: URL do seu app no Bolt
     - `NEXTAUTH_SECRET`: Chave secreta do NextAuth
     - `SUPABASE_URL`: URL do seu projeto Supabase
     - `SUPABASE_ANON_KEY`: Chave anônima do Supabase
     - `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço do Supabase
     - `DATABASE_URL`: URL do banco de dados

3. **Faça deploy no Bolt AI**
   ```bash
   # Instale o CLI do Bolt (se ainda não tiver)
   npm install -g @bolt/cli
   
   # Login no Bolt
   bolt login
   
   # Deploy do projeto
   bolt deploy
   ```

### Configuração das Variáveis de Ambiente

Certifique-se de configurar as seguintes variáveis no Bolt AI:

```env
NEXTAUTH_URL=https://your-app.bolt.dev
NEXTAUTH_SECRET=your-nextauth-secret
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
DATABASE_URL=your-database-url
```

### Estrutura do Projeto

```
├── app/
│   ├── _components/     # Componentes React
│   ├── _lib/           # Bibliotecas e configurações
│   ├── api/            # Rotas da API
│   ├── barbershops/    # Páginas das barbearias
│   └── queues/         # Páginas das filas
├── bolt.json           # Configuração do Bolt AI
├── Dockerfile          # Configuração do Docker
└── package.json        # Dependências do projeto
```

### Funcionalidades

- ✅ Sistema de autenticação com NextAuth
- ✅ Gerenciamento de filas para barbearias
- ✅ Suporte a clientes não logados (guest)
- ✅ Dashboard para barbeiros
- ✅ Sistema de agendamentos
- ✅ Integração com Supabase

### Tecnologias Utilizadas

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js
- **Deploy**: Bolt AI

### Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
