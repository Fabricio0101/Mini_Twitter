# Project Orchestrator — Mini Twitter
**Documento central de contexto e comunicação entre agentes**
Antigravity — Mini Twitter
Versão 1.0 — 2025

---

## O que é este documento

Este é o **ponto de entrada obrigatório** para qualquer agente que atue no projeto Mini Twitter. Antes de escrever, revisar ou testar qualquer coisa, o agente deve ler este documento para entender o contexto completo do projeto, onde cada decisão está documentada e como as peças se conectam.

Nenhum agente opera de forma isolada. Toda decisão técnica tem um documento de referência. Este orquestrador indica qual documento consultar em cada situação.

---

## Mapa de Documentos do Projeto

| Documento | Caminho | Quando consultar |
|---|---|---|
| PRD | `docs/project/mini-twitter-prd.md` | Entender escopo, épicos, user stories e critérios de aceite |
| Frontend Agent | `docs/agents/frontend-agent-rules.md` | Antes de escrever qualquer código de componente, página ou hook |
| Testing Agent | `docs/agents/testing-agent-rules.md` | Antes de escrever qualquer teste unitário ou E2E |
| Code Review Agent | `docs/agents/code-review-agent-rules.md` | Ao revisar um PR ou avaliar um trecho de código |
| Responsivity Agent | `docs/agents/responsivity-agent-rules.md` | Antes de implementar qualquer layout responsivo ou componente mobile |
| API Contract | `docs/project/api-contract.md` | Antes de criar qualquer hook de requisição ou tipo TypeScript |
| Git Conventions | `docs/project/git-conventions.md` | Antes de criar branch, commitar ou abrir PR |
| Design Analysis Guide | `docs/project/design-analysis-guide.md` | Antes de criar qualquer componente — análise visual do Figma |
| **Este documento** | `docs/project-orchestrator.md` | Sempre — é o primeiro a ser lido |

> Documentos de agentes em `docs/agents/`, documentos de projeto em `docs/project/`. O orquestrador fica na raiz de `docs/`.

---

## Visão Geral do Projeto

**Nome:** Mini Twitter
**Tipo:** Aplicação web de microblogging (desafio frontend)
**Empresa:** Antigravity

### Stack frontend

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS + Shadcn/ui |
| Data Fetching | TanStack Query v5 |
| Formulários | React Hook Form + Zod |
| HTTP Client | Axios |
| Estado Global | Zustand |
| Testes Unitários | Vitest + React Testing Library |
| Testes E2E | Playwright |

### Backend

O backend é uma API REST fornecida como parte do desafio. O frontend **apenas consome** — nenhuma alteração é feita no backend.

---

## Mapeamento do Backend

> 🤖 **PROMPT PARA O AGENTE**
>
> Você tem acesso à pasta do backend deste projeto. Sua tarefa é analisar o código-fonte real e reescrever esta seção inteira com dados precisos. Siga os passos abaixo na ordem exata e substitua todo o conteúdo desta seção pelo que encontrar — sem deixar nenhum campo em branco ou marcado como `[AGENTE]`.
>
> **Passo 1 — Leia o `package.json` da pasta do backend**
> Extraia: nome do framework (Express, Fastify, NestJS, Hono, etc.), versão do Node exigida, scripts disponíveis (`dev`, `start`, `build`) e porta configurada. Procure a porta também em `.env.example` e no arquivo de entrada do servidor (`src/server.ts`, `src/main.ts` ou similar).
>
> **Passo 2 — Mapeie todas as rotas**
> Localize os arquivos de rotas (geralmente em `src/routes/`, `src/controllers/`, `src/modules/` ou no arquivo principal). Para cada rota encontrada, extraia: método HTTP exato, caminho completo, se exige autenticação (verifique middlewares de guard/auth aplicados na rota ou no controller) e os campos exatos de body, params e query strings.
>
> **Passo 3 — Leia os schemas e models**
> Localize os arquivos de schema (Prisma `schema.prisma`, Zod schemas, TypeORM entities, Mongoose models, etc.). Para cada entidade principal (User, Post e qualquer outra relevante), extraia os campos com seus tipos exatos. Estes tipos serão transcritos para `lib/types/` no frontend.
>
> **Passo 4 — Reescreva as seções abaixo com dados reais**
> Substitua todos os campos marcados como `[AGENTE]` pelos valores reais encontrados. Não deixe nenhum campo em aberto. Se uma rota não existir no backend (ex: logout é apenas client-side), registre isso explicitamente.
>
> **Passo 5 — Compare com o `api-contract.md` e atualize**
> Abra `docs/project/api-contract.md`. Compare cada endpoint, tipo e comportamento documentado lá com o que você encontrou no backend real. Para cada divergência: registre na tabela de divergências abaixo e corrija o `api-contract.md` imediatamente. O `api-contract.md` deve sempre refletir o backend real após este passo.

---

### Framework e execução

```
Framework:      [AGENTE: preencher com base no package.json]
Versão Node:    [AGENTE: preencher — checar campo "engines" ou .nvmrc]
Comando dev:    [AGENTE: preencher — checar scripts no package.json]
Comando build:  [AGENTE: preencher]
Porta padrão:   [AGENTE: preencher — checar .env.example e arquivo de entrada]
BASE_URL local: http://localhost:[AGENTE: porta]
Variável frontend: NEXT_PUBLIC_API_URL=http://localhost:[AGENTE: porta]
```

---

### Endpoints mapeados

> Agente: listar todos os endpoints encontrados no código-fonte. Não omitir nenhuma rota. Anotar na coluna Observações os campos exatos de body/query, comportamento de toggle, formato do token, paginação real, etc.

#### Autenticação

| Método | Rota | Autenticado | Observações |
|---|---|---|---|
| [AGENTE] | [AGENTE] | [AGENTE] | [AGENTE] |

#### Posts

| Método | Rota | Autenticado | Observações |
|---|---|---|---|
| [AGENTE] | [AGENTE] | [AGENTE] | [AGENTE] |

#### Interação Social

| Método | Rota | Autenticado | Observações |
|---|---|---|---|
| [AGENTE] | [AGENTE] | [AGENTE] | [AGENTE] |

---

### Tipos reais das entidades

> Agente: extrair dos schemas do backend os campos e tipos exatos de cada entidade. Transcrever para TypeScript como serão usados no frontend em `lib/types/`.

#### User
```ts
// [AGENTE: preencher com os campos reais do schema de User]
export interface User {

}
```

#### Post
```ts
// [AGENTE: preencher com os campos reais do schema de Post]
export interface Post {

}
```

---

### Divergências encontradas com o API Contract

> Agente: após comparar o backend real com o `api-contract.md`, listar cada diferença abaixo. Para cada linha desta tabela, o `api-contract.md` deve ter sido atualizado antes de você terminar.

| Endpoint | Divergência encontrada | Ação tomada |
|---|---|---|
| [AGENTE] | [AGENTE] | [AGENTE] |

---

## Regras de Ouro do Projeto

Estas regras valem para todos os agentes, em todas as situações, sem exceção:

1. **Páginas são orquestradores** — nenhum componente, nenhum `"use client"`, nenhuma lógica de UI em `app/**/page.tsx`
2. **Zero comentários** — o código é autoexplicativo pelos nomes
3. **Requisições apenas em hooks** — nunca em componentes ou páginas
4. **Sempre Shadcn** — nunca `<button>`, `<input>`, `<section>` ou `<form>` HTML puro
5. **Variantes antes de className** — usar as props nativas do Shadcn antes de sobrescrever
6. **Arrays com 3+ itens em `lib/utils/`** — nunca inline no componente
7. **TypeScript estrito** — zero `any`, tipos centralizados em `lib/types/`
8. **API Contract é a fonte da verdade** — após o agente mapear o backend, o `api-contract.md` é atualizado e passa a ser a referência absoluta

---

## Fluxo de Trabalho por Situação

### "Vou implementar uma nova feature"
1. Ler a user story no **PRD** (`mini-twitter-prd.md`)
2. Verificar o endpoint correspondente no **API Contract** (`api-contract.md`)
3. Seguir as regras do **Frontend Agent** (`frontend-agent-rules.md`)
4. Criar branch seguindo o **Git Conventions** (`git-conventions.md`)

### "Vou escrever testes"
1. Ler a cobertura mínima esperada no **Testing Agent** (`testing-agent-rules.md`)
2. Verificar os critérios de aceite da feature no **PRD**
3. Seguir nomenclatura e estrutura do **Testing Agent**

### "Vou revisar um PR"
1. Usar o checklist do **Code Review Agent** (`code-review-agent-rules.md`)
2. Verificar se o código está alinhado com as regras do **Frontend Agent**
3. Confirmar que os endpoints usados batem com o **API Contract**

### "Vou criar um hook de requisição"
1. Verificar o contrato exato do endpoint no **API Contract** (`api-contract.md`)
2. Confirmar os tipos em `lib/types/` — criar se não existirem
3. Seguir a estrutura de hooks do **Frontend Agent**

### "Encontrei uma divergência entre o backend real e o API Contract"
1. Registrar na tabela de **Divergências** deste documento
2. Atualizar o `api-contract.md` imediatamente
3. Verificar se algum hook ou tipo já implementado precisa ser ajustado

---

## Status das Sprints

> Atualizar conforme o projeto avança.

| Sprint | Status | Período | Tasks concluídas |
|---|---|---|---|
| Sprint 1 — Autenticação | `[ ] Não iniciada` | `[preencher]` | 0 / 8 |
| Sprint 2 — Timeline e Posts | `[ ] Não iniciada` | `[preencher]` | 0 / 6 |
| Sprint 3 — Edição, Exclusão e Likes | `[ ] Não iniciada` | `[preencher]` | 0 / 6 |
| Sprint 4 — Extras e Qualidade | `[ ] Não iniciada` | `[preencher]` | 0 / 6 |

---

## Checklist de Setup Inicial

Antes de escrever a primeira linha de código:

- [ ] Agente executou o **Mapeamento do Backend** acima e preencheu todos os campos
- [ ] `api-contract.md` atualizado pelo agente com os dados reais do backend
- [ ] `NEXT_PUBLIC_API_URL` configurado no `.env.local` do frontend
- [ ] Next.js 16 instalado e rodando (`npm run dev`)
- [ ] Shadcn/ui inicializado (`npx shadcn@latest init`)
- [ ] Zustand, TanStack Query, React Hook Form, Zod e Axios instalados
- [ ] Vitest e Playwright configurados
- [ ] Design Analysis Guide executado — prints capturados e tokens definidos
- [ ] Estrutura de pastas criada conforme `frontend-agent-rules.md`
- [ ] Todos os documentos de `docs/` commitados no repositório

---

## "Vou implementar a UI de uma tela"
1. Abrir o **Design Analysis Guide** (`design-analysis-guide.md`) e executar os passos de captura e análise
2. Preencher a tabela de componentes Shadcn e os tokens de design
3. Seguir as regras do **Frontend Agent** (`frontend-agent-rules.md`) ao codar
