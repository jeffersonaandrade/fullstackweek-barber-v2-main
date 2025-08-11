-- Adicionar coluna avatar_url na tabela users
ALTER TABLE users 
ADD COLUMN avatar_url TEXT;

-- Adicionar comentário para documentar o campo
COMMENT ON COLUMN users.avatar_url IS 'URL da foto de perfil do usuário/barbeiro';

-- Verificar se a coluna foi criada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'avatar_url';
