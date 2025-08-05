# FSW Barber - Documento de Desenvolvimento

## 📋 Índice
1. [Visão Geral do Projeto](#visão-geral)
2. [Evolução do Sistema](#evolução-do-sistema)
3. [Arquitetura Atual](#arquitetura-atual)
4. [Funcionalidades Implementadas](#funcionalidades-implementadas)
5. [Roadmap de Desenvolvimento](#roadmap)
6. [Regras de Negócio](#regras-de-negócio)
7. [Estrutura de Dados](#estrutura-de-dados)
8. [APIs e Endpoints](#apis-e-endpoints)
9. [Interface do Usuário](#interface-do-usuário)
10. [Segurança e Autenticação](#segurança)
11. [Deploy e Infraestrutura](#deploy)
12. [Testes e Qualidade](#testes)

---

## 🎯 Visão Geral do Projeto

### Objetivo
Sistema completo de gestão para barbearias, incluindo agendamentos, fila virtual, gestão de barbeiros e dashboard administrativo.

### Público-Alvo
- **Clientes**: Agendamento e fila virtual
- **Barbeiros**: Gestão de atendimentos e comissões
- **Administradores**: Dashboard completo da barbearia

### Stack Tecnológica
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Banco de Dados**: PostgreSQL (Supabase)
- **Autenticação**: NextAuth.js (email/senha) - Gratuito e flexível
- **Tempo Real**: Supabase Realtime
- **Notificações**: WhatsApp Web.js
- **Deploy**: Vercel + Supabase

---

## 📈 Evolução do Sistema

### Fase 1: MVP (Atual)
- ✅ Sistema de agendamentos básico
- ✅ Autenticação de usuários
- ✅ Listagem de barbearias e serviços
- ✅ Interface responsiva

### Fase 2: Migração para Supabase (Em Andamento)
- 🔄 Migração do banco PostgreSQL local para Supabase
- 🔄 Implementação de tempo real
- 🔄 Otimização de custos

### Fase 3: Fila Virtual
- ⏳ Sistema de fila em tempo real
- ⏳ Notificações push
- ⏳ Interface para barbeiros gerenciarem fila

### Fase 4: Dashboard e Gestão Financeira
- ⏳ Dashboard administrativo completo
- ⏳ Sistema de comissões
- ⏳ Relatórios financeiros
- ⏳ Avaliação de barbeiros
- ⏳ Gestão de produtos e estoque
- ⏳ Controle de vendas
- ⏳ Fluxo de caixa
- ⏳ Gestão WhatsApp Web
- ⏳ Histórico completo de atendimentos

### Fase 5: Funcionalidades Avançadas
- ⏳ Múltiplas filas por barbearia
- ⏳ Integração com pagamentos
- ⏳ App mobile
- ⏳ Analytics avançados

---

## 🏗️ Arquitetura Atual

### Estrutura de Pastas
```
app/
├── _actions/          # Server Actions
├── _components/       # Componentes React
├── _lib/             # Utilitários e configurações
├── _providers/       # Providers React
├── api/              # API Routes
├── barbershops/      # Páginas de barbearias
├── bookings/         # Páginas de agendamentos
└── queues/           # Páginas de fila (futuro)
```

### Padrões Utilizados
- **Server Components**: Para renderização no servidor
- **Client Components**: Para interatividade
- **Server Actions**: Para operações de dados
- **API Routes**: Para endpoints REST
- **TypeScript**: Para tipagem estática

---

## ✅ Funcionalidades Implementadas

### Cliente
- [x] Cadastro e login
- [x] Busca de barbearias
- [x] Visualização de serviços
- [x] Agendamento de horários
- [x] Histórico de agendamentos

### Sistema
- [x] Autenticação NextAuth.js (email/senha)
- [x] Banco de dados PostgreSQL
- [x] Interface responsiva
- [x] Validação de formulários

---

## 🗺️ Roadmap de Desenvolvimento

### Sprint 1: Migração Supabase (1-2 semanas)
- [x] Configurar projeto Supabase
- [x] Migrar schema do banco
- [x] Atualizar código para usar Supabase
- [x] Configurar NextAuth.js com Supabase
- [x] Adicionar coluna password à tabela users
- [x] Criar usuário admin inicial
- [x] Testes de migração

### Sprint 2: Fila Virtual (2-3 semanas)
- [ ] Modelos de dados para fila (geral e específica)
- [ ] API de entrada/saída da fila
- [ ] Sistema de prioridade por tempo de espera
- [ ] Interface do cliente (escolha de fila)
- [ ] Tempo real com WebSockets
- [ ] Sistema de ativação/desativação de barbeiros
- [ ] Integração WhatsApp Web.js para notificações (todos os clientes)
- [ ] Sistema de clientes sem conta (guest)
- [ ] Interface para adicionar clientes (barbeiros e recepcionistas)
- [ ] Sistema de crianças na fila

### Sprint 3: Interface do Barbeiro e Recepcionista (2 semanas)
- [ ] Dashboard do barbeiro
- [ ] Controles de fila
- [ ] Gestão de atendimentos
- [ ] Registro de pagamentos
- [ ] Interface para adicionar clientes sem conta (barbeiros e recepcionistas)
- [ ] Dashboard do recepcionista
- [ ] Gestão de crianças na fila

### Sprint 4: Dashboard Admin (3-4 semanas)
- [ ] Dashboard administrativo completo
- [ ] **Gestão de barbearias** (criar, editar, excluir)
- [ ] **Gestão de usuários** (cadastrar, editar, excluir, definir funções)
- [ ] **Sistema de gestão de senhas** (admin define senhas)
- [ ] **Configuração de comissões** (admin define % por barbearia)
- [ ] Sistema de comissões
- [ ] Relatórios financeiros
- [ ] Gestão de barbeiros
- [ ] Gestão de produtos e estoque
- [ ] Controle de vendas
- [ ] Fluxo de caixa
- [ ] Gestão WhatsApp Web
- [ ] Histórico de atendimentos

### Sprint 5: Funcionalidades Avançadas (4+ semanas)
- [ ] Múltiplas filas
- [ ] Avaliações
- [ ] Analytics
- [ ] Integrações externas

---

## 📋 Regras de Negócio

### Usuários e Perfis
1. **Cliente**: 
   - Pode agendar e entrar em filas (geral ou específica)
   - Pode cadastrar dependentes (filhos, familiares)
   - Pode adicionar dependentes à fila
2. **Barbeiro**: 
   - Vinculado a qualquer barbearia da rede
   - Deve ativar/desativar status de trabalho
   - **Ativo em uma barbearia por vez**: Ativação em uma desativa nas outras automaticamente
   - Gerencia filas e registra pagamentos
   - Só aparece como opção quando ativo
   - Pode adicionar clientes sem conta à fila da barbearia onde está ativo
   - Pode fazer vendas de produtos
3. **Recepcionista**: 
   - Vinculado a uma barbearia específica
   - Pode adicionar pessoas à fila (clientes sem conta)
   - Visão básica do dashboard da sua barbearia
   - Gestão local da fila
   - Pode fazer vendas de produtos
4. **Admin**: 
   - Acesso total ao dashboard e gestão da rede
   - **Gestão de barbearias**: Criar, editar, excluir barbearias
   - **Gestão de usuários**: Cadastrar, editar, excluir usuários e definir funções (barbeiro/recepcionista)
   - **Recuperação de senhas**: Reset de senhas para funcionários
   - Gestão de produtos e estoque
   - Controle de vendas e fluxo de caixa
   - Gestão WhatsApp Web (conectar/desconectar aparelhos)
   - Relatórios financeiros completos
   - Histórico de atendimentos e valores
   - **Riscos e alertas**: Monitoramento de falhas e problemas

### Agendamentos
- Horários disponíveis: 08:00 às 18:00
- Intervalo: 30 minutos
- Cancelamento: Até 2 horas antes
- Limite: 1 agendamento por cliente por dia

### Fila Virtual
- **Dois tipos de fila**:
  - **Fila Geral**: Cliente pode ser atendido por qualquer barbeiro disponível
  - **Fila Específica**: Cliente escolhe um barbeiro específico
- **Prioridade por tempo de espera**: Sempre respeita o tempo de espera, independente do tipo de fila
- **Barbeiro ativo/inativo**: Barbeiro deve ativar status ao chegar e desativar ao sair
- **Tempo estimado**: 15-20 minutos por cliente
- **Sem limite de capacidade**: Cliente decide se entra ou desiste da fila
- **Tela de status**: Cliente vê posição na fila, tempo estimado e pode sair
- **Cliente pode sair da fila** a qualquer momento
- **Notificação via WhatsApp** quando chamado (para todos os clientes com telefone)
- **Link de avaliação** enviado após atendimento (apenas para clientes com conta)
- **Clientes sem conta**: Recepcionista e barbeiros podem adicionar à fila com nome e telefone
- **Dependentes**: Cliente pode adicionar dependentes cadastrados à fila
- **Transferência automática**: Se barbeiro fica inativo, cliente vai para fila geral mantendo tempo
- **Timeout de apresentação**: Configurável pelo admin (padrão: 5-10 minutos)

### Comissões
- **Pagamento automático**: Sistema soma serviços e produtos automaticamente
- **Comissão configurável**: Admin define percentual por barbearia
- **Configuração flexível**: Pode ser diferente por barbearia
- **Comprovante automático**: Geração de comprovante de atendimento
- Pagamento: Mensal
- Relatórios automáticos

### Avaliações
- Cliente avalia após atendimento
- Nota: 1-5 estrelas
- Comentários opcionais
- Média calculada automaticamente

### Clientes Sem Conta (Guest)
- **Recepcionista e barbeiros podem adicionar** clientes sem conta à fila
- **Dados mínimos**: Nome e telefone
- **Identificação por telefone**: Telefone como identificador principal
- **Dependentes permitidos**: Um número pode cadastrar dependentes com nomes diferentes
- **Verificação de duplicatas**: Sistema pergunta se é atualização ou nova pessoa
- **Notificações WhatsApp** via número cadastrado
- **Sem link de avaliação** (não tem email cadastrado)
- **Registro completo** de atendimento para relatórios
- **Dados salvos no banco** para histórico e analytics
- **Barbeiros podem adicionar** clientes à barbearia onde estão ativos
- **Histórico de atendimentos** mantido para clientes recorrentes

### Gestão de Produtos e Estoque
- **Admin gerencia produtos**: Criar, editar, excluir produtos
- **Controle de estoque**: Quantidade atual, estoque mínimo
- **Movimentações**: Entrada, saída, ajustes de estoque
- **Vendas registradas**: Quantidade vendida, valor, cliente
- **Alertas de estoque**: Notificação quando abaixo do mínimo
- **Histórico completo**: Todas as movimentações registradas

### Fluxo de Caixa
- **Entradas**: Pagamentos de serviços, vendas de produtos
- **Saídas**: Comissões, compras, despesas
- **Categorização**: Serviços, produtos, despesas, comissões
- **Relatórios**: Diário, semanal, mensal, anual
- **Histórico completo**: Todas as transações registradas

### WhatsApp Web
- **Múltiplos dispositivos**: Uma conexão por barbearia
- **Admin gerencia**: Conectar/desconectar aparelhos
- **QR Code**: Interface para conexão
- **Status em tempo real**: Monitoramento da conexão
- **Notificações automáticas**: Envio via WhatsApp

### Políticas de Segurança e Controle
- **No-show (faltas)**: Limite de 2 faltas por dia → bloqueio por 24h
- **Logs internos**: Todas as ações automáticas são logadas para debug
- **Transparência**: Feedback visual e WhatsApp para mudanças que afetam o cliente
- **Transferência automática**: Cliente preso em fila de barbeiro inativo vai para fila geral
- **Estatísticas de lotação**: Admin recebe relatórios semanais por barbeiro/barbearia

---

## 🗄️ Estrutura de Dados

### Estratégia de Armazenamento

#### Clientes com Conta
- **Dados completos**: Nome, email, telefone (obrigatório), histórico completo
- **Login NextAuth.js**: Email/senha (sistema próprio)
- **Completar perfil**: Telefone obrigatório após primeiro login
- **Telefone obrigatório**: Para notificações WhatsApp
- **Dependentes**: Cliente pode cadastrar dependentes (filhos, familiares)
- **Notificações**: WhatsApp + email
- **Avaliações**: Link enviado por email
- **Histórico**: Completo com todos os atendimentos

#### Clientes sem Conta (Guest)
- **Dados básicos**: Nome e telefone (salvos na fila)
- **Notificações**: Apenas WhatsApp
- **Avaliações**: Não disponível
- **Histórico**: Mantido por telefone para clientes recorrentes
- **Recorrência**: Sistema identifica clientes pelo telefone

#### Produtos e Estoque
- **Dados completos**: Nome, descrição, preço, custo, estoque
- **Categorização**: Por tipo de produto
- **Controle automático**: Estoque mínimo e alertas
- **Histórico**: Todas as movimentações registradas
- **Vendas**: Registro completo de cada venda

#### Fluxo de Caixa
- **Categorização**: Entradas e saídas por tipo
- **Referência**: Link com transações específicas
- **Histórico**: Completo para relatórios
- **Relatórios**: Filtros por período e categoria

### Tabelas Principais (Supabase)

```sql
-- Enums (Tipos de Dados)
user_role: 'client', 'barber', 'receptionist', 'admin'
queue_type: 'general', 'specific'
queue_status: 'waiting', 'called', 'in_service', 'completed', 'left', 'timeout'
payment_method: 'cash', 'credit_card', 'debit_card', 'pix'
cash_flow_type: 'income', 'expense'
cash_flow_category: 'service', 'product', 'commission', 'expense', 'other'
stock_movement_type: 'in', 'out', 'adjustment'
booking_status: 'confirmed', 'cancelled', 'completed'

-- Usuários (Supabase Auth + tabela customizada)
users (
  id, name, email, phone, role, barbershop_id, created_at, updated_at
)

-- Dependentes dos clientes
dependents (
  id, user_id, name, relationship, created_at, updated_at
)

-- Barbearias
barbershops (
  id, name, address, phones, description, image_url, 
  is_active, admin_id, commission_rate, timeout_minutes, created_at, updated_at
)

-- Serviços
barbershop_services (
  id, name, description, image_url, price, barbershop_id, created_at
)

-- Agendamentos
bookings (
  id, user_id, service_id, date, status, created_at, updated_at
)

-- Filas
queues (
  id, barbershop_id, name, description, queue_type, is_active, 
  max_capacity, current_position, manager_id, created_at, updated_at
)

-- Entradas na fila
queue_entries (
  id, queue_id, user_id, position, status, estimated_time,
  selected_barber_id, customer_name, customer_phone, is_guest, 
  parent_phone, joined_at, left_at, called_at, started_at, completed_at
)

-- Pagamentos
payments (
  id, queue_entry_id, barber_id, amount, commission_rate,
  commission_amount, payment_method, created_at
)

-- Status dos barbeiros
barber_status (
  id, barber_id, barbershop_id, is_active, started_at, ended_at, created_at
)

-- Avaliações
reviews (
  id, user_id, barber_id, barbershop_id, rating, comment, created_at
)

-- Produtos
products (
  id, barbershop_id, name, description, price, cost_price, 
  stock_quantity, min_stock, category, image_url, is_active, created_at, updated_at
)

-- Vendas de produtos
product_sales (
  id, barbershop_id, product_id, quantity, unit_price, total_price,
  seller_id, customer_name, customer_phone, payment_method, created_at
)

-- Movimentações de estoque
stock_movements (
  id, barbershop_id, product_id, movement_type, quantity, 
  previous_stock, new_stock, reason, user_id, created_at
)

-- Configurações WhatsApp
whatsapp_configs (
  id, barbershop_id, device_name, is_connected, last_connection,
  qr_code, session_data, created_at, updated_at
)

-- Fluxo de caixa
cash_flow (
  id, barbershop_id, type, category, amount, description,
  reference_id, reference_type, user_id, created_at
)
```

---

## 🔌 APIs e Endpoints

### Autenticação
- `POST /api/auth/signin` - Login (Google ou email/senha)
- `POST /api/auth/signup` - Cadastro com email/senha
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Sessão atual
- `PUT /api/auth/profile` - Completar perfil (telefone)

### Barbearias
- `GET /api/barbershops` - Listar barbearias
- `GET /api/barbershops/[id]` - Detalhes da barbearia
- `GET /api/barbershops/[id]/services` - Serviços da barbearia

### Agendamentos
- `POST /api/bookings` - Criar agendamento
- `GET /api/bookings` - Listar agendamentos do usuário
- `DELETE /api/bookings/[id]` - Cancelar agendamento

### Fila Virtual (Futuro)
- `POST /api/queues/[id]/join` - Entrar na fila (geral ou específica)
- `POST /api/queues/[id]/leave` - Sair da fila
- `GET /api/queues/[id]/status` - Status da fila (posição, tempo estimado)
- `GET /api/queues/[id]/my-position` - Minha posição na fila
- `POST /api/queues/next` - Chamar próximo (baseado em tempo de espera)
- `POST /api/queues/timeout` - Remover cliente que não se apresentou
- `GET /api/barbershops/[id]/active-barbers` - Listar barbeiros ativos
- `POST /api/barbers/activate` - Ativar status do barbeiro
- `POST /api/barbers/deactivate` - Desativar status do barbeiro
- `POST /api/queues/[id]/add-guest` - Adicionar cliente sem conta (recepcionista)
- `POST /api/queues/[id]/add-dependent` - Adicionar dependente à fila
- `POST /api/queues/transfer-to-general` - Transferir para fila geral (automático)

### Dashboard (Futuro)
- `GET /api/admin/barbershops/[id]/stats` - Estatísticas
- `GET /api/admin/barbershops/[id]/revenue` - Receita
- `GET /api/admin/barbershops/[id]/commissions` - Comissões
- `GET /api/admin/barbershops/[id]/cash-flow` - Fluxo de caixa
- `GET /api/admin/barbershops/[id]/products` - Produtos
- `GET /api/admin/barbershops/[id]/stock` - Estoque
- `GET /api/admin/barbershops/[id]/sales` - Vendas
- `GET /api/admin/barbershops/[id]/whatsapp-status` - Status WhatsApp
- `GET /api/admin/barbershops/[id]/occupation-stats` - Estatísticas de lotação
- `GET /api/admin/barbershops/[id]/risks-alerts` - Riscos e alertas

### Gestão de Barbearias (Futuro)
- `POST /api/admin/barbershops` - Criar nova barbearia
- `PUT /api/admin/barbershops/[id]` - Editar barbearia
- `DELETE /api/admin/barbershops/[id]` - Excluir barbearia
- `GET /api/admin/barbershops` - Listar todas as barbearias
- `PUT /api/admin/barbershops/[id]/commission` - Configurar comissão
- `PUT /api/admin/barbershops/[id]/timeout` - Configurar timeout de apresentação

### Gestão de Usuários (Futuro)
- `POST /api/admin/users` - Cadastrar novo usuário (com senha)
- `PUT /api/admin/users/[id]` - Editar usuário
- `DELETE /api/admin/users/[id]` - Excluir usuário
- `PUT /api/admin/users/[id]/role` - Alterar função do usuário
- `PUT /api/admin/users/[id]/password` - Alterar senha (admin)
- `GET /api/admin/users` - Listar todos os usuários
- `GET /api/admin/users/barbers` - Listar barbeiros
- `GET /api/admin/users/receptionists` - Listar recepcionistas
- `GET /api/admin/users/[id]` - Detalhes do usuário

### Gestão de Dependentes (Futuro)
- `POST /api/dependents` - Cadastrar dependente
- `PUT /api/dependents/[id]` - Editar dependente
- `DELETE /api/dependents/[id]` - Excluir dependente
- `GET /api/dependents` - Listar dependentes do usuário
- `GET /api/dependents/[id]` - Detalhes do dependente

### Produtos e Estoque (Futuro)
- `POST /api/admin/products` - Criar produto
- `PUT /api/admin/products/[id]` - Atualizar produto
- `DELETE /api/admin/products/[id]` - Deletar produto
- `POST /api/admin/products/[id]/stock` - Adicionar estoque
- `POST /api/admin/products/[id]/sell` - Registrar venda
- `GET /api/admin/products/[id]/movements` - Movimentações

### WhatsApp Web (Futuro)
- `POST /api/admin/whatsapp/connect` - Conectar dispositivo
- `POST /api/admin/whatsapp/disconnect` - Desconectar dispositivo
- `GET /api/admin/whatsapp/status` - Status da conexão
- `GET /api/admin/whatsapp/qr-code` - QR Code para conexão

---

## 🎨 Interface do Usuário

### Páginas Principais
1. **Home** (`/`) - Lista de barbearias e agendamentos
2. **Barbearias** (`/barbershops`) - Busca e filtros
3. **Barbearia** (`/barbershops/[id]`) - Detalhes e agendamento
4. **Agendamentos** (`/bookings`) - Histórico do usuário
5. **Fila** (`/queues/[id]`) - Visualizar fila (futuro)
6. **Dashboard** (`/dashboard`) - Admin/Barbeiro/Recepcionista (futuro)
7. **Recepcionista** (`/receptionist`) - Interface do recepcionista (futuro)

### Páginas Admin (Futuro)
8. **Admin Dashboard** (`/admin`) - Visão geral da rede
9. **Barbearias** (`/admin/barbershops`) - Gestão de barbearias
10. **Usuários** (`/admin/users`) - Gestão de usuários
11. **Produtos** (`/admin/products`) - Gestão de produtos
12. **Estoque** (`/admin/stock`) - Controle de estoque
13. **Vendas** (`/admin/sales`) - Histórico de vendas
14. **Fluxo de Caixa** (`/admin/cash-flow`) - Relatórios financeiros
15. **WhatsApp** (`/admin/whatsapp`) - Gestão de dispositivos
16. **Relatórios** (`/admin/reports`) - Relatórios completos

### Componentes Principais
- `Header` - Navegação e autenticação
- `Search` - Busca de barbearias
- `BarbershopItem` - Card de barbearia
- `ServiceItem` - Card de serviço
- `BookingItem` - Item de agendamento
- `SignInDialog` - Login (Google + email/senha)
- `SignUpForm` - Cadastro com email/senha
- `ProfileForm` - Formulário para completar perfil (telefone)
- `QueueStatus` - Status da fila (posição, tempo estimado)
- `QueuePosition` - Minha posição na fila
- `AddGuestForm` - Formulário para adicionar cliente sem conta
- `AddDependentForm` - Formulário para adicionar dependente à fila
- `DependentManagement` - Gestão de dependentes do cliente
- `QueueTransferAlert` - Alerta de transferência para fila geral

### Componentes Admin (Futuro)
- `BarbershopForm` - Formulário de barbearias (com comissão e timeout)
- `CommissionConfig` - Configuração de comissões
- `TimeoutConfig` - Configuração de timeout de apresentação
- `UserForm` - Formulário de usuários (com campo de senha)
- `UserEditForm` - Formulário de edição de usuários
- `RoleSelector` - Seletor de funções
- `PasswordChangeForm` - Formulário de alteração de senha
- `UserManagementTable` - Tabela de gestão de usuários
- `ProductForm` - Formulário de produtos
- `StockMovement` - Movimentação de estoque
- `SalesChart` - Gráfico de vendas
- `CashFlowTable` - Tabela de fluxo de caixa
- `WhatsAppConfig` - Configuração WhatsApp
- `InventoryAlert` - Alertas de estoque
- `RevenueReport` - Relatório de receita
- `OccupationStats` - Estatísticas de lotação
- `RisksAlerts` - Riscos e alertas do sistema
- `NoShowManagement` - Gestão de faltas e bloqueios

### Design System
- **Cores**: Tailwind CSS
- **Componentes**: Shadcn/ui
- **Ícones**: Lucide React
- **Tipografia**: Inter (Google Fonts)

---

## 🔐 Segurança e Autenticação

### Autenticação
- NextAuth.js para autenticação (email/senha)
- **Gratuito e flexível**: Biblioteca open source sem custos
- **Gestão de senhas**: Admin define senhas diretamente no sistema
- **Sem envio de emails**: Admin informa credenciais pessoalmente
- **Reset de senhas**: Admin pode alterar senhas de funcionários
- **Cadastro simples**: Clientes se cadastram sem verificação de email
- **Controle total**: Sistema próprio com NextAuth.js

#### Sistema de Autenticação NextAuth.js
- **Login**: Email e senha
- **Cadastro**: Clientes se cadastram diretamente no sistema
- **Funcionários**: Admin cadastra e define senhas
- **Sessões**: Gerenciadas pelo NextAuth.js
- **Segurança**: Senhas criptografadas automaticamente
- **Gratuito**: Zero custos - biblioteca open source
- **Flexibilidade**: Controle total sobre o processo de autenticação

### Autorização
- Middleware para proteção de rotas
- Row Level Security (RLS) no Supabase
- Verificação de permissões por perfil

### Validação
- Zod para validação de schemas
- React Hook Form para formulários
- Sanitização de inputs

### Row Level Security (RLS)
- **RLS habilitado** em todas as tabelas
- **Policies por perfil**: Cliente, Barbeiro, Recepcionista, Admin
- **Proteção por barbearia**: Staff vê apenas sua barbearia
- **Controle granular**: Cada operação tem policy específica

#### Policies por Tabela:
- **`users`**: Cliente vê próprio perfil, Admin vê todos
- **`dependents`**: Cliente gerencia seus dependentes
- **`barbershops`**: Todos veem ativas, Admin gerencia
- **`barbershop_services`**: Todos veem, Admin gerencia
- **`bookings`**: Cliente vê próprios, Barbeiro vê da barbearia
- **`queues`**: Todos veem, Admin gerencia
- **`queue_entries`**: Cliente vê próprias, Barbeiro gerencia da barbearia
- **`barber_status`**: Barbeiro gerencia próprio, Todos veem ativos
- **`payments`**: Barbeiro vê próprios, Admin vê todos
- **`reviews`**: Cliente cria próprias, Todos veem públicas
- **`products`**: Todos veem, Admin gerencia
- **`product_sales`**: Vendedor vê próprias, Admin vê todas
- **`stock_movements`**: Staff vê da barbearia, Admin gerencia
- **`whatsapp_configs`**: Apenas Admin
- **`cash_flow`**: Staff vê da barbearia, Admin vê tudo

---

## 🚀 Deploy e Infraestrutura

### Ambiente de Desenvolvimento
- **Local**: Next.js dev server
- **Banco**: Supabase (desenvolvimento)
- **Variáveis**: `.env.local`

### Ambiente de Produção
- **Frontend**: Vercel
- **Backend**: Vercel Functions
- **Banco**: Supabase (produção)
- **CDN**: Vercel Edge Network

### Monitoramento
- Vercel Analytics
- Supabase Dashboard
- Error tracking (futuro)

---

## 🧪 Testes e Qualidade

### Testes Unitários
- Jest para testes JavaScript
- React Testing Library
- Testes de componentes

### Testes de Integração
- Testes de API Routes
- Testes de Server Actions
- Testes de banco de dados

### Qualidade de Código
- ESLint para linting
- Prettier para formatação
- Husky para git hooks
- TypeScript para tipagem

---

## 📝 Notas de Desenvolvimento

### Fluxos de Trabalho

#### Cliente com Conta
1. **Faz cadastro** com email e senha
2. **Completa perfil** com telefone (obrigatório para notificações)
3. **Cadastra dependentes** (opcional - filhos, familiares)
4. **Entra na fila** via app (geral ou específica)
5. **Acompanha status** na tela de posição da fila
6. **Recebe notificação** WhatsApp quando chamado
7. **Vai para barbearia** no horário
8. **Recebe link** de avaliação após atendimento

#### Cliente sem Conta (Guest)
1. **Recepcionista ou barbeiro adiciona** à fila com nome e telefone
2. **Sistema verifica** se telefone já existe (pergunta se é atualização ou nova pessoa)
3. **Recebe notificação WhatsApp** quando chamado
4. **Vai para barbearia** no horário
5. **Sem avaliação** (não tem email)

#### Dependente
1. **Cliente adiciona** dependente cadastrado à fila
2. **Cliente recebe notificação** quando dependente for chamado
3. **Cliente acompanha** dependente na barbearia
4. **Sem avaliação** (não tem email do dependente)

#### Gestão de Funcionários (Admin)
1. **Admin cadastra** novo funcionário com email e senha
2. **Admin informa** credenciais pessoalmente ao funcionário
3. **Funcionário faz** login com as credenciais fornecidas
4. **Admin pode** editar dados, alterar funções, alterar senhas
5. **Admin pode** excluir funcionários (com confirmação)
6. **Sem envio de emails** - Economia de custos e simplicidade

#### Configuração de Comissões (Admin)
1. **Admin define** percentual de comissão por barbearia
2. **Configuração flexível** - Cada barbearia pode ter % diferente
3. **Sistema calcula** automaticamente comissões baseado na configuração
4. **Relatórios** mostram comissões devidas por barbeiro

#### Gestão de Barbeiros Ativos
1. **Barbeiro ativa** status em uma barbearia
2. **Sistema desativa** automaticamente em outras barbearias
3. **Log registra** a mudança: "Desativado automaticamente em X"
4. **Cliente vê** apenas barbeiros ativos na sua barbearia

#### Controle de Faltas (No-show)
1. **Barbeiro marca** cliente como "não compareceu"
2. **Sistema conta** faltas do dia
3. **Após 2 faltas** → bloqueio por 24h
4. **WhatsApp informa**: "Você perdeu dois atendimentos hoje. Aguarde até amanhã."
5. **Admin monitora** faltas no painel de riscos e alertas

#### Transferência Automática de Fila
1. **Barbeiro desativa** status de trabalho
2. **Sistema identifica** clientes na fila específica
3. **WhatsApp informa**: "O barbeiro Fulano ficou indisponível. Você foi transferido para a fila geral."
4. **Cliente vai** para fila geral mantendo tempo de espera
5. **Prioridade mantida** baseada no tempo original

#### Timeout de Apresentação
1. **Admin configura** tempo de timeout por barbearia (padrão: 5-10 minutos)
2. **Barbeiro chama** próximo cliente
3. **Cliente tem X minutos** (configurado pelo admin) para se apresentar
4. **Se não se apresentar**: Barbeiro pode remover da fila
5. **Sistema registra** como "timeout" (conta como falta)
6. **Barbeiro pode chamar** próximo cliente imediatamente
7. **Botão "Não Compareceu"** permanece visível mesmo após timeout
8. **Ao clicar "Não Compareceu"**: Sistema registra como falta no banco de dados
9. **Após registrar falta**: Botão "Chamar Próximo" fica clicável novamente
10. **Fluxo de não comparecimento**: Timeout → Botão "Não Compareceu" → Registra falta → Libera "Chamar Próximo"

### Decisões Técnicas
1. **Migração para Supabase**: Redução de custos e recursos nativos
2. **NextAuth.js**: Autenticação gratuita e flexível (email/senha)
3. **Server Components**: Melhor performance e SEO
4. **TypeScript**: Segurança de tipos e melhor DX
5. **Tailwind CSS**: Desenvolvimento rápido e consistente

### Considerações Futuras
- **Escalabilidade**: Arquitetura preparada para crescimento
- **Manutenibilidade**: Código modular e bem documentado
- **Performance**: Otimizações contínuas
- **UX**: Feedback constante dos usuários

### Limitações Atuais
- Apenas uma fila por barbearia (será expandido)
- Sem notificações push (será implementado)
- Dashboard básico (será expandido)

---

## 🔄 Changelog

### v1.0.0 (Atual)
- Sistema básico de agendamentos
- Autenticação NextAuth.js (email/senha)
- Interface responsiva
- Listagem de barbearias e serviços

### v1.1.0 (Próximo)
- Migração para Supabase
- Sistema de fila virtual
- Tempo real
- Interface do barbeiro

### v1.2.0 (Futuro)
- Dashboard administrativo
- Sistema de comissões
- Relatórios financeiros
- Avaliações

---

## 📞 Contato e Suporte

- **Desenvolvedor**: [Seu Nome]
- **Email**: [seu-email@exemplo.com]
- **Repositório**: [link-do-repo]
- **Documentação**: Este arquivo

---

*Última atualização: [Data]*
*Versão do documento: 1.0* 