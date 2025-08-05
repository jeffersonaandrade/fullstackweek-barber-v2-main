-- Script para criar as tabelas do sistema de fila virtual
-- Execute este script no SQL Editor do Supabase

-- 1. Criar enum para tipos de fila
CREATE TYPE queue_type AS ENUM ('general', 'specific');

-- 2. Criar enum para status da fila
CREATE TYPE queue_status AS ENUM ('waiting', 'called', 'in_service', 'completed', 'left', 'timeout');

-- 3. Criar enum para métodos de pagamento
CREATE TYPE payment_method AS ENUM ('cash', 'credit_card', 'debit_card', 'pix');

-- 4. Tabela de filas
CREATE TABLE IF NOT EXISTS queues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  barbershop_id UUID NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL DEFAULT 'Fila Geral',
  description TEXT,
  queue_type queue_type NOT NULL DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_capacity INTEGER,
  current_position INTEGER DEFAULT 0,
  manager_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de entradas na fila
CREATE TABLE IF NOT EXISTS queue_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  queue_id UUID NOT NULL REFERENCES queues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  position INTEGER NOT NULL,
  status queue_status NOT NULL DEFAULT 'waiting',
  estimated_time INTEGER, -- em minutos
  selected_barber_id UUID REFERENCES users(id),
  customer_name VARCHAR(255), -- para clientes sem conta
  customer_phone VARCHAR(20), -- para clientes sem conta
  is_guest BOOLEAN NOT NULL DEFAULT false,
  parent_phone VARCHAR(20), -- telefone do responsável (para dependentes)
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  left_at TIMESTAMP WITH TIME ZONE,
  called_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela de status dos barbeiros
CREATE TABLE IF NOT EXISTS barber_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  barber_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  barbershop_id UUID NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabela de pagamentos
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  queue_entry_id UUID NOT NULL REFERENCES queue_entries(id) ON DELETE CASCADE,
  barber_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  payment_method payment_method NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabela de avaliações
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  barber_id UUID NOT NULL REFERENCES users(id),
  barbershop_id UUID NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Índices para performance
CREATE INDEX idx_queues_barbershop_id ON queues(barbershop_id);
CREATE INDEX idx_queues_is_active ON queues(is_active);
CREATE INDEX idx_queue_entries_queue_id ON queue_entries(queue_id);
CREATE INDEX idx_queue_entries_user_id ON queue_entries(user_id);
CREATE INDEX idx_queue_entries_status ON queue_entries(status);
CREATE INDEX idx_queue_entries_position ON queue_entries(position);
CREATE INDEX idx_barber_status_barber_id ON barber_status(barber_id);
CREATE INDEX idx_barber_status_barbershop_id ON barber_status(barbershop_id);
CREATE INDEX idx_barber_status_is_active ON barber_status(is_active);
CREATE INDEX idx_payments_queue_entry_id ON payments(queue_entry_id);
CREATE INDEX idx_payments_barber_id ON payments(barber_id);
CREATE INDEX idx_reviews_barber_id ON reviews(barber_id);
CREATE INDEX idx_reviews_barbershop_id ON reviews(barbershop_id);

-- 10. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 11. Triggers para atualizar updated_at
CREATE TRIGGER update_queues_updated_at BEFORE UPDATE ON queues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_queue_entries_updated_at BEFORE UPDATE ON queue_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_barber_status_updated_at BEFORE UPDATE ON barber_status FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. Comentários para documentação
COMMENT ON TABLE queues IS 'Tabela de filas das barbearias (geral e específica)';
COMMENT ON TABLE queue_entries IS 'Entradas dos clientes nas filas';
COMMENT ON TABLE barber_status IS 'Status de ativação dos barbeiros nas barbearias';
COMMENT ON TABLE payments IS 'Pagamentos dos atendimentos';
COMMENT ON TABLE reviews IS 'Avaliações dos clientes';

COMMENT ON COLUMN queue_entries.is_guest IS 'Indica se é um cliente sem conta cadastrada';
COMMENT ON COLUMN queue_entries.customer_name IS 'Nome do cliente (para guests)';
COMMENT ON COLUMN queue_entries.customer_phone IS 'Telefone do cliente (para guests)';
COMMENT ON COLUMN queue_entries.parent_phone IS 'Telefone do responsável (para dependentes)';
COMMENT ON COLUMN barber_status.is_active IS 'Indica se o barbeiro está ativo na barbearia'; 