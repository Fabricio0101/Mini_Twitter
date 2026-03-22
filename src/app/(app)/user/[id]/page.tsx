"use client";

import { use } from "react";
import { PublicProfileView } from "@/components/profile/PublicProfileView";

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-0 py-4 md:py-6 space-y-4 md:space-y-6">
      <PublicProfileView userId={Number(id)} />
    </div>
  );
}
