-- =====================================================================
-- Lumen Scriptura - schema alinhado ao codigo (schema public)
-- Autenticacao customizada via tabela app_users (e-mail + senha hash).
-- study_progress.payload (JSONB) e a fonte da verdade do progresso.
-- As demais tabelas sao derivadas, usadas para consultas e ranking.
--
-- COMO RODAR:
-- 1) Abra o Supabase Dashboard -> SQL Editor
-- 2) Cole TODO este arquivo
-- 3) Clique em "Run"
-- =====================================================================

-- Remove tabelas antigas/desalinhadas (estavam vazias)
DROP TABLE IF EXISTS users, user_progress, completed_exams, quiz_scores, recent_activity CASCADE;
DROP TABLE IF EXISTS completed_chapters, study_notes, favorites, sermons CASCADE;
DROP TABLE IF EXISTS study_progress, profiles, app_users CASCADE;

-- Usuarios do app (login por e-mail/senha, senha guardada como hash SHA-256)
CREATE TABLE app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progresso completo do usuario (fonte da verdade)
CREATE TABLE study_progress (
  user_id UUID PRIMARY KEY,
  payload JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Capitulos concluidos (derivado, para consultas)
CREATE TABLE completed_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  book_id TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id, chapter)
);

-- Anotacoes de estudo (derivado)
CREATE TABLE study_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  note_key TEXT NOT NULL,
  book_id TEXT,
  chapter INTEGER,
  content TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, note_key)
);

-- Versiculos favoritos (derivado)
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  verse_ref TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, verse_ref)
);

-- Pregacoes (derivado)
CREATE TABLE sermons (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT,
  theme TEXT,
  verse TEXT,
  intro TEXT,
  topics TEXT,
  conclusion TEXT,
  application TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para performance
CREATE INDEX IF NOT EXISTS idx_completed_chapters_user ON completed_chapters(user_id);
CREATE INDEX IF NOT EXISTS idx_study_notes_user ON study_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_sermons_user ON sermons(user_id);

-- =====================================================================
-- Politicas de acesso publico (RLS)
-- O app usa autenticacao customizada (sem auth.uid()), entao precisamos
-- liberar leitura/escrita anonima. Senhas sao guardadas como hash.
-- =====================================================================

-- Habilita RLS e cria politicas permissivas (mais limpo que desabilitar RLS)
ALTER TABLE app_users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_progress    ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_notes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites         ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons           ENABLE ROW LEVEL SECURITY;

-- Remove politicas antigas (idempotente)
DROP POLICY IF EXISTS "permitir tudo" ON app_users;
DROP POLICY IF EXISTS "permitir tudo" ON study_progress;
DROP POLICY IF EXISTS "permitir tudo" ON completed_chapters;
DROP POLICY IF EXISTS "permitir tudo" ON study_notes;
DROP POLICY IF EXISTS "permitir tudo" ON favorites;
DROP POLICY IF EXISTS "permitir tudo" ON sermons;

-- Politicas permissivas (qualquer pessoa pode cadastrar/entrar/salvar)
CREATE POLICY "permitir tudo" ON app_users         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "permitir tudo" ON study_progress    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "permitir tudo" ON completed_chapters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "permitir tudo" ON study_notes       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "permitir tudo" ON favorites         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "permitir tudo" ON sermons           FOR ALL USING (true) WITH CHECK (true);
