"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useChangePassword } from "@/lib/hooks/useProfile";

interface PasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export function SecurityTab() {
  const changePassword = useChangePassword();
  const { register, handleSubmit, reset, watch } = useForm<PasswordFormData>();

  const onSubmit = (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) return;
    changePassword.mutate(data, {
      onSuccess: () => reset(),
    });
  };

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");
  const passwordsMatch = !confirmPassword || newPassword === confirmPassword;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Segurança</CardTitle>
        <CardDescription>Altere sua senha de acesso.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="new-password">Nova senha</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Digite a nova senha"
              {...register("newPassword", { required: true, minLength: 4 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar nova senha</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Repita a nova senha"
              {...register("confirmPassword", { required: true, minLength: 4 })}
            />
            {!passwordsMatch && (
              <p className="text-xs text-destructive">As senhas não coincidem</p>
            )}
          </div>
          <Button type="submit" disabled={changePassword.isPending || !passwordsMatch}>
            {changePassword.isPending && <Loader2 className="size-4 animate-spin" />}
            Alterar senha
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
