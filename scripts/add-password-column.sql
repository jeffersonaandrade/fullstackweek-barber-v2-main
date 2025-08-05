-- Adicionar coluna password à tabela users
ALTER TABLE users ADD COLUMN password TEXT;

-- Comentário explicativo
COMMENT ON COLUMN users.password IS 'Senha criptografada do usuário para autenticação'; 