create schema if not exists bible_app;

grant usage on schema bible_app to anon, authenticated;

create table if not exists bible_app.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  created_at timestamptz default now()
);

create table if not exists bible_app.study_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists bible_app.study_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  note_key text not null,
  book_id text,
  chapter integer,
  content text not null,
  updated_at timestamptz default now(),
  unique (user_id, note_key)
);

create table if not exists bible_app.quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text,
  chapter integer,
  score integer not null default 0,
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists bible_app.sermons (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  theme text,
  verse text,
  intro text,
  topics text,
  conclusion text,
  application text,
  updated_at timestamptz default now()
);

create table if not exists bible_app.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text,
  chapter integer,
  verse_ref text,
  created_at timestamptz default now(),
  unique (user_id, verse_ref)
);

create table if not exists bible_app.devotional_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  devotional_date date not null default current_date,
  reflection text,
  prayer text,
  created_at timestamptz default now()
);

create table if not exists bible_app.completed_chapters (
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text not null,
  chapter integer not null,
  completed_at timestamptz default now(),
  primary key (user_id, book_id, chapter)
);

alter table bible_app.profiles enable row level security;
alter table bible_app.study_progress enable row level security;
alter table bible_app.study_notes enable row level security;
alter table bible_app.quizzes enable row level security;
alter table bible_app.sermons enable row level security;
alter table bible_app.favorites enable row level security;
alter table bible_app.devotional_history enable row level security;
alter table bible_app.completed_chapters enable row level security;

create policy "own profile" on bible_app.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own study progress" on bible_app.study_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own notes" on bible_app.study_notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own quizzes" on bible_app.quizzes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own sermons" on bible_app.sermons for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own favorites" on bible_app.favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own devotionals" on bible_app.devotional_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own completed chapters" on bible_app.completed_chapters for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant select, insert, update, delete on all tables in schema bible_app to authenticated;
grant usage on all sequences in schema bible_app to authenticated;
