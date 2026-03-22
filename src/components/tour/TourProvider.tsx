"use client";

import { useState, useEffect, useCallback } from "react";
import { GuidedTour } from "@/components/tour/GuidedTour";
import { WelcomeModal } from "@/components/tour/WelcomeModal";
import { TOUR_CONFIGS } from "@/lib/utils/tourConfigs";

export function TourProvider() {
  const [activeTourKey, setActiveTourKey] = useState<string | null>(null);

  const handleStartTour = useCallback((key: string) => {
    setActiveTourKey(key);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const key = (e as CustomEvent).detail;
      if (key && TOUR_CONFIGS[key]) {
        handleStartTour(key);
      }
    };
    window.addEventListener("tour:start", handler);
    return () => window.removeEventListener("tour:start", handler);
  }, [handleStartTour]);

  const handleTourComplete = () => {
    setActiveTourKey(null);
  };

  const handleWelcomeDismiss = () => {
    localStorage.removeItem("tour-home");
    handleStartTour("home");
  };

  return (
    <>
      {activeTourKey && TOUR_CONFIGS[activeTourKey] && (
        <GuidedTour
          key={activeTourKey}
          steps={TOUR_CONFIGS[activeTourKey].steps}
          tourKey={activeTourKey}
          onComplete={handleTourComplete}
        />
      )}
      <WelcomeModal onDismiss={handleWelcomeDismiss} />
    </>
  );
}
