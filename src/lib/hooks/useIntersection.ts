"use client";

import { useCallback, useRef, useState } from "react";

export function useIntersection(options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node) {
        setIsIntersecting(false);
        return;
      }

      const observer = new IntersectionObserver(([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      }, options);

      observer.observe(node);
      observerRef.current = observer;
    },
    []
  );

  return { ref, isIntersecting };
}
