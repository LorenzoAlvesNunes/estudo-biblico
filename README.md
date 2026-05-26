# Lumen Scriptura

Plataforma premium de estudo biblico profundo com login, progresso individual, quizzes, devocionais, notas, favoritos, gamificacao e IA biblica.

## Stack

- Next.js + React + TypeScript
- TailwindCSS
- Framer Motion
- GSAP + ScrollTrigger
- Supabase Auth + PostgreSQL + RLS
- Export estatico pronto para GitHub Pages, Netlify, Firebase e Vercel

## Login demo

O app aceita um usuario demo local para testar sem configurar Supabase:

```txt
Email: Lorenzoalzeny.com
Senha: Bela1980@
```

Esse usuario inicia zerado: sem progresso, notas, favoritos, quizzes ou livros concluidos.

Para producao real com Supabase Auth, use emails validos no formato `nome@dominio.com`.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra `http://127.0.0.1:3000`.

## Supabase

Copie `.env.example` para `.env.local` e preencha:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
```

Depois execute o SQL em `supabase/schema.sql` no SQL Editor do Supabase. Ele cria:

- profiles
- progress
- quizzes
- notes
- favorites
- streaks
- devotional_history
- completed_books

Todas as tabelas principais usam Row Level Security para isolar dados por `auth.uid()`.

## Deploy

### Vercel

1. Importe o repositorio no Vercel.
2. Framework: Next.js.
3. Build command: `npm run build`.
4. Output directory: `out`.
5. Configure as variaveis `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `NEXT_PUBLIC_SITE_URL`.

### GitHub Pages

O workflow `.github/workflows/deploy-pages.yml` publica a pasta `out` quando houver push na branch `main`.

## Estrutura

- `src/app`: App Router do Next
- `src/components/platform`: experiencia principal do app
- `src/data`: catalogo dos 66 livros
- `src/lib`: auth, persistencia, Supabase e regras de aprendizado
- `src/styles`: Tailwind e estilos globais
- `supabase/schema.sql`: banco e politicas RLS
