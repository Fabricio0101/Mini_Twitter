# Design Analysis Guide — Mini Twitter
**Guia de extração e análise do design no Figma**
Antigravity — Mini Twitter
Versão 1.0 — 2025

---

## O que é este documento

Este guia instrui o agente a abrir o protótipo do Figma no browser, capturar as telas do projeto, analisar cada detalhe visual e traduzir isso em decisões de implementação seguindo rigorosamente as regras do `frontend-agent-rules.md`.

---

## Link do Protótipo

```
https://www.figma.com/proto/pKVju50nWeJM7C2ESY0Q8i/B2BIT---Processo-Seletivo?node-id=2-89&t=UoGBl4iYZwEYTtTb-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=2%3A89&show-proto-sidebar=1
```

---

## Passo a Passo — Captura das Telas

### Passo 1 — Abrir o protótipo

Abra o link acima no browser. Aguarde o Figma carregar completamente o protótipo. Você verá a **tela de Login** como ponto de entrada — ela é o `starting-point-node-id` definido na URL.

Se o Figma pedir login, use a opção **"Continue without account"** ou **"View as guest"** — o protótipo é público e não exige autenticação.

---

### Passo 2 — Capturar a tela de Login

Com a tela de Login visível e totalmente carregada:

1. Feche qualquer sidebar ou painel que esteja sobrepondo a interface (procure por um `X` ou ícone de fechar no canto)
2. Garanta que está vendo apenas o frame da interface, sem elementos do Figma ao redor cortando o layout
3. **Tire o print completo da tela de Login**
4. Salve como `screen-login.png`

O que você deve ver nesta tela: formulário de acesso com campos de e-mail e senha, botão de entrar e possivelmente um link para cadastro.

---

### Passo 3 — Navegar para a Timeline

Com o print da tela de Login salvo:

1. Clique no **botão principal da tela de Login** (o botão de entrar/continuar)
2. O protótipo irá navegar automaticamente para a próxima tela
3. Aguarde a transição terminar completamente

---

### Passo 4 — Capturar a tela de Timeline

Com a tela de Timeline visível e totalmente carregada:

1. Verifique se há scroll disponível — se houver, **capture o estado inicial** (topo da página) primeiro
2. **Tire o print completo da tela de Timeline**
3. Salve como `screen-timeline.png`
4. Se a tela tiver elementos que aparecem apenas com scroll (ex: cards de post abaixo da dobra), role a página e capture também como `screen-timeline-scroll.png`

O que você deve ver nesta tela: feed de posts, cada post com autor, conteúdo, data e interações (like), barra de busca e possivelmente um botão para criar novo post.

---

## Passo 5 — Análise das Telas

Com os prints em mãos, analise cada tela com o nível de detalhe abaixo. Para cada item, extraia o valor real observado no design — não assuma, não invente.

---

### Análise — Tela de Login

#### Layout e estrutura
- Posicionamento do formulário: centralizado, lateral esquerda, lateral direita?
- Existe imagem, ilustração ou cor de fundo na metade oposta ao formulário?
- Há logo ou nome do produto visível? Onde está posicionado?

#### Campos do formulário
- Quais campos existem? (e-mail, senha, nome, etc.)
- Os campos têm label acima ou placeholder interno?
- Há ícones dentro dos campos (ex: olho para mostrar/ocultar senha)?
- Existe campo de "lembrar de mim" (checkbox)?

#### Botões e ações
- Qual o texto exato do botão principal?
- Existe link para cadastro? Qual o texto?
- Existe opção de login social (Google, GitHub)?

#### Cores e tokens visuais
- Cor de fundo da página
- Cor de fundo do card/formulário
- Cor primária (botão principal, links, destaques)
- Cor do texto principal e secundário
- Cor de borda dos inputs
- Cor de foco dos inputs (quando clicado)

#### Tipografia
- Tamanho e peso do título principal
- Tamanho e peso dos labels
- Tamanho e peso do texto dos inputs
- Tamanho e peso do botão

#### Espaçamentos percebidos
- Gap entre os campos do formulário
- Padding interno do card/formulário
- Padding interno dos inputs e botão

---

### Análise — Tela de Timeline

#### Layout e estrutura
- Existe uma sidebar lateral? Está à esquerda ou direita?
- Existe um header/navbar fixo no topo?
- O feed ocupa a largura total ou tem uma coluna central?
- Existe área de coluna secundária (ex: sugestões, trending)?

#### Header / Navbar
- Quais elementos estão no header? (logo, busca, avatar, botões)
- O campo de busca está no header ou dentro do feed?
- Existe botão de criar novo post? Onde está? (header, sidebar, floating button?)

#### Card de Post
- Qual a estrutura de um card de post? (avatar do autor, nome, data, conteúdo, imagem, ações)
- A imagem do post ocupa largura total do card ou tem tamanho fixo?
- Quais ações existem no card? (like, comentar, compartilhar, deletar, editar)
- Os botões de editar e deletar estão visíveis ou aparecem em um menu (três pontos)?
- Como o estado de "curtido" é indicado visualmente? (cor, ícone preenchido)
- Existe contador de likes visível?

#### Cores e tokens visuais
- Cor de fundo da página (body)
- Cor de fundo dos cards de post
- Cor de borda dos cards
- Cor primária de ações (like ativo, botões)
- Cor do texto do autor (nome)
- Cor do texto de data/metadados
- Cor do texto do conteúdo do post

#### Tipografia
- Tamanho e peso do nome do autor
- Tamanho e peso da data do post
- Tamanho e peso do conteúdo do post
- Tamanho e peso dos contadores (likes)

#### Dark mode
- O design apresenta versão dark? Se sim, registrar as cores equivalentes para cada token acima

---

## Passo 6 — Mapeamento para Componentes e Shadcn

Com a análise completa, mapear cada elemento visual para a implementação correta seguindo o `frontend-agent-rules.md`.

### Tela de Login → Componentes

| Elemento visual | Componente Shadcn | Variante / Prop | Arquivo |
|---|---|---|---|
| Campo de e-mail | `<Input>` | `type="email"` | `components/auth/LoginForm.tsx` |
| Campo de senha | `<Input>` | `type="password"` | `components/auth/LoginForm.tsx` |
| Botão de entrar | `<Button>` | `[AGENTE: definir após análise]` | `components/auth/LoginForm.tsx` |
| Link para cadastro | `<Button>` | `variant="link"` | `components/auth/LoginForm.tsx` |
| Wrapper do formulário | `<Card>` + `<CardContent>` | — | `components/auth/LoginForm.tsx` |
| Label dos campos | `<Label>` | — | `components/auth/LoginForm.tsx` |
| Formulário | `<Form>` (RHF + Shadcn) | — | `components/auth/LoginForm.tsx` |

### Tela de Timeline → Componentes

| Elemento visual | Componente Shadcn | Variante / Prop | Arquivo |
|---|---|---|---|
| Card de post | `<Card>` + `<CardHeader>` + `<CardContent>` | — | `components/posts/PostCard.tsx` |
| Botão de like | `<Button>` | `variant="ghost"` | `components/posts/LikeButton.tsx` |
| Campo de busca | `<Input>` | `type="search"` | `components/posts/SearchBar.tsx` |
| Menu editar/deletar | `<DropdownMenu>` | — | `components/posts/PostActions.tsx` |
| Avatar do autor | `<Avatar>` | — | `components/posts/PostCard.tsx` |
| Botão criar post | `<Button>` | `[AGENTE: definir após análise]` | `[AGENTE: definir localização]` |
| Separador entre posts | `<Separator>` | — | `components/posts/PostList.tsx` |

> Agente: após analisar os prints, revisar esta tabela e preencher todas as células marcadas como `[AGENTE]`. Adicionar linhas para elementos não previstos aqui.

---

## Passo 7 — Definição dos Tokens de Design

Com base na análise das cores e tipografia extraídas dos prints, preencher os tokens abaixo. Estes valores devem ser configurados no `tailwind.config.ts` e no `globals.css`.

```ts
// tailwind.config.ts — extend.colors (preencher após análise)
colors: {
  primary: {
    DEFAULT: "[AGENTE: cor primária]",
    foreground: "[AGENTE: cor do texto sobre primária]",
  },
  background: "[AGENTE: cor de fundo]",
  card: {
    DEFAULT: "[AGENTE: cor de fundo dos cards]",
    foreground: "[AGENTE: cor do texto nos cards]",
  },
  border: "[AGENTE: cor de borda]",
  muted: {
    DEFAULT: "[AGENTE: cor de texto secundário/metadados]",
    foreground: "[AGENTE: cor do texto sobre muted]",
  },
}
```

```css
/* globals.css — variáveis dark mode (preencher se o design tiver versão dark) */
.dark {
  --background: [AGENTE];
  --card: [AGENTE];
  --primary: [AGENTE];
  --border: [AGENTE];
  --muted: [AGENTE];
}
```

---

## Checklist de Conclusão

Antes de iniciar qualquer código, confirmar:

- [ ] Print `screen-login.png` capturado e analisado completamente
- [ ] Print `screen-timeline.png` capturado e analisado completamente
- [ ] Tabela de componentes Shadcn preenchida sem células `[AGENTE]` em aberto
- [ ] Tokens de design definidos no `tailwind.config.ts`
- [ ] Variáveis de dark mode definidas no `globals.css` (se aplicável)
- [ ] Todos os componentes identificados batem com as regras do `frontend-agent-rules.md`
- [ ] Nenhum elemento HTML puro foi planejado — tudo via Shadcn
