-- Adicionar campo selected_service_id à tabela queue_entries
-- Este campo armazenará o ID do serviço selecionado pelo cliente na fila

ALTER TABLE queue_entries 
ADD COLUMN selected_service_id UUID REFERENCES barbershop_services(id);

-- Adicionar comentário explicativo
COMMENT ON COLUMN queue_entries.selected_service_id IS 'ID do serviço selecionado pelo cliente (opcional)';

-- Criar índice para melhor performance em consultas
CREATE INDEX idx_queue_entries_selected_service_id ON queue_entries(selected_service_id); 