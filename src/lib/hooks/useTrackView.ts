"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export function useTrackView(postId: number) {
  const tracked = useRef(false);
  const mutation = useMutation({
    mutationFn: async () => {
      await api.post(`/social/view/${postId}`);
    },
  });

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    mutation.mutate();
  }, [postId]);
}
