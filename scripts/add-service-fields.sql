-- Adicionar campos na tabela barbershop_services
-- Execute estas queries no SQL Editor do Supabase

-- 1. Adicionar campo category (categoria do serviço)
ALTER TABLE barbershop_services 
ADD COLUMN category VARCHAR(50) DEFAULT 'outros';

-- 2. Adicionar campo estimated_time (tempo estimado em minutos)
ALTER TABLE barbershop_services 
ADD COLUMN estimated_time INTEGER DEFAULT 30;

-- 3. Adicionar campo is_active (se o serviço está ativo)
ALTER TABLE barbershop_services 
ADD COLUMN is_active BOOLEAN DEFAULT true;

-- 4. Adicionar comentários para documentar os campos
COMMENT ON COLUMN barbershop_services.category IS 'Categoria do serviço (cabelo, barba, sobrancelha, etc.)';
COMMENT ON COLUMN barbershop_services.estimated_time IS 'Tempo estimado do serviço em minutos';
COMMENT ON COLUMN barbershop_services.is_active IS 'Indica se o serviço está ativo e disponível para clientes';

-- 5. Criar índice para melhorar performance nas consultas por categoria
CREATE INDEX idx_barbershop_services_category ON barbershop_services(category);

-- 6. Criar índice para consultas de serviços ativos
CREATE INDEX idx_barbershop_services_active ON barbershop_services(is_active) WHERE is_active = true;

-- 7. Atualizar registros existentes com valores padrão (se houver)
UPDATE barbershop_services 
SET 
  category = COALESCE(category, 'outros'),
  estimated_time = COALESCE(estimated_time, 30),
  is_active = COALESCE(is_active, true)
WHERE category IS NULL OR estimated_time IS NULL OR is_active IS NULL; 