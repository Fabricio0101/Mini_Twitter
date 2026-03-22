"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  dispatchEvent?: string;
}

interface GuidedTourProps {
  steps: TourStep[];
  tourKey: string;
  onComplete?: () => void;
}

function isInsideFixedContainer(el: Element): boolean {
  let current: Element | null = el;
  while (current && current !== document.documentElement) {
    const style = window.getComputedStyle(current);
    if (style.position === "fixed") return true;
    current = current.parentElement;
  }
  return false;
}

export function GuidedTour({ steps, tourKey, onComplete }: GuidedTourProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    const completed = localStorage.getItem(`tour-${tourKey}`);
    if (!completed) {
      const timer = setTimeout(() => setShowConfirm(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [tourKey]);

  const measureAndShow = useCallback((el: Element) => {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return false;
    setPosition({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
    setVisible(true);
    return true;
  }, []);

  const scrollToAndUpdate = useCallback(
    (stepIndex: number) => {
      const currentStep = steps[stepIndex];

      if (retryRef.current) {
        clearTimeout(retryRef.current);
        retryRef.current = null;
      }

      setVisible(false);
      setPosition(null);

      if (currentStep.dispatchEvent) {
        window.dispatchEvent(new Event(currentStep.dispatchEvent));
      }

      let retryCount = 0;
      const MAX_RETRIES = 25;

      const findAndPosition = () => {
        const el = document.querySelector(currentStep.target);

        if (!el || el.getBoundingClientRect().width === 0) {
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            retryRef.current = setTimeout(findAndPosition, 100);
          }
          return;
        }

        if (currentStep.clickOnArrive) {
          (el as HTMLElement).click();
        }

        const isFixed = isInsideFixedContainer(el);
        if (!isFixed) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        const delay = isFixed ? 100 : 400;
        retryRef.current = setTimeout(() => {
          if (measureAndShow(el)) return;
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            retryRef.current = setTimeout(findAndPosition, 100);
          }
        }, delay);
      };

      const initialDelay = currentStep.dispatchEvent ? 600 : 50;
      retryRef.current = setTimeout(findAndPosition, initialDelay);
    },
    [steps, measureAndShow]
  );

  useEffect(() => {
    if (!active) return;
    scrollToAndUpdate(step);

    const handleResize = () => {
      const currentStep = steps[step];
      const el = document.querySelector(currentStep.target);
      if (el) measureAndShow(el);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (retryRef.current) clearTimeout(retryRef.current);
    };
  }, [active, step, scrollToAndUpdate, steps, measureAndShow]);

  const findNextVisibleStep = (
    from: number,
    direction: 1 | -1
  ): number | null => {
    let idx = from;
    while (idx >= 0 && idx < steps.length) {
      if (steps[idx].dispatchEvent) return idx;
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
    setVisible(false);
    setPosition(null);
    localStorage.setItem(`tour-${tourKey}`, "true");
    onComplete?.();
  };

  if (!mounted) return null;

  if (showConfirm) {
    return (
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) handleDecline();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tour Guiado</DialogTitle>
            <DialogDescription>
              Quer conhecer os recursos desta página? O tour guiado mostra passo
              a passo como usar cada funcionalidade.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={handleDecline}
              onMouseDown={(e) => e.preventDefault()}
            >
              Agora não
            </Button>
            <Button
              onClick={handleStart}
              onMouseDown={(e) => e.preventDefault()}
              className="bg-brand hover:bg-brand-hover text-brand-foreground"
            >
              Iniciar tour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (!active || !position || !visible) return null;

  const currentStep = steps[step];
  const placement = currentStep.placement || "bottom";

  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : 1024;
  const viewportHeight =
    typeof window !== "undefined" ? window.innerHeight : 768;
  const TOOLTIP_WIDTH = Math.min(320, viewportWidth - 32);
  const OFFSET = 16;

  let tooltipTop = 0;
  let tooltipLeft = 0;
  let tooltipTransform = "";

  if (placement === "bottom") {
    tooltipTop = position.top + position.height + OFFSET;
    tooltipLeft = Math.max(
      8,
      Math.min(
        position.left + position.width / 2 - TOOLTIP_WIDTH / 2,
        viewportWidth - TOOLTIP_WIDTH - 8
      )
    );
    const estimatedHeight = 160;
    if (tooltipTop + estimatedHeight > viewportHeight - 8) {
      tooltipTop = position.top - OFFSET;
      tooltipTransform = "translateY(-100%)";
    }
  } else if (placement === "top") {
    tooltipTop = position.top - OFFSET;
    tooltipLeft = Math.max(
      8,
      Math.min(
        position.left + position.width / 2 - TOOLTIP_WIDTH / 2,
        viewportWidth - TOOLTIP_WIDTH - 8
      )
    );
    tooltipTransform = "translateY(-100%)";
  } else if (placement === "right") {
    tooltipTop = position.top + position.height / 2;
    tooltipLeft = Math.min(
      position.left + position.width + OFFSET,
      viewportWidth - TOOLTIP_WIDTH - 8
    );
    tooltipTransform = "translateY(-50%)";

    const estimatedHeight = 160;
    const half = estimatedHeight / 2;
    if (tooltipTop - half < 8) tooltipTop = 8 + half;
    if (tooltipTop + half > viewportHeight - 8)
      tooltipTop = viewportHeight - 8 - half;
  } else if (placement === "left") {
    tooltipTop = position.top + position.height / 2;
    tooltipLeft = Math.max(8, position.left - OFFSET - TOOLTIP_WIDTH);
    tooltipTransform = "translateY(-50%)";

    const estimatedHeight = 160;
    const half = estimatedHeight / 2;
    if (tooltipTop - half < 8) tooltipTop = 8 + half;
    if (tooltipTop + half > viewportHeight - 8)
      tooltipTop = viewportHeight - 8 - half;
  }

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[9998] bg-black/50 animate-in fade-in-0 duration-200"
        onClick={handleClose}
      />

      <div
        className="fixed z-[9999] rounded-lg ring-4 ring-brand/50 pointer-events-none animate-in fade-in-0 duration-200"
        style={{
          top: position.top - 4,
          left: position.left - 4,
          width: position.width + 8,
          height: position.height + 8,
        }}
      />

      <Card
        className="fixed z-[10000] shadow-2xl border-brand/20 animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
        style={{
          top: tooltipTop,
          left: tooltipLeft,
          width: TOOLTIP_WIDTH,
          transform: tooltipTransform || undefined,
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-sm text-foreground">
              {currentStep.title}
            </h4>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 shrink-0"
              onClick={handleClose}
              onMouseDown={(e) => e.preventDefault()}
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={handlePrev}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <ChevronLeft className="size-3" />
                  Anterior
                </Button>
              )}
              <Button
                size="sm"
                className={cn(
                  "h-7 gap-1 text-xs",
                  "bg-brand hover:bg-brand-hover text-brand-foreground"
                )}
                onClick={handleNext}
                onMouseDown={(e) => e.preventDefault()}
              >
                {step === steps.length - 1 ? "Concluir" : "Próximo"}
                {step < steps.length - 1 && (
                  <ChevronRight className="size-3" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>,
    document.body
  );
}
