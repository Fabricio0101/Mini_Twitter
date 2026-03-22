"use client";

import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, MapPin, Camera, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile, useUpdateProfile } from "@/lib/hooks/useProfile";
import { useUploadImage } from "@/lib/hooks/useUpload";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatJoinDate(dateString?: string | null) {
  if (!dateString) return "Membro recente";
  const date = new Date(dateString);
  return `Membro desde ${date.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  })}`;
}

export function ProfileHeader() {
  const { data: user } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadImage = useUploadImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <Card className="my-4">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col items-start gap-4 md:gap-6 md:flex-row md:items-center">
            <Skeleton className="size-20 md:size-24 rounded-full" />
            <div className="flex-1 space-y-3 w-full">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isUploading = uploadImage.isPending || updateProfile.isPending;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage.mutateAsync(file);
      updateProfile.mutate({ avatarUrl: url });
    } catch { }
  };

  return (
    <Card data-tour="profile-card" className="my-4">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col items-start gap-4 md:gap-6 md:flex-row md:items-center">
          <div data-tour="profile-avatar" className="relative">
            <Avatar className="size-20 md:size-24">
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
              <AvatarFallback className="bg-brand/15 text-brand text-2xl font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-2 -bottom-2 size-8 rounded-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              title="Alterar foto de perfil"
            >
              {isUploading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Camera className="size-3.5" />
              )}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div data-tour="profile-info" className="flex-1 space-y-2">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">{user.name}</h1>
            {user.bio && (
              <p className="text-muted-foreground text-sm">{user.bio}</p>
            )}
            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="size-4" />
                {user.email}
              </div>
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  {user.location}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                {formatJoinDate(user.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
