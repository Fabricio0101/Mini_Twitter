# API Contract — Mini Twitter
**Mapeamento completo dos endpoints da API (baseado no backend real)**
Antigravity — Mini Twitter
Versão 1.1 — 2025

---

## Configuração Base

```
BASE_URL: process.env.NEXT_PUBLIC_API_URL (padrão: http://localhost:3000)
Content-Type: application/json
Authorization: Bearer <token>  (endpoints autenticados)
```

A instância do Axios em `lib/api/axios.ts` injeta o token automaticamente via interceptor. Nenhum endpoint autenticado deve passar o header manualmente nos hooks.

---

## Autenticação

### POST /auth/register

Cadastro de novo usuário.

**Autenticado:** não

**Request body:**
```json
{
  "name": "string (min 2 caracteres)",
  "email": "string (format email)",
  "password": "string (min 4 caracteres)"
}
```

**Response 201:**
```json
{
  "id": "number",
  "name": "string",
  "email": "string"
}
```

**Erros esperados:**

| Status | Motivo | Comportamento no frontend |
|---|---|---|
| 400 | E-mail já cadastrado ou dados inválidos | Exibir mensagem "E-mail já está em uso" |
| 400 (VALIDATION) | Campos inválidos (TypeBox) | Backend retorna `{ error, message, details: [{ field, message }] }` |

---

### POST /auth/login

Login de usuário existente.

**Autenticado:** não

**Request body:**
```json
{
  "email": "string (format email)",
  "password": "string"
}
```

**Response 200:**
```json
{
  "token": "string",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string"
  }
}
```

**Ação após sucesso:** salvar `token` e `user` no `authStore` (Zustand) e redirecionar para `/`.

**Erros esperados:**

| Status | Motivo | Comportamento no frontend |
|---|---|---|
| 401 | Credenciais inválidas | Exibir "E-mail ou senha incorretos" |

---

### POST /auth/logout

Encerra a sessão do usuário. Insere o token na blacklist do backend.

**Autenticado:** sim

**Request body:** vazio

**Response 200:**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso. Token invalidado."
}
```

**Ação após sucesso:** limpar `authStore` e redirecionar para `/login`.

---

## Posts

### GET /posts

Listagem paginada de posts. Disponível para usuários não autenticados.

**Autenticado:** não

**Query params:**

| Param | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| page | string | não | Número da página (default: 1) |
| search | string | não | Filtra posts por título (LIKE no campo title apenas) |

**Response 200:**
```json
{
  "posts": [
    {
      "id": "number",
      "title": "string",
      "content": "string",
      "image": "string | null",
      "authorId": "number",
      "createdAt": "string (ISO 8601)",
      "authorName": "string",
      "likesCount": "number"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number (fixo em 10)"
}
```

**Observações:**
- O campo `limit` é fixo em 10 (hardcoded no backend), não aceita query param `limit`
- NÃO retorna `likedByMe` na listagem (o backend não faz join com a tabela de likes por usuário)
- NÃO retorna `hasNextPage`; o frontend deve calcular: `page * limit < total`
- O campo de imagem se chama `image`, NÃO `imageUrl`
- O campo do autor vem como `authorName` (string flat), NÃO como objeto `author: { id, name }`
- Busca filtra apenas por título, não por conteúdo
- Usar debounce de 300ms no frontend para o campo `search`

---

### POST /posts

Criação de novo post.

**Autenticado:** sim

**Request body:**
```json
{
  "title": "string (min 3 caracteres)",
  "content": "string (min 1 caractere)",
  "image": "string | null (opcional)"
}
```

**Validação frontend (Zod) antes de enviar:**
- `title`: obrigatório, mínimo 3 caracteres
- `content`: obrigatório, mínimo 1 caractere
- `image`: opcional, deve ser URL válida ou base64, máximo 5MB

**Response 201 (campos raw do DB via RETURNING *):**
```json
{
  "id": "number",
  "title": "string",
  "content": "string",
  "image": "string | null",
  "authorId": "number",
  "createdAt": "string"
}
```

**Ação após sucesso:** invalidar a query de listagem (`queryClient.invalidateQueries(["posts"])`).

---

### PUT /posts/:id

Edição de post próprio. Usa **PUT** (todos os campos são obrigatórios).

**Autenticado:** sim

**Request body (todos os campos obrigatórios):**
```json
{
  "title": "string (min 3 caracteres)",
  "content": "string (min 1 caractere)",
  "image": "string | null (opcional)"
}
```

**Response 200:**
```json
{
  "success": true
}
```

**Erros esperados:**

| Status | Motivo | Comportamento no frontend |
|---|---|---|
| 403 | Usuário não é o autor | Exibir "Você não tem permissão para editar este post" |
| 404 | Post não encontrado | Exibir erro ou redirecionar |

---

### DELETE /posts/:id

Exclusão de post próprio.

**Autenticado:** sim

**Response 200:**
```json
{
  "success": true
}
```

**Ação após sucesso:** remover o post da lista localmente (`queryClient.invalidateQueries(["posts"])`).

**Erros esperados:**

| Status | Motivo | Comportamento no frontend |
|---|---|---|
| 403 | Usuário não é o autor | Exibir "Você não tem permissão para excluir este post" |
| 404 | Post não encontrado | Exibir erro ou redirecionar |

---

## Interação Social

### POST /posts/:id/like

Toggle de like. Se o usuário já curtiu, remove o like. Se não curtiu, adiciona.

**Autenticado:** sim

**Request body:** vazio

**Response 200:**
```json
{
  "liked": "boolean"
}
```

**Comportamento no frontend:**
- `liked: true` significa que o like foi adicionado
- `liked: false` significa que o like foi removido
- Aplicar **optimistic update**: atualizar `liked` e `likesCount` (incrementar/decrementar) localmente antes da resposta
- Em caso de erro, reverter para o estado anterior
- Usar `useMutation` com `onMutate`, `onError` e `onSettled` do TanStack Query

---

## Tipos TypeScript

Centralizar todos os tipos em `lib/types/`:

```
lib/
└── types/
    ├── post.ts
    ├── user.ts
    └── api.ts
```

```ts
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  image: string | null;
  authorId: number;
  createdAt: string;
  authorName: string;
  likesCount: number;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}

export interface LikeResponse {
  liked: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface ApiError {
  error: string;
  message?: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}
```

---

## Tratamento de Erros Global

O interceptor do Axios em `lib/api/axios.ts` deve tratar:

| Status | Ação global |
|---|---|
| 401 | Limpar authStore e redirecionar para `/login` |
| 403 | Lançar erro para o hook tratar localmente |
| 404 | Lançar erro para o hook tratar localmente |
| 500+ | Exibir toast genérico "Erro interno, tente novamente" |

Erros 403 e 404 **não** devem ser tratados globalmente; cada hook decide o que fazer com eles.

---

## Rota Inexistente no Backend

> [!WARNING]
> O endpoint `GET /posts/:id` (busca de post individual por ID) **NÃO existe** como rota HTTP no backend.
> O backend possui apenas um método interno `PostService.getById()` usado para validações internas (edição, exclusão, like).
> Se o frontend precisar de uma página de detalhe do post, deve usar os dados já carregados da listagem ou rever com o time se essa rota será adicionada.
