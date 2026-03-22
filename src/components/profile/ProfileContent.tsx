"use client";

import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PersonalInfoTab } from "@/components/profile/PersonalInfoTab";
import { SecurityTab } from "@/components/profile/SecurityTab";
import { PostCard } from "@/components/posts/PostCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Bookmark } from "lucide-react";
import { api } from "@/lib/api/axios";
import { useAuthStore } from "@/lib/store/authStore";
import type { PostsResponse } from "@/lib/types/post";

function MyPostsTab() {
  const user = useAuthStore((s) => s.user);

  const { data, isLoading } = useQuery<PostsResponse>({
    queryKey: ["userPosts", user?.id],
    queryFn: async () => {
      const response = await api.get(`/social/user-posts/${user!.id}`);
      return response.data;
    },
    enabled: !!user?.id,
  });

  const posts = data?.posts ?? [];

  if (isLoading) {
    return (
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
    );
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center flex flex-col items-center gap-3">
          <FileText className="size-10 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhuma publicação ainda.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function SavedPostsTab() {
  const { data, isLoading } = useQuery<PostsResponse>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const response = await api.get("/social/favorites");
      return response.data;
    },
  });

  const posts = data?.posts ?? [];

  if (isLoading) {
    return (
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
    );
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center flex flex-col items-center gap-3">
          <Bookmark className="size-10 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhum post salvo ainda.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export function ProfileContent() {
  return (
    <Tabs defaultValue="posts" className="space-y-4">
      <TabsList data-tour="profile-tabs" className="grid w-full grid-cols-4">
        <TabsTrigger data-tour="tab-posts" className="h-9 text-xs sm:text-sm" value="posts">Publicações</TabsTrigger>
        <TabsTrigger data-tour="tab-saved" className="h-9 text-xs sm:text-sm" value="saved">Salvos</TabsTrigger>
        <TabsTrigger data-tour="tab-personal" className="h-9 text-xs sm:text-sm" value="personal">Pessoal</TabsTrigger>
        <TabsTrigger data-tour="tab-security" className="h-9 text-xs sm:text-sm" value="security">Segurança</TabsTrigger>
      </TabsList>
      <TabsContent value="posts" className="space-y-4">
        <MyPostsTab />
      </TabsContent>
      <TabsContent value="saved" className="space-y-4">
        <SavedPostsTab />
      </TabsContent>
      <TabsContent value="personal" className="space-y-6">
        <PersonalInfoTab />
      </TabsContent>
      <TabsContent value="security" className="space-y-6">
        <SecurityTab />
      </TabsContent>
    </Tabs>
  );
}
