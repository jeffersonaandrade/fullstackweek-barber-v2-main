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
- [x] Dashboard administrativo completo
- [x] **Gestão de barbearias** (criar, editar, excluir, visualizar detalhes)
- [x] **Formulário completo para nova barbearia** (nome, endereço, telefones, descrição, comissão, timeout)
- [x] **API para criar barbearias** no Supabase
- [x] **Componentes UI** (Textarea, Switch, ImageUpload)
- [x] **Menu admin no sidebar** para usuários admin
- [x] **Gestão de usuários** (cadastrar, editar, excluir, definir funções)
- [x] **Sistema de gestão de senhas** (admin define senhas)
- [x] **Páginas de edição e visualização** (barbearias e usuários)
- [x] **Upload de imagens** para barbearias e usuários
- [x] **Página de detalhes da barbearia** com estatísticas e staff
- [x] **Página de gerenciamento de staff** da barbearia
- [x] **APIs completas** para CRUD de barbearias e usuários
- [x] **Botões funcionais** nas listagens (Ver Detalhes, Gerenciar Staff, Editar)
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

### Fluxo de Trabalho do Barbeiro ⭐
1. **Login**: Barbeiro faz login no sistema
2. **Navegação**: Menu lateral com opção "Dashboard do Barbeiro"
3. **Ativação**: Barbeiro ativa seu status de trabalho
4. **Gestão da Fila**: Barbeiro vê e gerencia a fila atual
5. **Chamar Próximo**: Barbeiro chama próximo cliente da fila
6. **Timeout**: Barbeiro gerencia clientes que não se apresentaram
7. **Desativação**: Barbeiro desativa status ao final do expediente

### Regras de Negócio - Disponibilidade da Barbearia ⭐
**Regra Principal: Barbearia Ativa = Barbeiro Ativo**
- **Uma barbearia só pode estar disponível para receber clientes na fila se houver pelo menos um barbeiro ativo**
- **Barbeiro ativo = Barbearia ativa**
- **Sem barbeiros ativos = Barbearia fechada**

**Fluxo de Verificação de Disponibilidade:**
1. **Cliente acessa página de filas da barbearia**
2. **Sistema verifica se há barbeiros ativos** (`/api/barbershops/[id]/active-barbers`)
3. **Se há barbeiros ativos**:
   - ✅ Barbearia está **ABERTA**
   - ✅ Cliente pode entrar na fila
   - ✅ Sistema oferece **duas opções**:
     - **Fila Geral**: Qualquer barbeiro disponível
     - **Fila Específica**: Barbeiro escolhido pelo cliente
4. **Se NÃO há barbeiros ativos**:
   - ❌ Barbearia está **FECHADA**
   - ❌ Cliente **NÃO pode entrar na fila**
   - ❌ Sistema exibe mensagem: *"Barbearia fechada. Não há barbeiros ativos no momento."*

**Tipos de Fila Disponíveis:**
- **Fila Geral**: Cliente é atendido pelo primeiro barbeiro disponível
- **Fila Específica**: Cliente escolhe um barbeiro específico para atendimento

**Implementação Técnica:**
- **API de verificação**: `/api/barbershops/[id]/active-barbers`
- **Criação automática de filas**: Apenas quando há barbeiros ativos
- **Interface**: Mostrar/ocultar opções baseado na disponibilidade
- **Mensagens**: Feedback claro sobre status da barbearia

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

### Sistema de Serviços ⭐
- **Configuração pelo Admin**: Admin define todos os serviços disponíveis por barbearia
- **Categorização**: Serviços organizados por categoria (cabelo, barba, sobrancelha, etc.)
- **Seleção do Cliente**: Cliente escolhe o serviço ao entrar na fila
- **Cálculo Automático**: Sistema calcula valor total automaticamente baseado nos serviços
- **Serviços Extras**: Barbeiro pode adicionar serviços extras durante atendimento
- **Precificação**: Barbeiro NUNCA define valores, apenas seleciona serviços
- **Exemplo de Fluxo**:
  1. Cliente escolhe "Cabelo com tesoura e máquina" ao entrar na fila
  2. Sistema calcula valor automaticamente (ex: R$ 25,00)
  3. Durante atendimento, cliente quer fazer barba também
  4. Barbeiro adiciona serviço "Barba" na interface
  5. Sistema recalcula automaticamente (ex: R$ 25,00 + R$ 15,00 = R$ 40,00)
- **Estrutura de Serviços**:
  - Nome do serviço
  - Descrição
  - Categoria (cabelo, barba, sobrancelha, etc.)
  - Preço fixo
  - Tempo estimado de execução
  - Status (ativo/inativo)

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

### Clientes Sem Conta (Guest) ⭐
- **Recepcionista e barbeiros podem adicionar** clientes sem conta à fila
- **Dados mínimos**: Nome e telefone
- **Escolha de barbeiro específico**: Cliente pode escolher barbeiro preferido (quando há barbeiros ativos)
- **Escolha de serviço**: Cliente pode informar qual serviço planeja fazer (opcional)
- **Interface completa**: Modal com seleção de barbeiro e serviço
- **Identificação por telefone**: Telefone como identificador principal
- **Dependentes permitidos**: Um número pode cadastrar dependentes com nomes diferentes
- **Verificação de duplicatas**: Sistema pergunta se é atualização ou nova pessoa
- **Notificações WhatsApp** via número cadastrado
- **Sem link de avaliação** (não tem email cadastrado)
- **Registro completo** de atendimento para relatórios
- **Dados salvos no banco** para histórico e analytics
- **Barbeiros podem adicionar** clientes à barbearia onde estão ativos
- **Histórico de atendimentos** mantido para clientes recorrentes
- **Resumo da seleção**: Cliente vê resumo das escolhas antes de confirmar

### Gestão de Imagens
- **Imagens de barbearias**: Logo/fachada da barbearia
- **Fotos de barbeiros**: Avatar/foto profissional do barbeiro
- **Upload via Supabase Storage**: Armazenamento seguro e otimizado
- **Validação de formatos**: JPG, PNG, WebP (máx 5MB)
- **Redimensionamento automático**: Otimização para diferentes tamanhos
- **Fallback para imagens quebradas**: Placeholder padrão quando imagem não existe

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
  id, name, email, phone, role, barbershop_id, avatar_url, created_at, updated_at
)
-- Nota: barbershop_id é obrigatório apenas para recepcionistas
-- Barbeiros podem ter barbershop_id = null (se ativam em qualquer barbearia)
-- Administradores sempre têm barbershop_id = null (acesso total)
-- avatar_url armazena URL da foto do usuário (barbeiro/recepcionista)

-- Dependentes dos clientes
dependents (
  id, user_id, name, relationship, created_at, updated_at
)

-- Barbearias
barbershops (
  id, name, address, phones, description, image_url, 
  is_active, admin_id, commission_rate, timeout_minutes, created_at, updated_at
)
-- Nota: image_url armazena URL da imagem da barbearia (logo/fachada)

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
  selected_barber_id, selected_service_id, customer_name, customer_phone, is_guest, 
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
- `POST /api/queues/[queueId]/join` - Entrar na fila (geral ou específica)
- `POST /api/queues/[queueId]/leave` - Sair da fila
- `GET /api/queues/[queueId]/status` - Status da fila (posição, tempo estimado)
- `GET /api/queues/[queueId]/my-position` - Minha posição na fila
- `POST /api/queues/next` - Chamar próximo (baseado em tempo de espera)
- `POST /api/queues/timeout` - Remover cliente que não se apresentou
- `GET /api/barbershops/[id]/active-barbers` - Listar barbeiros ativos
- `POST /api/barbers/activate` - Ativar status do barbeiro
- `POST /api/barbers/deactivate` - Desativar status do barbeiro
- `POST /api/queues/[queueId]/add-guest` - Adicionar cliente sem conta (recepcionista)
- `POST /api/queues/[queueId]/add-dependent` - Adicionar dependente à fila
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

### Gestão de Barbearias
- `POST /api/admin/barbershops` - Criar nova barbearia ✅
- `GET /api/admin/barbershops` - Listar todas as barbearias ✅
- `GET /api/admin/barbershops/[id]` - Buscar barbearia específica ✅
- `PUT /api/admin/barbershops/[id]` - Editar barbearia ✅
- `DELETE /api/admin/barbershops/[id]` - Excluir barbearia ✅
- `PUT /api/admin/barbershops/[id]/commission` - Configurar comissão (futuro)
- `PUT /api/admin/barbershops/[id]/timeout` - Configurar timeout de apresentação (futuro)

### Gestão de Usuários
- `POST /api/admin/users` - Cadastrar novo usuário (com senha) ✅
- `GET /api/admin/users` - Listar todos os usuários ✅
- `GET /api/admin/users/[id]` - Buscar usuário específico ✅
- `PUT /api/admin/users/[id]` - Editar usuário ✅
- `DELETE /api/admin/users/[id]` - Excluir usuário ✅
- `PUT /api/admin/users/[id]/role` - Alterar função do usuário (futuro)
- `PUT /api/admin/users/[id]/password` - Alterar senha (admin) (futuro)
- `GET /api/admin/users/barbers` - Listar barbeiros (futuro)
- `GET /api/admin/users/receptionists` - Listar recepcionistas (futuro)

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
5. **Fila** (`/queues/[queueId]`) - Visualizar fila (futuro)
6. **Dashboard** (`/dashboard`) - Admin/Barbeiro/Recepcionista (futuro)
7. **Recepcionista** (`/receptionist`) - Interface do recepcionista (futuro)

### Páginas do Barbeiro
8. **Dashboard do Barbeiro** (`/dashboard/barber`) - Gerenciar fila e atendimentos ⭐
9. **Ativação de Status** (`/dashboard/barber/activate`) - Ativar/desativar status de trabalho
10. **Gestão de Fila** (`/dashboard/barber/queue`) - Ver e gerenciar fila atual
11. **Chamar Próximo** (`/dashboard/barber/next`) - Chamar próximo cliente da fila
12. **Timeout de Clientes** (`/dashboard/barber/timeout`) - Gerenciar clientes que não se apresentaram

### Páginas Admin
8. **Admin Dashboard** (`/admin`) - Visão geral da rede ✅
9. **Barbearias** (`/admin/barbershops`) - Gestão de barbearias ✅
10. **Nova Barbearia** (`/admin/barbershops/new`) - Criar barbearia ✅
11. **Detalhes Barbearia** (`/admin/barbershops/[id]`) - Visualizar detalhes e estatísticas ✅
12. **Editar Barbearia** (`/admin/barbershops/[id]/edit`) - Editar informações da barbearia ✅
13. **Staff Barbearia** (`/admin/barbershops/[id]/staff`) - Gerenciar funcionários da barbearia ✅
14. **Usuários** (`/admin/users`) - Gestão de usuários ✅
15. **Novo Usuário** (`/admin/users/new`) - Criar usuário ✅
16. **Editar Usuário** (`/admin/users/[id]/edit`) - Editar informações do usuário ✅
17. **Produtos** (`/admin/products`) - Gestão de produtos (futuro)
18. **Estoque** (`/admin/stock`) - Controle de estoque (futuro)
19. **Vendas** (`/admin/sales`) - Histórico de vendas (futuro)
20. **Fluxo de Caixa** (`/admin/cash-flow`) - Relatórios financeiros (futuro)
21. **WhatsApp** (`/admin/whatsapp`) - Gestão de dispositivos (futuro)
22. **Relatórios** (`/admin/reports`) - Relatórios completos (futuro)

### Navegação Baseada em Roles
- **Cliente**: Acesso à interface de agendamento e fila
- **Barbeiro**: Menu lateral com opção "Dashboard do Barbeiro" ⭐
- **Admin**: Acesso completo ao painel administrativo
- **Recepcionista**: Interface específica para gestão de fila

### Componentes Principais
- `Header` - Navegação e autenticação
- `SidebarMenu` - Menu lateral com navegação baseada em role ⭐
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

### Componentes do Barbeiro ⭐
- `BarberDashboard` - Dashboard principal do barbeiro
- `QueueManagement` - Gestão da fila atual
- `StatusToggle` - Ativar/desativar status de trabalho
- `NextCustomer` - Chamar próximo cliente da fila
- `TimeoutManagement` - Gerenciar clientes que não se apresentaram
- `CustomerCard` - Card com informações do cliente atual
- `QueueStats` - Estatísticas da fila (tempo médio, pessoas na fila)

### Componentes Admin
- `AdminHeader` - Header reutilizável para páginas admin ✅
- `BarbershopForm` - Formulário de barbearias (com comissão e timeout) ✅
- `ImageUpload` - Componente de upload de imagens com preview ✅
- `CommissionConfig` - Configuração de comissões (futuro)
- `TimeoutConfig` - Configuração de timeout de apresentação (futuro)
- `UserForm` - Formulário de usuários (com campo de senha) ✅
- `UserEditForm` - Formulário de edição de usuários ✅
- `RoleSelector` - Seletor de funções ✅
- `PasswordChangeForm` - Formulário de alteração de senha (futuro)
- `UserManagementTable` - Tabela de gestão de usuários ✅
- `ProductForm` - Formulário de produtos (futuro)
- `StockMovement` - Movimentação de estoque (futuro)
- `SalesChart` - Gráfico de vendas (futuro)
- `CashFlowTable` - Tabela de fluxo de caixa (futuro)
- `WhatsAppConfig` - Configuração WhatsApp (futuro)
- `InventoryAlert` - Alertas de estoque (futuro)
- `RevenueReport` - Relatório de receita (futuro)
- `OccupationStats` - Estatísticas de lotação (futuro)
- `RisksAlerts` - Riscos e alertas do sistema (futuro)
- `NoShowManagement` - Gestão de faltas e bloqueios (futuro)

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

### Sistema de Segurança Avançado

#### 1. Central de Validação (Zod)
```typescript
// Validação centralizada com schemas reutilizáveis
const validator = CentralValidator.getInstance()
const validation = await validator.validateBarbershop(data)
```

**Benefícios:**
- Validação consistente em toda aplicação
- Schemas reutilizáveis
- Mensagens de erro padronizadas
- Cache de validação

#### 2. Sistema de Logs de Auditoria Otimizado
```typescript
// Logs inteligentes com controle de volume
await auditLogger.logUserAction(
  userId,
  AUDIT_ACTIONS.BARBERSHOP_CREATED,
  RESOURCE_TYPES.BARBERSHOP,
  resourceId,
  details
)
```

**Configurações:**
- **Nível CRITICAL** (padrão): Apenas eventos críticos
- **Nível IMPORTANT**: Eventos importantes + críticos  
- **Nível ALL**: Todos os eventos (não recomendado para plano gratuito)
- Limite de 100 logs por hora
- Limpeza automática após 30 dias
- Processamento em lotes

#### 3. Rate Limiting Baseado em Memória
```typescript
// Rate limiting sem dependência de Redis
const result = await rateLimiter.checkRateLimitWithIP(ip, config)
```

**Configurações por Tipo:**
- **PUBLIC**: 100 req/15min
- **AUTHENTICATED**: 200 req/15min
- **ADMIN**: 500 req/15min
- **AUTH**: 5 req/15min (login)
- **UPLOAD**: 10 req/hora

#### 4. Middleware de Segurança Global
```typescript
// Proteção automática de todas as rotas
export async function middleware(request: NextRequest) {
  // Rate limiting, autenticação, headers de segurança
}
```

**Headers de Segurança:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

#### 5. Scripts de Monitoramento
```bash
# Configurar sistema de logs
npm run setup:audit

# Monitorar e limpar logs
npm run cleanup:logs

# Verificar ambiente
npm run check:env
```

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

#### Regras de Associação por Tipo de Usuário
1. **Administradores**: Não precisam estar associados a uma barbearia (acesso total)
2. **Barbeiros**: Não precisam estar associados a uma barbearia específica - podem se ativar/desativar em qualquer barbearia da rede
3. **Recepcionistas**: Devem estar associados a uma barbearia específica onde trabalham
4. **Clientes**: Não precisam estar associados a uma barbearia (podem frequentar qualquer uma)

#### Configuração de Comissões (Admin)
1. **Admin define** percentual de comissão por barbearia
2. **Configuração flexível** - Cada barbearia pode ter % diferente
3. **Sistema calcula** automaticamente comissões baseado na configuração
4. **Relatórios** mostram comissões devidas por barbeiro

#### Gestão de Barbeiros Ativos
1. **Barbeiro ativa** status em uma barbearia da rede
2. **Sistema desativa** automaticamente em outras barbearias
3. **Log registra** a mudança: "Desativado automaticamente em X"
4. **Cliente vê** apenas barbeiros ativos na sua barbearia
5. **Barbeiros podem** se ativar/desativar em qualquer barbearia da rede
6. **Flexibilidade total**: Barbeiros não estão vinculados permanentemente a uma barbearia específica

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
- Dashboard administrativo ✅
- Sistema de comissões
- Relatórios financeiros
- Avaliações

### v1.2.1 (Atual - Dashboard Admin)
- ✅ Dashboard administrativo completo
- ✅ Gestão de barbearias (criar, listar, editar, visualizar detalhes)
- ✅ Formulário completo para nova barbearia
- ✅ API para criar barbearias no Supabase
- ✅ Componentes UI (Textarea, Switch, ImageUpload)
- ✅ Menu admin no sidebar para usuários admin
- ✅ Autenticação e autorização admin
- ✅ Interface responsiva e moderna
- ✅ Sistema de registro público de clientes
- ✅ Gestão de usuários com regras corretas de associação
- ✅ Barbeiros podem se ativar em qualquer barbearia da rede
- ✅ Recepcionistas associados a barbearias específicas
- ✅ Página 404 personalizada com layout consistente
- ✅ Suporte a imagens de barbearias e barbeiros (documentado)
- ✅ **Sistema completo de edição e visualização**
  - ✅ Páginas de edição de barbearias e usuários
  - ✅ Upload de imagens em formulários de edição
  - ✅ Página de detalhes da barbearia com estatísticas
  - ✅ Página de gerenciamento de staff da barbearia
  - ✅ APIs para buscar e atualizar dados específicos
  - ✅ Botões funcionais nas listagens (Ver Detalhes, Gerenciar Staff, Editar)
  - ✅ Interface completa com estatísticas, informações e ações rápidas
  - ✅ Carregamento de dados existentes nos formulários de edição
  - ✅ Validação e atualização via APIs REST
  - ✅ Componente ImageUpload reutilizável com preview
  - ✅ Fallback para imagens quebradas ou inexistentes

### v1.3.0 (Atual - Sistema de Fila Virtual)
- ✅ **Tabelas do sistema de fila** criadas no Supabase
- ✅ **Tipos TypeScript** atualizados para novas tabelas
- ✅ **APIs do sistema de fila** implementadas:
  - ✅ Listar e criar filas
  - ✅ Entrar/sair da fila
  - ✅ Verificar status da fila
  - ✅ Ativar status de barbeiros
- ✅ **Interface do cliente** para sistema de fila:
  - ✅ Página de seleção de fila (geral e específica)
  - ✅ Página de status da fila com atualização automática
  - ✅ Botão "Entrar na Fila" na página da barbearia
  - ✅ Suporte a clientes com e sem conta (guests)
- ✅ **Sistema de prioridade** por tempo de espera
- ✅ **Cálculo automático** de tempo estimado
- ✅ **Interface responsiva** e moderna

---

## 📞 Contato e Suporte

- **Desenvolvedor**: [Seu Nome]
- **Email**: [seu-email@exemplo.com]
- **Repositório**: [link-do-repo]
- **Documentação**: Este arquivo

---

## 🎯 Próximos Passos

### Sprint 5: Sistema de Fila Virtual (Prioridade Alta)
Com o dashboard administrativo completo, o próximo foco é implementar o sistema de fila virtual:

#### Funcionalidades Principais:
- [x] **Modelos de dados para fila** (geral e específica)
- [x] **API de entrada/saída da fila**
- [x] **Sistema de prioridade por tempo de espera**
- [x] **Interface do cliente** (escolha de fila)
- [ ] **Tempo real com WebSockets** (Supabase Realtime)
- [x] **Sistema de ativação/desativação de barbeiros**
- [ ] **Interface para barbeiros gerenciarem fila**
- [x] **Sistema de clientes sem conta (guest)**
- [ ] **Interface para adicionar clientes** (barbeiros e recepcionistas)
- [ ] **Sistema de crianças na fila**

#### Benefícios:
- ✅ **Base sólida**: Dashboard admin completo permite gestão de barbearias e usuários
- ✅ **Usuários cadastrados**: Sistema de autenticação e gestão de usuários funcionando
- ✅ **Infraestrutura pronta**: Supabase configurado e APIs funcionais
- ✅ **Interface responsiva**: Componentes UI reutilizáveis implementados

### Sprint 6: Sistema de Serviços (Prioridade Alta)
- [ ] **Gestão de serviços por barbearia** (admin)
- [ ] **Seleção de serviços pelo cliente** na entrada da fila
- [ ] **Cálculo automático de valores** baseado nos serviços
- [ ] **Adição de serviços extras** pelo barbeiro durante atendimento
- [ ] **Interface para configurar serviços** (nome, descrição, preço)
- [ ] **Categorização de serviços** (cabelo, barba, sobrancelha, etc.)

### Sprint 7: Funcionalidades Avançadas (Após Sistema de Serviços)
- [ ] **Sistema de comissões** (baseado na configuração já implementada)
- [ ] **Relatórios financeiros** (fluxo de caixa, vendas)
- [ ] **Gestão de produtos e estoque**
- [ ] **Controle de vendas**
- [ ] **Integração WhatsApp Web**
- [ ] **Histórico de atendimentos**
- [ ] **Avaliações de clientes**

---

*Última atualização: 2024-12-19*
*Versão do documento: 1.2.1* 

# Documentação de Desenvolvimento - FSW Barber

## 🔒 Segurança do Sistema

### Análise de Segurança Atual

#### ✅ Pontos Seguros Implementados

1. **Autenticação com NextAuth.js**
   - Sessões seguras e criptografadas
   - Verificação de roles (admin/user)
   - Redirecionamento automático para usuários não autenticados
   - Proteção de rotas administrativas

2. **Server Components**
   - Código sensível executa no servidor
   - Variáveis de ambiente protegidas
   - Dados não expostos no cliente
   - Lógica de negócio isolada

3. **Supabase RLS (Row Level Security)**
   - Políticas de acesso no nível do banco de dados
   - Usuários só acessam seus próprios dados
   - Proteção contra acesso não autorizado

#### ⚠️ Vulnerabilidades Identificadas

1. **API Routes sem Validação Robusta**
   ```typescript
   // ❌ Exemplo atual - vulnerável
   export async function POST(request: Request) {
     const { name, price, description } = await request.json()
     // Sem validação de dados!
     await supabase.insert({ name, price, description })
   }
   ```

2. **Falta de Validação de Entrada**
   - Preços podem ser negativos ou zero
   - Nomes podem ser vazios ou muito longos
   - Descrições podem conter XSS
   - Sem sanitização de dados

3. **Falta de Rate Limiting**
   - Sem proteção contra spam de requisições
   - Possível ataque DDoS
   - Sem limitação de tentativas de login

4. **Falta de Validação de Propriedade**
   - Usuário pode tentar editar dados de outras barbearias
   - Sem verificação de ownership
   - Possível acesso cross-tenant

5. **Logs de Segurança Insuficientes**
   - Sem auditoria de ações críticas
   - Falta de monitoramento de tentativas de acesso
   - Sem alertas de segurança

### 🛡️ Plano de Melhorias de Segurança

#### Sprint 7: Implementação de Segurança (Prioridade Alta)

##### Tarefas Planejadas

- [ ] **Validação com Zod**
  - Implementar schemas de validação para todas as APIs
  - Validar entrada de dados em tempo real
  - Sanitização automática de dados

- [ ] **Middleware de Segurança**
  - Rate limiting por IP e usuário
  - Logs de auditoria
  - Verificação de tokens
  - Proteção contra CSRF

- [ ] **Validação de Propriedade**
  - Verificar ownership em todas as operações
  - Implementar políticas de acesso por tenant
  - Isolamento de dados entre barbearias

- [ ] **Sanitização e Validação de Dados**
  - Sanitização de HTML/JavaScript
  - Validação de tipos e formatos
  - Proteção contra SQL Injection
  - Validação de uploads de arquivos

- [ ] **Logs e Monitoramento**
  - Logs de auditoria para ações críticas
  - Monitoramento de tentativas de acesso
  - Alertas de segurança
  - Dashboard de segurança

##### Implementações Técnicas

###### 1. Central de Validação (Middleware Centralizado)

**Conceito**: Criar um sistema centralizado de validação que todos os endpoints utilizam, garantindo consistência e evitando esquecimentos.

**Benefícios**:
- ✅ **Consistência**: Todas as APIs seguem o mesmo padrão
- ✅ **Manutenibilidade**: Mudanças em um lugar só
- ✅ **Segurança**: Não há risco de esquecer validação
- ✅ **Performance**: Cache de validações comuns
- ✅ **Auditoria**: Logs centralizados de todas as validações

```typescript
// app/_lib/validation/central-validator.ts
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth'
import { createClient } from '@supabase/supabase-js'

export interface ValidationContext {
  userId?: string
  userRole?: string
  barbershopId?: string
  serviceId?: string
}

export interface ValidationResult {
  success: boolean
  data?: any
  error?: string
  context?: ValidationContext
}

export class CentralValidator {
  private static supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Validação de autenticação
  static async validateAuth(): Promise<ValidationResult> {
    try {
      const session = await getServerSession(authOptions)
      
      if (!session?.user) {
        return {
          success: false,
          error: 'Unauthorized - User not authenticated'
        }
      }

      return {
        success: true,
        context: {
          userId: session.user.id,
          userRole: session.user.role
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Authentication validation failed'
      }
    }
  }

  // Validação de propriedade (ownership)
  static async validateOwnership(
    barbershopId: string, 
    userId: string
  ): Promise<ValidationResult> {
    try {
      const { data: barbershop } = await this.supabase
        .from('barbershops')
        .select('id, owner_id')
        .eq('id', barbershopId)
        .single()

      if (!barbershop || barbershop.owner_id !== userId) {
        return {
          success: false,
          error: 'Forbidden - User does not own this resource'
        }
      }

      return {
        success: true,
        context: { barbershopId }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Ownership validation failed'
      }
    }
  }

  // Validação de dados com Zod
  static validateData<T>(
    schema: z.ZodSchema<T>, 
    data: any
  ): ValidationResult {
    try {
      const validatedData = schema.parse(data)
      return {
        success: true,
        data: validatedData
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: `Validation failed: ${error.errors.map(e => e.message).join(', ')}`
        }
      }
      return {
        success: false,
        error: 'Data validation failed'
      }
    }
  }

  // Validação completa para endpoints
  static async validateEndpoint<T>({
    requireAuth = true,
    requireOwnership = false,
    barbershopId,
    schema,
    data
  }: {
    requireAuth?: boolean
    requireOwnership?: boolean
    barbershopId?: string
    schema?: z.ZodSchema<T>
    data?: any
  }): Promise<ValidationResult> {
    const context: ValidationContext = {}

    // 1. Validação de autenticação
    if (requireAuth) {
      const authResult = await this.validateAuth()
      if (!authResult.success) {
        return authResult
      }
      Object.assign(context, authResult.context)
    }

    // 2. Validação de propriedade
    if (requireOwnership && barbershopId && context.userId) {
      const ownershipResult = await this.validateOwnership(barbershopId, context.userId)
      if (!ownershipResult.success) {
        return ownershipResult
      }
      Object.assign(context, ownershipResult.context)
    }

    // 3. Validação de dados
    if (schema && data) {
      const dataResult = this.validateData(schema, data)
      if (!dataResult.success) {
        return dataResult
      }
      return {
        success: true,
        data: dataResult.data,
        context
      }
    }

    return {
      success: true,
      context
    }
  }

  // Rate limiting
  static async validateRateLimit(
    identifier: string, 
    limit: number = 100, 
    windowMs: number = 15 * 60 * 1000 // 15 minutos
  ): Promise<ValidationResult> {
    // Implementação com Redis ou cache em memória
    // Por enquanto, retorna sucesso
    return { success: true }
  }
}
```

###### 2. Schemas de Validação (Zod)

```typescript
// app/_lib/validations/service.ts
import { z } from 'zod'

export const ServiceSchema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome muito longo'),
  description: z.string()
    .max(500, 'Descrição muito longa')
    .optional(),
  price: z.number()
    .positive('Preço deve ser positivo')
    .max(1000000, 'Preço muito alto'), // R$ 10.000,00
  category: z.enum(['cabelo', 'barba', 'sobrancelha', 'hidratacao', 'acabamento']),
  estimated_time: z.number()
    .positive('Tempo deve ser positivo')
    .max(480, 'Tempo máximo 8 horas'), // 480 minutos
  is_active: z.boolean(),
  image_url: z.string().url().optional()
})

export const BarbershopSchema = z.object({
  name: z.string().min(1).max(200),
  address: z.string().min(1).max(500),
  phones: z.array(z.string().regex(/^\+?[\d\s\-\(\)]+$/))
})
```

###### 3. Middleware de Segurança

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Rate limiting
  const ip = request.ip || 'unknown'
  const rateLimit = await checkRateLimit(ip)
  
  if (!rateLimit.allowed) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  // Verificação de autenticação para rotas protegidas
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = await getToken({ req: request })
    
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  // Logs de auditoria
  await logSecurityEvent({
    ip,
    path: request.nextUrl.pathname,
    method: request.method,
    userAgent: request.headers.get('user-agent')
  })

  return NextResponse.next()
}
```

###### 4. Validação de Propriedade

```typescript
// app/_lib/auth/ownership.ts
export async function validateBarbershopOwnership(
  barbershopId: string, 
  userId: string
) {
  const { data: barbershop } = await supabase
    .from('barbershops')
    .select('id, owner_id')
    .eq('id', barbershopId)
    .single()

  if (!barbershop || barbershop.owner_id !== userId) {
    throw new Error('Unauthorized access to barbershop')
  }

  return barbershop
}
```

###### 5. API Route Segura com Central de Validação

```typescript
// app/api/admin/barbershops/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../_lib/auth"
import { supabaseAdmin } from "../../../_lib/supabase"
import { CentralValidator } from "../../../_lib/validation/central-validator"
import { AuditLogger, AUDIT_ACTIONS, RESOURCE_TYPES } from "../../../_lib/audit-logger"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    
    // Usar central de validação
    const validator = CentralValidator.getInstance()
    const validation = await validator.validateBarbershop(body)
    
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Dados inválidos', 
        details: validation.errors 
      }, { status: 400 })
    }

    const validatedData = validation.data

    const { data: barbershop, error } = await supabaseAdmin
      .from('barbershops')
      .insert({
        ...validatedData,
        phones: validatedData.phones.filter((phone: string) => phone.trim() !== ""),
        admin_id: session.user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar barbearia:', error)
      return NextResponse.json({ error: 'Erro ao criar barbearia' }, { status: 500 })
    }

    // Log de auditoria
    const auditLogger = AuditLogger.getInstance()
    await auditLogger.logUserAction(
      session.user.id,
      session.user.email,
      AUDIT_ACTIONS.BARBERSHOP_CREATED,
      RESOURCE_TYPES.BARBERSHOP,
      barbershop.id,
      { barbershopData: validatedData },
      request.headers.get('x-forwarded-for') || request.ip,
      request.headers.get('user-agent')
    )

    return NextResponse.json(barbershop, { status: 201 })
  } catch (error) {
    console.error('Erro inesperado:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
```

###### 6. Sistema de Logs de Auditoria

```typescript
// app/_lib/audit-logger.ts
export class AuditLogger {
  async logUserAction(
    userId: string,
    userEmail: string,
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    // Implementação para salvar logs no banco
  }
}

// Ações comuns
export const AUDIT_ACTIONS = {
  USER_LOGIN: 'user_login',
  BARBERSHOP_CREATED: 'barbershop_created',
  UNAUTHORIZED_ACCESS: 'unauthorized_access',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded'
} as const
```

###### 7. Rate Limiting com Redis

```typescript
// app/_lib/rate-limiter.ts
export class RateLimiter {
  async checkRateLimitWithIP(
    ip: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    // Implementação com cache em memória (produção: Redis)
  }
}

// Configurações predefinidas
export const RATE_LIMIT_CONFIGS = {
  PUBLIC: { windowMs: 15 * 60 * 1000, maxRequests: 50 },
  AUTHENTICATED: { windowMs: 15 * 60 * 1000, maxRequests: 100 },
  ADMIN: { windowMs: 15 * 60 * 1000, maxRequests: 200 },
  AUTH: { windowMs: 15 * 60 * 1000, maxRequests: 5 }
} as const
```

###### 8. Middleware de Segurança Global

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // Rate limiting baseado no tipo de endpoint
  const rateLimit = await rateLimiter.checkRateLimitWithIP(ip, rateLimitConfig)
  
  // Headers de segurança
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Verificação de autenticação para rotas protegidas
  if (path.startsWith('/admin')) {
    const token = await getToken({ req: request })
    if (!token || token.role !== 'admin') {
      await auditLogger.logSecurityEvent(AUDIT_ACTIONS.UNAUTHORIZED_ACCESS, {...})
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }
  
  return response
}
```

```typescript
// app/api/barbershops/[id]/services/route.ts
import { NextResponse } from 'next/server'
import { CentralValidator } from '@/app/_lib/validation/central-validator'
import { ServiceSchema } from '@/app/_lib/validation/schemas'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    // 1. Validação centralizada
    const body = await request.json()
    const validation = await CentralValidator.validateEndpoint({
      requireAuth: true,
      requireOwnership: true,
      barbershopId: params.id,
      schema: ServiceSchema,
      data: body
    })

    if (!validation.success) {
      return new Response(validation.error, { 
        status: validation.error?.includes('Unauthorized') ? 401 : 400 
      })
    }

    const { data: validatedData, context } = validation

    // 2. Sanitização (opcional, já validado pelo Zod)
    const sanitizedData = {
      ...validatedData,
      barbershop_id: params.id
    }

    // 3. Inserção segura
    const { data, error } = await supabase
      .from('barbershop_services')
      .insert(sanitizedData)
      .select()
      .single()

    if (error) throw error

    // 4. Log de auditoria
    await logAuditEvent({
      action: 'CREATE_SERVICE',
      userId: context.userId!,
      barbershopId: params.id,
      serviceId: data.id,
      details: { name: data.name, price: data.price }
    })

    return NextResponse.json({ service: data })

  } catch (error) {
    console.error('Erro ao criar serviço:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    // Validação mais simples para GET
    const validation = await CentralValidator.validateEndpoint({
      requireAuth: true,
      requireOwnership: true,
      barbershopId: params.id
    })

    if (!validation.success) {
      return new Response(validation.error, { 
        status: validation.error?.includes('Unauthorized') ? 401 : 400 
      })
    }

    const { data: services, error } = await supabase
      .from('barbershop_services')
      .select('*')
      .eq('barbershop_id', params.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ services })

  } catch (error) {
    console.error('Erro ao buscar serviços:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
```

###### 6. Exemplo de Uso em Outros Endpoints

```typescript
// Qualquer endpoint pode usar a mesma validação
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const validation = await CentralValidator.validateEndpoint({
    requireAuth: true,
    requireOwnership: true,
    barbershopId: params.id,
    schema: ServiceUpdateSchema,
    data: await request.json()
  })

  if (!validation.success) {
    return new Response(validation.error, { status: 400 })
  }

  // Lógica do endpoint...
}

// Endpoint público (sem autenticação)
export async function GET(request: Request) {
  const validation = await CentralValidator.validateEndpoint({
    requireAuth: false // Não requer autenticação
  })

  // Lógica do endpoint...
}
```

##### Dependências Necessárias

```json
{
  "dependencies": {
    "zod": "^3.22.4",
    "isomorphic-dompurify": "^2.9.3",
    "rate-limiter-flexible": "^3.0.8"
  }
}
```

##### Arquivos a Serem Criados/Modificados

- `app/_lib/validations/` - Schemas de validação
- `app/_lib/security/` - Utilitários de segurança
- `app/_lib/auth/ownership.ts` - Validação de propriedade
- `middleware.ts` - Middleware de segurança
- `app/_lib/audit/` - Sistema de logs
- Todas as API routes - Adicionar validação

##### Benefícios Esperados

1. **Proteção contra ataques** - XSS, SQL Injection, CSRF
2. **Dados consistentes** - Validação em tempo real
3. **Auditoria completa** - Rastreamento de todas as ações
4. **Performance** - Rate limiting e cache
5. **Conformidade** - Logs para auditoria legal

---

## Componentes UI

### CurrencyInput

Componente de input com máscara de moeda brasileira para campos de preço.

#### Características

- **Formato brasileiro**: Exibe valores como "30,00" (vírgula como separador decimal)
- **Armazenamento em centavos**: Internamente trabalha com centavos para evitar problemas de precisão
- **Máscara automática**: Formata automaticamente ao perder foco
- **Suporte a diferentes formatos**: Aceita entrada com vírgula (30,50), ponto (30.50) ou números inteiros (30)

#### Uso

```tsx
import { CurrencyInput } from '@/app/_components/ui/currency-input'

// No componente
const [priceInCents, setPriceInCents] = useState("3000") // R$ 30,00

<CurrencyInput
  value={priceInCents}
  onChange={(cents) => setPriceInCents(cents)}
  placeholder="0,00"
  required
/>
```

#### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `value` | `string` | - | Valor em centavos (ex: "3000" = R$ 30,00) |
| `onChange` | `(value: string) => void` | - | Callback que recebe valor em centavos |
| `placeholder` | `string` | "0,00" | Placeholder do input |
| `className` | `string` | - | Classes CSS adicionais |
| `disabled` | `boolean` | `false` | Se o input está desabilitado |
| `required` | `boolean` | `false` | Se o campo é obrigatório |
| `id` | `string` | - | ID do input |
| `name` | `string` | - | Nome do input |

#### Comportamento

| **Entrada do usuário** | **Exibição** | **Valor salvo (centavos)** |
|----------------------|--------------|---------------------------|
| `30` | `30,00` | `"3000"` |
| `30,50` | `30,50` | `"3050"` |
| `30.50` | `30,50` | `"3050"` |
| `25,99` | `25,99` | `"2599"` |
| `100` | `100,00` | `"10000"` |

#### Implementação

- **Estado de edição**: Controla quando o usuário está digitando para evitar interferência da formatação
- **Formatação automática**: Aplica formatação brasileira ao perder foco
- **Conversão inteligente**: Detecta automaticamente o formato de entrada (vírgula, ponto ou inteiro)
- **Prefixo fixo**: Exibe "R$" como prefixo fixo no input

#### Arquivo

`app/_components/ui/currency-input.tsx`

#### Dependências

- React (useState, useEffect, useRef)
- Input component (`./input`)
- Utils (`@/app/_lib/utils`)

---

## Sprints

### Sprint 6: Sistema de Serviços (Prioridade Alta)

#### Tarefas Concluídas ✅

- [x] Interface para configurar serviços (nome, descrição, preço)
- [x] Categorização de serviços
- [x] Upload de imagens para serviços
- [x] Componente CurrencyInput para máscara de preços
- [x] Campos adicionais: categoria, tempo estimado, status ativo
- [x] Navegação melhorada no admin dashboard
- [x] Migração completa de Prisma para Supabase
- [x] Scripts para criação de dados de exemplo

#### Tarefas Pendentes

- [ ] Testes de integração dos serviços
- [ ] Validação de formulários
- [ ] Tratamento de erros de upload
- [ ] Otimização de imagens

#### Arquivos Modificados

- `app/_components/ui/currency-input.tsx` (novo)
- `app/admin/barbershops/[id]/services/new/page.tsx`
- `app/admin/barbershops/[id]/services/[serviceId]/edit/page.tsx` (novo)
- `app/admin/barbershops/[id]/services/page.tsx`
- `app/api/barbershops/[id]/services/route.ts`
- `app/api/barbershops/[id]/services/[serviceId]/route.ts`
- `app/_lib/database.types.ts`
- `scripts/create-sample-services.js` (novo)

#### Banco de Dados

```sql
-- Adicionar campos à tabela barbershop_services
ALTER TABLE barbershop_services 
ADD COLUMN category VARCHAR(100) DEFAULT 'Geral',
ADD COLUMN estimated_time INTEGER DEFAULT 30,
ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Criar índice para melhor performance
CREATE INDEX idx_barbershop_services_category ON barbershop_services(category);
CREATE INDEX idx_barbershop_services_active ON barbershop_services(is_active);

-- Adicionar comentários
COMMENT ON COLUMN barbershop_services.category IS 'Categoria do serviço (ex: Cabelo, Barba, etc.)';
COMMENT ON COLUMN barbershop_services.estimated_time IS 'Tempo estimado em minutos';
COMMENT ON COLUMN barbershop_services.is_active IS 'Se o serviço está ativo para clientes';
```

#### Scripts Disponíveis

```bash
# Criar serviços de exemplo
npm run create:sample-services

# Limpar cache do Next.js (resolver problemas de performance)
npm run clear:cache
```

#### Troubleshooting

**Erro 429 (Too Many Requests)**
- O sistema de rate limiting foi otimizado para ser mais permissivo
- Páginas públicas agora têm limite de 1000 requests/15min
- Página inicial (`/`) está excluída do rate limiting
- Execute `npm run clear:cache` se persistir

**Warning do Webpack**
- Cache otimizado para desenvolvimento e produção
- Warnings de serialização reduzidos
- Execute `npm run clear:cache` para limpar cache

**Erro 400 - Usuário Guest na Fila**
- Modal implementado para coletar nome e telefone de usuários não logados
- Validação de campos obrigatórios antes de entrar na fila
- Componente `GuestFormDialog` criado para melhor UX
- API `/api/queues/[id]/join` agora recebe dados corretos para guests

#### URLs Importantes

- **Admin Dashboard**: `/admin`
- **Listagem de Barbearias**: `/admin/barbershops`
- **Serviços de uma Barbearia**: `/admin/barbershops/[id]/services`
- **Criar Novo Serviço**: `/admin/barbershops/[id]/services/new`
- **Editar Serviço**: `/admin/barbershops/[id]/services/[serviceId]/edit`

#### Notas Técnicas

- **Preços**: Armazenados em centavos (inteiro) para evitar problemas de precisão
- **Imagens**: Upload via Supabase Storage (implementação pendente)
- **Validação**: Campos obrigatórios: nome, preço, categoria
- **Performance**: Índices criados para consultas por categoria e status 

### Sistema de Segurança Avançado

#### Rate Limiting Baseado em Memória

**Problema Resolvido:** Substituição do Redis por sistema em memória para evitar custos e dependências externas.

**Solução Implementada:**
- Rate limiting baseado em `Map` em memória
- Limpeza automática a cada 30 minutos para evitar vazamento de memória
- Configurações conservadoras para projetos menores
- **Aplicado APENAS a rotas de API** - páginas estáticas e root path (`/`) são excluídas

**Configurações:**
```typescript
RATE_LIMIT_CONFIGS = {
  PUBLIC: { maxRequests: 100, windowMs: 15 * 60 * 1000 }, // 100 req/15min
  AUTHENTICATED: { maxRequests: 200, windowMs: 15 * 60 * 1000 }, // 200 req/15min
  ADMIN: { maxRequests: 500, windowMs: 15 * 60 * 1000 }, // 500 req/15min
  AUTH: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 tentativas/15min
  UPLOAD: { maxRequests: 10, windowMs: 60 * 60 * 1000 } // 10 uploads/hora
}
```

**Exclusões do Rate Limiting:**
- Página inicial (`/`)
- Assets estáticos (`/_next/`, `/favicon.ico`, `/public/`)
- Arquivos com extensão
- Todas as páginas não-API

**Benefícios:**
- ✅ Zero custo (sem Redis)
- ✅ Sem dependências externas
- ✅ Performance otimizada
- ✅ Páginas públicas sempre acessíveis
