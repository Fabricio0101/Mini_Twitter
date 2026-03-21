import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z.string().min(4, "Senha deve ter no mínimo 4 caracteres"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
