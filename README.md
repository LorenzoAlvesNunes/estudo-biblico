# Lumen Scriptura

Plataforma moderna de estudo biblico criada com React, TailwindCSS, Framer Motion, GSAP e Supabase-ready persistence.

## Stack

- Vite + React
- TailwindCSS
- Framer Motion para transicoes e microinteracoes
- GSAP + ScrollTrigger para animacoes de scroll e parallax
- Supabase opcional para sincronizar progresso
- Fallback localStorage para progresso, favoritos, historico e notas

## Rodando localmente

```bash
npm install
npm run dev
```

Abra `http://127.0.0.1:5173`.

## Publicando para mandar aos amigos

O site e estatico depois do build, entao pode ser publicado em GitHub Pages, Vercel, Netlify ou Firebase Hosting.

### GitHub Pages

Este projeto ja inclui `.github/workflows/deploy-pages.yml`.

1. Crie um repositorio novo no GitHub.
2. Envie este projeto para a branch `main`.
3. No GitHub, va em `Settings > Pages`.
4. Em `Build and deployment`, escolha `GitHub Actions`.
5. Aguarde o workflow terminar.
6. Envie o link do GitHub Pages para seus amigos.

### Vercel

1. Suba este projeto para um repositorio no GitHub.
2. Entre em `https://vercel.com/new`.
3. Importe o repositorio.
4. Use:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Depois do deploy, envie o link gerado pela Vercel.

### Netlify

1. Suba o projeto para o GitHub.
2. Entre em `https://app.netlify.com/start`.
3. Importe o repositorio.
4. O arquivo `netlify.toml` ja configura build e redirects.
5. Envie o link final para seus amigos.

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run deploy:firebase
```

Use `dist` como pasta publica quando o Firebase perguntar.

## Compartilhamento

O app tem botao `Compartilhar` no topo. Em celulares ele usa o compartilhamento nativo; em navegadores sem suporte ele copia o link do site.

## Supabase

Copie `.env.example` para `.env` e preencha:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Tabela sugerida:

```sql
create table study_progress (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz default now()
);
```

Sem essas variaveis, a aplicacao funciona com armazenamento local.

## Estrutura

- `src/components`: componentes reutilizaveis
- `src/pages`: secoes principais da plataforma
- `src/data`: conteudo biblico e dados de demonstracao
- `src/hooks`: estado e persistencia de progresso
- `src/lib`: integracoes externas
- `src/styles`: Tailwind e estilos globais
- `public/assets`: imagem cinematografica do hero
