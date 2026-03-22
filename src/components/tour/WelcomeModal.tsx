"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "mini-twitter-welcome-seen";

interface WelcomeModalProps {
  onDismiss: () => void;
}

export function WelcomeModal({ onDismiss }: WelcomeModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const timer = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, "true");
    setTimeout(() => onDismiss(), 300);
  };

  if (!open) return null;

  return (
    <Dialog open onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden gap-0">
        <div className="w-full h-48 flex items-center justify-center" style={{ backgroundColor: "#3EB5FE" }}>
          <img
            src="/MiniTwitter.png"
            alt="Mini Twitter"
            className="h-32 object-contain"
          />
        </div>
        <div className="p-6 space-y-3">
          <h2 className="text-xl font-bold text-foreground">
            Bem-vindo ao Mini Twitter! 🎉
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Estamos muito felizes em ter você aqui! O Mini Twitter é a sua rede social para compartilhar ideias,
            conectar-se com outros usuários, trocar mensagens e acompanhar o que está acontecendo.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Para te ajudar a conhecer tudo, preparamos um <strong className="text-foreground">tour guiado</strong> que
            mostra passo a passo cada funcionalidade. Você pode acessá-lo a qualquer momento pelo ícone
            de <strong className="text-foreground">ajuda (?)</strong> no topo da página.
          </p>
        </div>
        <DialogFooter className="px-6 pb-6">
          <Button
            onClick={handleClose}
            className="bg-brand hover:bg-brand-hover text-brand-foreground"
          >
            Entendi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
