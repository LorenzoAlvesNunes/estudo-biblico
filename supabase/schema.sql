create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  created_at timestamptz default now()
);

create table if not exists public.progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text,
  score integer not null default 0,
  xp integer not null default 0,
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text not null,
  content text not null,
  updated_at timestamptz default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text,
  verse_ref text,
  created_at timestamptz default now()
);

create table if not exists public.streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak integer not null default 0,
  best_streak integer not null default 0,
  last_activity_date date
);

create table if not exists public.devotional_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  devotional_date date not null default current_date,
  reflection text,
  prayer text,
  created_at timestamptz default now()
);

create table if not exists public.completed_books (
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text not null,
  completed_at timestamptz default now(),
  primary key (user_id, book_id)
);

alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.quizzes enable row level security;
alter table public.notes enable row level security;
alter table public.favorites enable row level security;
alter table public.streaks enable row level security;
alter table public.devotional_history enable row level security;
alter table public.completed_books enable row level security;

create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users own progress" on public.progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own quizzes" on public.quizzes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own notes" on public.notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own favorites" on public.favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own streaks" on public.streaks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own devotionals" on public.devotional_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own completed books" on public.completed_books for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
