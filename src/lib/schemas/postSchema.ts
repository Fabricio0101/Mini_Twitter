import { z } from "zod";

/**
 * Schema de validação para criação/edição de posts.
 *
 * Nota: O requisito original menciona "validar se a imagem não ultrapassa 5MB
 * antes do upload". Porém, a API aceita a imagem como URL (string), não como
 * upload de arquivo. Portanto, a validação de tamanho de arquivo não se aplica
 * neste contexto. Caso a API passe a aceitar upload, basta adicionar validação
 * de `File.size` no formulário.
 */
export const postSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  image: z.string().url("URL da imagem inválida").optional().or(z.literal("")),
});

export type PostFormData = z.infer<typeof postSchema>;

