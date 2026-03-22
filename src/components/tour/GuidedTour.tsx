"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TourStep {
  target: string;
  title: string;
  description: string;
  placement?: "top" | "bottom" | "left" | "right";
  clickOnArrive?: boolean;
}

interface GuidedTourProps {
  steps: TourStep[];
  tourKey: string;
  onComplete?: () => void;
}

export function GuidedTour({ steps, tourKey, onComplete }: GuidedTourProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const completed = localStorage.getItem(`tour-${tourKey}`);
    if (!completed) {
      const timer = setTimeout(() => setShowConfirm(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [tourKey]);

  const scrollToAndUpdate = useCallback((stepIndex: number) => {
    const currentStep = steps[stepIndex];
    const el = document.querySelector(currentStep.target);
    if (!el) return;

    if (currentStep.clickOnArrive) {
      (el as HTMLElement).click();
    }

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    }, 400);
  }, [steps]);

  useEffect(() => {
    if (!active) return;
    scrollToAndUpdate(step);

    const handleResize = () => scrollToAndUpdate(step);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [active, step, scrollToAndUpdate]);

  const findNextVisibleStep = (from: number, direction: 1 | -1): number | null => {
    let idx = from;
    while (idx >= 0 && idx < steps.length) {
      const el = document.querySelector(steps[idx].target);
      if (el && el.getBoundingClientRect().width > 0) return idx;
      idx += direction;
    }
    return null;
  };

  const handleStart = () => {
    setShowConfirm(false);
    const firstVisible = findNextVisibleStep(0, 1);
    if (firstVisible !== null) {
      setStep(firstVisible);
      setActive(true);
    }
  };

  const handleDecline = () => {
    setShowConfirm(false);
    localStorage.setItem(`tour-${tourKey}`, "true");
  };

  const handleNext = () => {
    const nextVisible = findNextVisibleStep(step + 1, 1);
    if (nextVisible !== null) {
      setStep(nextVisible);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    const prevVisible = findNextVisibleStep(step - 1, -1);
    if (prevVisible !== null) setStep(prevVisible);
  };

  const handleClose = () => {
    setActive(false);
    localStorage.setItem(`tour-${tourKey}`, "true");
    onComplete?.();
  };

  if (!mounted) return null;

  if (showConfirm) {
    return (
      <Dialog open onOpenChange={(open) => { if (!open) handleDecline(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tour Guiado</DialogTitle>
            <DialogDescription>
              Quer conhecer os recursos desta página? O tour guiado mostra passo a passo como usar cada funcionalidade.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={handleDecline}>
              Agora não
            </Button>
            <Button onClick={handleStart} className="bg-brand hover:bg-brand-hover text-brand-foreground">
              Iniciar tour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (!active) return null;

  const currentStep = steps[step];
  const placement = currentStep.placement || "bottom";

  const tooltipStyle: React.CSSProperties = { position: "absolute" };
  const OFFSET = 12;
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1024;
  const TOOLTIP_WIDTH = Math.min(320, viewportWidth - 32);

  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 768;
  const scrollY = typeof window !== "undefined" ? window.scrollY : 0;

  if (placement === "bottom") {
    tooltipStyle.top = position.top + position.height + OFFSET;
    tooltipStyle.left = Math.max(8, Math.min(position.left + position.width / 2 - TOOLTIP_WIDTH / 2, viewportWidth - TOOLTIP_WIDTH - 8));
  } else if (placement === "top") {
    tooltipStyle.top = position.top - OFFSET;
    tooltipStyle.left = Math.max(8, Math.min(position.left + position.width / 2 - TOOLTIP_WIDTH / 2, viewportWidth - TOOLTIP_WIDTH - 8));
    tooltipStyle.transform = "translateY(-100%)";
  } else if (placement === "right") {
    tooltipStyle.top = position.top + position.height / 2;
    tooltipStyle.left = Math.min(position.left + position.width + OFFSET, viewportWidth - TOOLTIP_WIDTH - 8);
    tooltipStyle.transform = "translateY(-50%)";
  } else if (placement === "left") {
    tooltipStyle.top = position.top + position.height / 2;
    tooltipStyle.left = Math.max(8, position.left - OFFSET - TOOLTIP_WIDTH);
    tooltipStyle.transform = "translateY(-50%)";
  }

  if (tooltipStyle.top && typeof tooltipStyle.top === "number") {
    const tooltipBottom = tooltipStyle.top + 120;
    const viewBottom = scrollY + viewportHeight;
    if (tooltipBottom > viewBottom) {
      tooltipStyle.top = position.top - OFFSET;
      tooltipStyle.transform = "translateY(-100%)";
    }
  }

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[9998] bg-black/50 transition-opacity duration-300"
        onClick={handleClose}
      />

      <div
        className="absolute z-[9999] rounded-lg ring-4 ring-brand/50 transition-all duration-300 pointer-events-none"
        style={{
          top: position.top - 4,
          left: position.left - 4,
          width: position.width + 8,
          height: position.height + 8,
        }}
      />

      <Card
        className="absolute z-[10000] shadow-2xl border-brand/20"
        style={{ ...tooltipStyle, width: TOOLTIP_WIDTH }}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-sm text-foreground">{currentStep.title}</h4>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 shrink-0"
              onClick={handleClose}
              title="Fechar tour"
            >
              <X className="size-3.5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            {currentStep.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {step + 1} de {steps.length}
            </span>
            <div className="flex gap-1">
              {step > 0 && (
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={handlePrev}>
                  <ChevronLeft className="size-3" />
                  Anterior
                </Button>
              )}
              <Button
                size="sm"
                className={cn("h-7 gap-1 text-xs", "bg-brand hover:bg-brand-hover text-brand-foreground")}
                onClick={handleNext}
              >
                {step === steps.length - 1 ? "Concluir" : "Próximo"}
                {step < steps.length - 1 && <ChevronRight className="size-3" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>,
    document.body
  );
}
