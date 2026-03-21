"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginFormData } from "@/lib/schemas/loginSchema";
import { useLogin } from "@/lib/hooks/useAuth";
import type { AxiosError } from "axios";
import type { ApiError } from "@/lib/types/api";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onError: (error) => {
        const axiosError = error as AxiosError<ApiError>;
        if (axiosError.response?.status === 401) {
          toast.error("E-mail ou senha incorretos");
        } else {
          toast.error("Erro ao fazer login. Tente novamente.");
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-brand">Olá, de novo!</h2>
        <p className="text-sm text-muted-foreground">
          Por favor, insira os seus dados para fazer login.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="login-email" className="text-xs font-normal text-muted-foreground">
          E-mail
        </Label>
        <div className="relative">
          <Input
            id="login-email"
            type="email"
            placeholder="Insira o seu e-mail"
            aria-invalid={!!errors.email}
            className="h-12 rounded-md border-border/70 bg-input pr-12 text-sm placeholder:text-muted-foreground/60"
            {...register("email")}
          />
          <Mail className="absolute right-4 top-1/2 -translate-y-1/2 size-[18px] text-muted-foreground/50" />
        </div>
        {errors.email && (
          <p role="alert" className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="login-password" className="text-xs font-normal text-muted-foreground">
          Senha
        </Label>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="Insira a sua senha"
            aria-invalid={!!errors.password}
            className="h-12 rounded-md border-border/70 bg-input pr-12 text-sm placeholder:text-muted-foreground/60"
            {...register("password")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 size-8 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="size-[18px] text-muted-foreground/50" />
            ) : (
              <Eye className="size-[18px] text-muted-foreground/50" />
            )}
          </Button>
        </div>
        {errors.password && (
          <p role="alert" className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full rounded-full bg-brand text-brand-foreground hover:bg-brand-hover h-12 text-base font-semibold shadow-md shadow-brand/25 disabled:opacity-70"
      >
        {loginMutation.isPending ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Entrando...
          </>
        ) : (
          "Continuar"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground leading-relaxed">
        Ao clicar em continuar, você concorda com nossos{" "}
        <span className="underline underline-offset-2">
          Termos de Serviço e Política de Privacidade
        </span>
        .
      </p>
    </form>
  );
}
