"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PostList } from "@/components/posts/PostList";
import { PostForm } from "@/components/posts/PostForm";
import { ActiveFilter } from "@/components/ActiveFilter";

function TimelineContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("q") || undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-0 py-4 md:py-6 space-y-4 md:space-y-6">
      <PostForm />
      {search && <ActiveFilter query={search} />}
      <PostList search={search} />
    </div>
  );
}

export default function TimelinePage() {
  return (
    <Suspense>
      <TimelineContent />
    </Suspense>
  );
}
