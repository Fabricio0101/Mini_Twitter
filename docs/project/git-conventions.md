# Git Conventions — Mini Twitter
**Padrões de commits, branches e fluxo de PR**
Antigravity — Mini Twitter
Versão 1.0 — 2025

---

## Commits — Conventional Commits

Todo commit segue o padrão **Conventional Commits**:

```
<tipo>(<escopo>): <descrição curta>
```

### Tipos permitidos

| Tipo | Quando usar |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `refactor` | Refatoração sem mudança de comportamento |
| `test` | Adição ou correção de testes |
| `style` | Mudanças de estilo/formatação sem lógica |
| `chore` | Configurações, dependências, build |
| `docs` | Documentação |

### Escopos recomendados

Escopos mapeiam os épicos e camadas do projeto:

`auth` | `posts` | `likes` | `ui` | `hooks` | `store` | `api` | `tests` | `config`

### Exemplos

```bash
feat(auth): adiciona formulário de registro com validação Zod
feat(posts): implementa scroll infinito na timeline
fix(likes): corrige reversão do optimistic update em caso de erro
refactor(posts): extrai PostCard para componente isolado
test(auth): adiciona testes E2E do fluxo de login
chore(config): configura Playwright para testes E2E
style(ui): ajusta espaçamentos do PostCard no mobile
```

### Regras

- Descrição em **português**, **imperativo**, **minúsculo**, **sem ponto final**
- Máximo de 72 caracteres na linha do título
- Um commit = uma mudança lógica. Nunca agrupar funcionalidades diferentes no mesmo commit

---

## Branches — Nomenclatura

```
<tipo>/<escopo>-<descricao-curta>
```

| Tipo | Quando usar |
|---|---|
| `feat/` | Nova funcionalidade |
| `fix/` | Correção de bug |
| `refactor/` | Refatoração |
| `test/` | Testes |
| `chore/` | Configurações e dependências |

### Exemplos

```bash
feat/auth-registro-login
feat/posts-timeline-paginada
feat/posts-scroll-infinito
feat/likes-optimistic-update
fix/auth-redirect-apos-logout
test/e2e-fluxo-autenticacao
chore/config-playwright
```

### Regras

- Sempre criar branch a partir de `main` atualizada
- Nunca commitar diretamente em `main`
- Nomes em **kebab-case**, **sem caracteres especiais**
- Deletar a branch após o merge do PR

---

## Fluxo de PR

### Tamanho ideal

Um PR deve cobrir **uma task** do breakdown (ex: T-05, T-12). PRs grandes dificultam revisão e aumentam chance de conflito.

Se uma task for grande (estimativa > 3h), pode ser dividida em múltiplos PRs menores com commits incrementais.

### Template de descrição do PR

```markdown
## O que foi feito
Descrição objetiva do que foi implementado.

## Task relacionada
T-XX — Descrição da task

## Como testar
1. Passo a passo para reproduzir o fluxo
2. ...

## Checklist
- [ ] Segue as regras do Frontend Agent
- [ ] Sem comentários no código
- [ ] Sem `any` no TypeScript
- [ ] Testes adicionados/atualizados
- [ ] Dark mode implementado
- [ ] Responsivo em mobile (375px)
```

### Critérios para aprovação do PR

- Passou no checklist do **Code Review Agent**
- Build sem erros (`next build`)
- Testes passando (`vitest run` + `playwright test`)
- Ao menos 1 aprovação de outro membro do time

### Merge

- Sempre usar **Squash and Merge** para manter o histórico de `main` limpo
- O título do merge commit deve seguir o padrão Conventional Commits
- Deletar a branch após o merge

---

## Referência Rápida

```bash
# Criar branch nova
git checkout main && git pull
git checkout -b feat/posts-timeline-paginada

# Commitar
git add .
git commit -m "feat(posts): implementa listagem paginada com TanStack Query"

# Subir branch
git push origin feat/posts-timeline-paginada

# Após merge — limpar local
git checkout main && git pull
git branch -d feat/posts-timeline-paginada
```
