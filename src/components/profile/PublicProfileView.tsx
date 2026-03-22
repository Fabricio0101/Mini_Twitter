"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, UserPlus, UserCheck, Loader2, MessageCircle } from "lucide-react";
import { PostCard } from "@/components/posts/PostCard";
import { usePublicProfile, useFollow, useUserPosts } from "@/lib/hooks/useSocial";
import { cn } from "@/lib/utils";

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

interface PublicProfileViewProps {
  userId: number;
}

export function PublicProfileView({ userId }: PublicProfileViewProps) {
  const { data: profile, isLoading } = usePublicProfile(userId);
  const { data: postsData, isLoading: postsLoading } = useUserPosts(userId);
  const followMutation = useFollow();
  const router = useRouter();

  if (isLoading || !profile) {
    return (
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <Skeleton className="size-24 md:size-28 rounded-full" />
            <div className="space-y-3 w-full max-w-xs text-center">
              <Skeleton className="h-6 w-40 mx-auto" />
              <Skeleton className="h-4 w-56 mx-auto" />
              <div className="flex justify-center gap-6">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleFollow = () => {
    followMutation.mutate(userId);
  };

  const handleMessage = () => {
    router.push(`/chat?startWith=${userId}`);
  };

  const posts = postsData?.posts ?? [];

  return (
    <>
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <Avatar className="size-24 md:size-28">
              {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.name} />}
              <AvatarFallback className="bg-brand/15 text-brand text-3xl font-semibold">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>

            <div className="text-center space-y-2">
              <h1 className="text-xl md:text-2xl font-bold text-foreground">{profile.name}</h1>
              {profile.bio && (
                <p className="text-muted-foreground text-sm max-w-md">{profile.bio}</p>
              )}

              <div className="flex justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-foreground">{profile.postsCount}</span>
                  <span className="text-xs">Posts</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-foreground">{profile.followersCount}</span>
                  <span className="text-xs">Seguidores</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-foreground">{profile.followingCount}</span>
                  <span className="text-xs">Seguindo</span>
                </div>
              </div>

              <div className="flex justify-center flex-wrap gap-3 text-xs text-muted-foreground pt-1">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {profile.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  {formatJoinDate(profile.createdAt)}
                </div>
              </div>

              {!profile.isOwnProfile && (
                <div className="flex justify-center gap-2 pt-2">
                  <Button
                    onClick={handleFollow}
                    disabled={followMutation.isPending}
                    variant={profile.isFollowing ? "outline" : "default"}
                    size="sm"
                    className={cn(
                      "gap-2 min-w-[120px]",
                      !profile.isFollowing && "bg-brand hover:bg-brand-hover text-brand-foreground"
                    )}
                  >
                    {followMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : profile.isFollowing ? (
                      <UserCheck className="size-4" />
                    ) : (
                      <UserPlus className="size-4" />
                    )}
                    {profile.isFollowing ? "Seguindo" : "Seguir"}
                  </Button>

                  {profile.isFollowing && (
                    <Button
                      onClick={handleMessage}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      title="Enviar mensagem"
                    >
                      <MessageCircle className="size-4" />
                      Mensagem
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-lg font-semibold text-foreground">Publicações</h2>

      {postsLoading && (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="p-4">
              <CardContent className="p-0 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!postsLoading && posts.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground text-sm">Nenhuma publicação ainda.</p>
          </CardContent>
        </Card>
      )}

      {posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={`${post.id}-${post.repostedByMe}`} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
