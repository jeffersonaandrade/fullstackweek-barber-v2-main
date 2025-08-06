-- Criar tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_address ON audit_logs(ip_address);

-- Política RLS (Row Level Security) para audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem ver logs de auditoria
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Apenas o sistema pode inserir logs (via service role)
CREATE POLICY "System can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- Função para limpar logs antigos (manter apenas 90 dias)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM audit_logs 
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Agendar limpeza automática (executar diariamente)
-- SELECT cron.schedule('cleanup-audit-logs', '0 2 * * *', 'SELECT cleanup_old_audit_logs();');

-- Comentários na tabela
COMMENT ON TABLE audit_logs IS 'Tabela para armazenar logs de auditoria do sistema';
COMMENT ON COLUMN audit_logs.user_id IS 'ID do usuário que executou a ação (NULL para ações do sistema)';
COMMENT ON COLUMN audit_logs.user_email IS 'Email do usuário para facilitar consultas';
COMMENT ON COLUMN audit_logs.action IS 'Tipo de ação executada (ex: user_login, booking_created)';
COMMENT ON COLUMN audit_logs.resource_type IS 'Tipo de recurso afetado (ex: user, booking, barbershop)';
COMMENT ON COLUMN audit_logs.resource_id IS 'ID do recurso específico afetado';
COMMENT ON COLUMN audit_logs.details IS 'Detalhes adicionais da ação em formato JSON';
COMMENT ON COLUMN audit_logs.ip_address IS 'Endereço IP de onde veio a requisição';
COMMENT ON COLUMN audit_logs.user_agent IS 'User-Agent do navegador/cliente';
COMMENT ON COLUMN audit_logs.created_at IS 'Timestamp de quando o log foi criado'; 