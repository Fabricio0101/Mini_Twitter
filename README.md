# 🐦 Mini Twitter

Plataforma de microblogging construída com **React**, **Next.js** e **TypeScript**. Permite criar posts, curtir, buscar conteúdo e interagir com outros usuários em tempo real.

> Desafio técnico para vaga de Desenvolvedor Front-end — **B2BIT**

## ✨ Funcionalidades

- **Autenticação completa** — Registro, login e logout com JWT
- **Timeline com scroll infinito** — Posts carregados automaticamente ao rolar
- **CRUD de posts** — Criar, editar e excluir posts (apenas os próprios)
- **Upload de imagem via URL** — Suporte a imagens nos posts
- **Busca de posts** — Pesquisa com debounce em tempo real
- **Curtir/Descurtir** — Com optimistic update e rollback em caso de erro
- **Modo Dark/Light** — Alternância de tema persistida
- **Proteção de rotas** — Middleware server-side com cookies

## 🛠️ Tecnologias

| Tecnologia | Uso no Projeto |
|---|---|
| **React 19** + **Next.js 16** | Framework principal, App Router com route groups |
| **TypeScript** | Tipagem forte em todo o projeto |
| **Axios** | Requisições HTTP com interceptors (auth + 401 redirect) |
| **TanStack Query** | Cache, infinite queries, optimistic updates |
| **React Hook Form** + **Zod** | Formulários com validação declarativa |
| **Tailwind CSS v4** | Design system com custom properties (oklch) |
| **Zustand** | Estado global (auth, likes, tema) com persistência |
| **Framer Motion** | Animações de transição nos formulários |
| **Vitest** + **Testing Library** | Testes unitários de componentes |
| **Playwright** | Testes E2E (auth + posts) |

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── (app)/           # Rotas autenticadas (timeline)
│   ├── (auth)/          # Rotas públicas (login, registro)
│   ├── globals.css      # Design tokens (light + dark)
│   ├── layout.tsx       # Root layout com font e metadata
│   └── providers.tsx    # QueryClient, Theme, ErrorBoundary
├── components/
│   ├── auth/            # LoginForm, RegisterForm, AuthShell
│   ├── header/          # Header com SearchBar, NavUser, ThemeToggle
│   ├── posts/           # PostCard, PostForm, PostList, LikeButton, etc.
│   └── ui/              # Componentes base (shadcn/ui)
├── lib/
│   ├── api/             # Configuração do Axios com interceptors
│   ├── hooks/           # Custom hooks (useAuth, usePosts, useLike, etc.)
│   ├── schemas/         # Schemas Zod para validação
│   ├── store/           # Stores Zustand (auth, likes, theme)
│   └── types/           # Interfaces TypeScript
└── proxy.ts             # Middleware de proteção de rotas (SSR)
```

## 🚀 Como Rodar

### Pré-requisitos

- Node.js 18+
- Backend do Mini Twitter rodando ([instruções no repositório do backend](./mini-twitter-backend-main))

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd mini-twitter

# Instale as dependências
npm install

# Configure o ambiente
cp .env.example .env.local
# Edite .env.local com a URL do backend (ex: NEXT_PUBLIC_API_URL=http://localhost:3000)

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3001`.

## 🧪 Testes

```bash
# Testes unitários
npx vitest run

# Testes E2E (requer backend rodando)
npx playwright test
```

## 🏗️ Decisões Técnicas

### Optimistic Updates no Like

O `useLike` hook implementa optimistic updates: ao clicar no coração, o estado visual atualiza **imediatamente** (sem esperar a resposta do servidor). Em caso de erro, faz rollback automático para o estado anterior. Isso melhora drasticamente a percepção de velocidade.

### Zustand vs Context API

Optei pelo Zustand por ser mais performático que o Context API (não causa re-renders desnecessários) e por oferecer persistência nativa via middleware `persist` — usado no `authStore` para manter a sessão entre reloads.

### Dupla Persistência do Token (localStorage + Cookie)

O token é salvo tanto via Zustand persist (localStorage, para uso client-side) quanto em cookie (para uso no middleware Next.js server-side). O middleware `proxy.ts` lê o cookie para proteger rotas **antes** do React sequer carregar, prevenindo flash de conteúdo não autorizado.

### Lazy Loading de Dialogs

Os componentes `PostEditDialog` e `DeletePostDialog` são carregados via `React.lazy()` com `Suspense`, reduzindo o bundle inicial — esses modais só são importados quando o usuário realmente abre o dropdown de ações.

### Imagem como URL

A API aceita a imagem como URL (string), não como upload de arquivo. Por isso, a validação de tamanho de arquivo (5MB) não se aplica neste contexto. A validação no schema garante apenas que é uma URL válida.
