-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de progresso do usuário
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  studied_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tabela de capítulos completados
CREATE TABLE IF NOT EXISTS completed_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id VARCHAR(255) NOT NULL,
  chapter INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, book_id, chapter)
);

-- Tabela de anotações
CREATE TABLE IF NOT EXISTS study_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note_key VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, note_key)
);

-- Tabela de versículos favoritos
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  verse_ref VARCHAR(255) NOT NULL,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, verse_ref)
);

-- Tabela de sermões
CREATE TABLE IF NOT EXISTS sermons (
  id VARCHAR(255) PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  theme VARCHAR(255),
  verse VARCHAR(255),
  intro TEXT,
  topics TEXT,
  conclusion TEXT,
  application TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de quizzes respondidos
CREATE TABLE IF NOT EXISTS quiz_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id VARCHAR(255) NOT NULL,
  chapter INTEGER NOT NULL,
  score INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de exames completados
CREATE TABLE IF NOT EXISTS completed_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exam_id VARCHAR(255) NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, exam_id)
);

-- Tabela de atividade recente
CREATE TABLE IF NOT EXISTS recent_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity VARCHAR(255) NOT NULL,
  book_id VARCHAR(255),
  chapter INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
