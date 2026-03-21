# Mini Twitter — PRD
**Product Requirements Document**
Antigravity — Desafio Frontend
Next.js 16 (App Router) + TypeScript + Tailwind CSS
Versão 1.0 — 2025

---

## 1. Visão Geral do Produto

O **Mini Twitter** é uma aplicação web de microblogging desenvolvida como desafio frontend para a Antigravity. O objetivo é construir uma aplicação com **Next.js 16 (App Router)** que permita ao usuário se cadastrar, fazer login, criar posts com imagem, interagir por meio de likes e visualizar um feed paginado de publicações.

A aplicação consome uma **API REST já fornecida** (sem necessidade de desenvolvimento de backend). O foco do desafio está na qualidade da UI, integração de dados, tipagem estrita com TypeScript e boas práticas de teste.

---

## 2. Stack Tecnológica

| Tecnologia | Categoria | Finalidade |
|---|---|---|
| Next.js 16 (App Router) | Framework | Base do projeto, roteamento, SSR/CSR |
| TypeScript | Linguagem | Tipagem estática e segurança de dados |
| Tailwind CSS | Estilização | Utilitários de CSS, responsividade, dark mode |
| TanStack Query | Data Fetching | Cache, loading state e sincronização com API |
| React Hook Form + Zod | Formulários | Controle de campos e validação de schemas |
| Axios | HTTP Client | Comunicação com a API (header Authorization) |
| Zustand | Estado Global | Armazena usuário logado e tema (dark/light) |
| Shadcn/ui | Componentes UI | Biblioteca de componentes acessíveis e estilizados com Tailwind |
| Vitest + RTL | Testes Unitários | Testa componentes isolados e lógica de negócio |
| Playwright | Testes E2E | Fluxos completos: login, post, like, logout |

### ⚠️ Atenção — Breaking Change Next.js 16

> No Next.js 16, `middleware.ts` foi **renomeado para `proxy.ts`** e a função exportada também muda de `middleware` para `proxy`. O runtime de edge **não é mais suportado** — roda apenas em Node.js. Isso impacta diretamente a task de proteção de rotas (T-07).

---

## 3. Épicos e Escopo Funcional

| Épico | Nome | User Stories |
|---|---|---|
| EP-01 | Autenticação | Registro, Login, Logout |
| EP-02 | Gestão de Posts | Timeline, Busca, Criação, Edição, Exclusão |
| EP-03 | Interação Social | Curtir e Descurtir Posts |
| EP-04 | Extras / Qualidade | Dark Mode, Scroll Infinito, Testes, Estado Global |

---

## 4. Requisitos Funcionais

### EP-01 — Autenticação e Gestão de Acesso

#### US-01: Registro de Novo Usuário
Como visitante, quero me cadastrar com nome, e-mail e senha para criar minha conta e interagir na plataforma.

- Validar formato de e-mail no frontend (Zod)
- Enviar dados para `POST /auth/register`
- Exibir mensagem de erro amigável para e-mail duplicado (Erro 400)

#### US-02: Login de Usuário
Como usuário cadastrado, quero realizar login com e-mail e senha para acessar as funcionalidades restritas.

- Armazenar token JWT no Zustand (authStore)
- Redirecionar para timeline após sucesso
- Exibir erro amigável para credenciais inválidas

#### US-03: Logout
Como usuário autenticado, quero encerrar minha sessão com segurança.

- Chamar `POST /auth/logout` com token no header
- Limpar authStore e redirecionar para login

---

### EP-02 — Gestão de Conteúdo (Posts)

#### US-04: Visualização da Timeline
Como usuário, quero visualizar uma lista paginada de posts com scroll infinito.

- Consumir `GET /posts` com suporte a paginação (`useInfiniteQuery`)
- Exibir nome do autor, título, conteúdo, data formatada e imagem
- Carregar próxima página ao atingir o fim da lista

#### US-05: Busca de Posts
Como usuário, quero pesquisar posts por termo para encontrar conteúdos específicos.

- Usar query param `?search=` na requisição
- Atualizar lista dinamicamente (debounce recomendado)

#### US-06: Criação de Post com Imagem
Como usuário autenticado, quero criar posts com título, conteúdo e imagem opcional.

- Enviar token no header `Authorization`
- Validar que imagem não ultrapassa 5MB
- Imagem enviada como URL aceita pela API

#### US-07: Edição e Exclusão de Posts Próprios
Como autor de um post, quero editar ou excluir minhas publicações.

- Exibir botões **Editar** e **Deletar** somente quando `userId === authorId`
- Tratar erro 403 para tentativas não autorizadas

---

### EP-03 — Interação Social

#### US-08: Curtir e Descurtir Posts
Como usuário autenticado, quero dar ou remover like em posts.

- Chamar `POST /posts/:id/like`
- Atualizar ícone e `likesCount` imediatamente (optimistic update)

---

### EP-04 — Extras e Qualidade

- Dark Mode com Tailwind (class strategy) + toggle persistido no themeStore
- Scroll Infinito via `useInfiniteQuery` + Intersection Observer
- Testes unitários com Vitest + React Testing Library
- Testes E2E com Playwright (auth, criação de post, like)
- Estado global com Zustand (authStore + themeStore)

---

## 5. Arquitetura de Pastas e Componentes

```
mini-twitter/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx           # Página de login
│   │   └── register/
│   │       └── page.tsx           # Página de cadastro
│   ├── (app)/
│   │   ├── layout.tsx             # Layout protegido (verifica token)
│   │   ├── page.tsx               # Timeline (feed principal)
│   │   └── posts/
│   │       └── [id]/
│   │           └── page.tsx       # Detalhe do post
│   ├── layout.tsx                 # Root layout (providers, tema)
│   └── proxy.ts                   # ⚠️ Next.js 16: era middleware.ts
├── components/
│   ├── ui/                        # Componentes genéricos reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Toast.tsx
│   ├── posts/                     # Componentes de posts
│   │   ├── PostCard.tsx
│   │   ├── PostForm.tsx
│   │   ├── PostList.tsx
│   │   └── LikeButton.tsx
│   └── auth/                      # Componentes de autenticação
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
├── lib/
│   ├── api/
│   │   └── axios.ts               # Instância Axios + interceptor de token
│   ├── hooks/
│   │   ├── usePosts.ts            # useInfiniteQuery para posts
│   │   ├── useAuth.ts             # Login/register/logout
│   │   └── useIntersection.ts     # Scroll infinito (Intersection Observer)
│   ├── store/
│   │   ├── authStore.ts           # Zustand: user, token, logout
│   │   └── themeStore.ts          # Zustand: dark/light mode
│   └── schemas/
│       ├── loginSchema.ts         # Zod: validação do formulário de login
│       ├── registerSchema.ts      # Zod: validação do cadastro
│       └── postSchema.ts          # Zod: validação de criação/edição de post
├── tests/
│   ├── unit/                      # Vitest + RTL
│   │   ├── PostCard.test.tsx
│   │   ├── LoginForm.test.tsx
│   │   └── LikeButton.test.tsx
│   └── e2e/                       # Playwright
│       ├── auth.spec.ts
│       ├── post.spec.ts
│       └── like.spec.ts
├── public/
├── next.config.ts
├── tailwind.config.ts
├── vitest.config.ts
└── playwright.config.ts
```

---

## 6. Definição de Sprints

| Sprint | Duração | Escopo |
|---|---|---|
| Sprint 1 | 1 semana | Setup do projeto, configuração de stack, autenticação completa (EP-01) |
| Sprint 2 | 1 semana | Timeline paginada, busca de posts, criação de post com imagem (EP-02 parcial) |
| Sprint 3 | 1 semana | Edição/exclusão de posts, curtir/descurtir, estado global (EP-02 final + EP-03) |
| Sprint 4 | 1 semana | Dark mode, scroll infinito, testes unitários e E2E, refinamentos finais (EP-04) |

---

## 7. Breakdown de Tasks

Estimativas em horas de desenvolvimento efetivo. **Total estimado: ~60h.**

### EP-01 — Autenticação (Sprint 1)

| ID | Descrição | Critério de Aceite | Estimativa |
|---|---|---|---|
| T-01 | Setup Next.js 16 + TypeScript + Tailwind | Projeto rodando local | 2h |
| T-02 | Configurar Axios com interceptor de token JWT | Token injetado no header automaticamente | 1h |
| T-03 | Configurar TanStack Query Provider global | QueryClient no root layout | 1h |
| T-04 | Configurar Zustand authStore (user, token, logout) | Estado persistido entre navegações | 2h |
| T-05 | Página e formulário de Register (Zod + RHF) | Validação + `POST /auth/register` | 3h |
| T-06 | Página e formulário de Login (Zod + RHF) | Token salvo no store + redirect | 3h |
| T-07 | `proxy.ts` para proteção de rotas (Next.js 16) | Redirect para `/login` se sem token | 2h |
| T-08 | Botão de Logout + `POST /auth/logout` | Token removido + redirect para login | 1h |

### EP-02 — Gestão de Posts (Sprint 2 e 3)

| ID | Descrição | Critério de Aceite | Estimativa |
|---|---|---|---|
| T-09 | Timeline: `GET /posts` com TanStack Query | Lista de posts renderizada | 3h |
| T-10 | Componente PostCard (autor, título, conteúdo, data, imagem) | Layout completo e responsivo | 3h |
| T-11 | Busca de posts via `?search=` com debounce | Lista atualiza dinamicamente | 2h |
| T-12 | Scroll infinito na timeline (`useInfiniteQuery`) | Próxima página carrega ao chegar no final | 3h |
| T-13 | Formulário de criação de post (título, conteúdo, imagem URL) | `POST /posts` com token | 3h |
| T-14 | Validação: imagem máx 5MB antes do envio | Erro amigável exibido antes da requisição | 1h |
| T-15 | Edição de post próprio (`PATCH /posts/:id`) | Somente autor vê botão Editar | 3h |
| T-16 | Exclusão de post próprio (`DELETE /posts/:id`) | Confirmação + remoção da lista | 2h |
| T-17 | Tratamento de erro 403 em ações não autorizadas | Toast/mensagem de erro exibida | 1h |

### EP-03 — Interação Social (Sprint 3)

| ID | Descrição | Critério de Aceite | Estimativa |
|---|---|---|---|
| T-18 | Botão de Like: `POST /posts/:id/like` | Ícone e contador atualizados | 2h |
| T-19 | Toggle de Like com optimistic update | UI atualiza antes da resposta da API | 2h |

### EP-04 — Extras e Qualidade (Sprint 4)

| ID | Descrição | Critério de Aceite | Estimativa |
|---|---|---|---|
| T-20 | Dark Mode com Tailwind (class strategy) + themeStore | Toggle funcional e persistido | 3h |
| T-21 | Testes unitários: PostCard, LoginForm, LikeButton | Vitest + RTL passando no CI | 4h |
| T-22 | Testes E2E: fluxo de auth (register/login/logout) | Playwright passando | 3h |
| T-23 | Testes E2E: criar post, curtir, deletar | Playwright passando | 3h |
| T-24 | Responsividade mobile (Tailwind breakpoints) | Layout ok em 375px e 1280px | 2h |
| T-25 | Ajustes finais: loading states, empty states, acessibilidade | UX refinada e sem erros no console | 3h |

---

## 8. Definition of Done (DoD)

Uma task só é considerada **concluída** quando:

- Código tipado corretamente em TypeScript (sem `any` implícito)
- Componente ou feature com teste unitário cobrindo os casos principais
- Fluxos críticos cobertos por testes E2E (auth, post, like)
- UI responsiva validada em mobile (375px) e desktop (1280px)
- Dark mode funcionando para o componente/página
- Sem erros no console em produção (`next build` sem warnings críticos)
- PR aprovado com revisão de código
