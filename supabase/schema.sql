-- =====================================================================
-- Lumen Scriptura - schema alinhado ao codigo (schema public)
-- Autenticacao e feita pelo Supabase Auth (auth.users).
-- study_progress.payload (JSONB) e a fonte da verdade do progresso.
-- As demais tabelas sao derivadas, usadas para consultas e ranking.
-- =====================================================================

-- Remove tabelas antigas/desalinhadas (estavam vazias)
DROP TABLE IF EXISTS users, user_progress, completed_exams, quiz_scores, recent_activity CASCADE;
DROP TABLE IF EXISTS completed_chapters, study_notes, favorites, sermons CASCADE;
DROP TABLE IF EXISTS study_progress, profiles CASCADE;

-- Perfil do usuario (espelha auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  name TEXT,
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

CREATE INDEX IF NOT EXISTS idx_completed_chapters_user ON completed_chapters(user_id);
CREATE INDEX IF NOT EXISTS idx_study_notes_user ON study_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_sermons_user ON sermons(user_id);
