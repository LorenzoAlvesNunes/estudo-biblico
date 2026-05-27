# Lumen Scriptura

Plataforma premium de estudo biblico profundo com login, progresso individual, quizzes, devocionais, notas, favoritos, gamificacao e IA biblica.

## Experiencia atual

- Dashboard com progresso geral, XP, streak, quizzes e provas.
- Biblioteca separada por Antigo Testamento e Novo Testamento.
- Curso por livro e capitulo, com leitura guiada, explicacao, insights, conexoes com Jesus e aplicacao.
- Sidebar de capitulos com progresso visual.
- Painel de anotacoes auto-salvas, favoritos e versiculos marcados.
- Quiz automatico depois de marcar um capitulo como lido.
- Prova por blocos de capitulos.
- Aba `Estudo Biblico` para perguntas e explicacoes organizadas.
- Aba `Pregacoes` para criar e salvar esbocos.

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

Depois execute o SQL em `supabase/schema.sql` no SQL Editor do Supabase. Ele cria o schema separado `bible_app`, para nao misturar com tabelas do Nexa-OS:

- bible_app.profiles
- bible_app.study_progress
- bible_app.study_notes
- bible_app.quizzes
- bible_app.sermons
- bible_app.favorites
- bible_app.devotional_history
- bible_app.completed_chapters

Todas as tabelas principais usam Row Level Security para isolar dados por `auth.uid()`.

O app salva no Supabase quando:

1. `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estao configuradas no build.
2. O usuario entra por Supabase Auth, nao pelo usuario demo local.
3. O SQL de `supabase/schema.sql` ja foi executado.

O usuario demo salva apenas no navegador, porque nao existe sessao `auth.uid()` real para passar pelas regras RLS.

## Deploy

### Vercel

1. Importe o repositorio no Vercel.
2. Framework: Next.js.
3. Build command: `npm run build`.
4. Output directory: `out`.
5. Configure as variaveis `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `NEXT_PUBLIC_SITE_URL`.

### GitHub Pages

O workflow `.github/workflows/deploy-pages.yml` publica a pasta `out` quando houver push na branch `main`.

Para o GitHub Pages gravar no Supabase, crie estes secrets no repositorio em `Settings > Secrets and variables > Actions`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Estrutura

- `src/app`: App Router do Next
- `src/components/platform`: experiencia principal do app
- `src/data`: catalogo dos 66 livros
- `src/lib`: auth, persistencia, Supabase e regras de aprendizado
- `src/styles`: Tailwind e estilos globais
- `supabase/schema.sql`: banco e politicas RLS
