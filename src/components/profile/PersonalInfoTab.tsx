"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile, useUpdateProfile } from "@/lib/hooks/useProfile";
import { maritalStatusOptions } from "@/lib/utils/profile";

interface ProfileFormData {
  name: string;
  bio: string;
  location: string;
  phone: string;
  address: string;
  state: string;
  zipCode: string;
  maritalStatus: string;
}

export function PersonalInfoTab() {
  const { data: user, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm<ProfileFormData>();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        bio: user.bio || "",
        location: user.location || "",
        phone: user.phone || "",
        address: user.address || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        maritalStatus: user.maritalStatus || "",
      });
    }
  }, [user, reset]);

  if (isLoading || !user) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-20 w-full rounded-md" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate(data, {
      onSuccess: () => setIsEditing(false),
    });
  };

  const handleCancel = () => {
    reset({
      name: user.name,
      bio: user.bio || "",
      location: user.location || "",
      phone: user.phone || "",
      address: user.address || "",
      state: user.state || "",
      zipCode: user.zipCode || "",
      maritalStatus: user.maritalStatus || "",
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>Gerencie seus dados de perfil.</CardDescription>
        </div>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Pencil className="size-3.5" />
            Editar
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Nome</Label>
              <Input
                id="profile-name"
                disabled={!isEditing}
                {...register("name", { required: true, minLength: 2 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">E-mail</Label>
              <Input id="profile-email" type="email" defaultValue={user.email} disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-bio">Bio</Label>
            <Textarea
              id="profile-bio"
              placeholder="Conte um pouco sobre você..."
              disabled={!isEditing}
              rows={3}
              {...register("bio")}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-phone">Telefone</Label>
              <Input
                id="profile-phone"
                placeholder="(00) 00000-0000"
                disabled={!isEditing}
                {...register("phone")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-marital">Estado Civil</Label>
              <Select
                disabled={!isEditing}
                value={watch("maritalStatus") || ""}
                onValueChange={(value) => setValue("maritalStatus", value ?? "")}
              >
                <SelectTrigger id="profile-marital">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {maritalStatusOptions.map((opt) => (
                    <SelectItem key={opt.value || "empty"} value={opt.value || "none"}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-address">Endereço</Label>
            <Input
              id="profile-address"
              placeholder="Rua, número, complemento"
              disabled={!isEditing}
              {...register("address")}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-state">Estado</Label>
              <Input
                id="profile-state"
                placeholder="Ex: SP"
                disabled={!isEditing}
                {...register("state")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-zipcode">CEP</Label>
              <Input
                id="profile-zipcode"
                placeholder="00000-000"
                disabled={!isEditing}
                {...register("zipCode")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-location">Localização</Label>
            <Input
              id="profile-location"
              placeholder="Ex: São Paulo, SP"
              disabled={!isEditing}
              {...register("location")}
            />
          </div>
          {isEditing && (
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending && <Loader2 className="size-4 animate-spin" />}
                Salvar
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
