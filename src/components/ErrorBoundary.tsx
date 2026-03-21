"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-[50vh] items-center justify-center px-4">
          <div className="flex flex-col items-center gap-4 text-center max-w-sm">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertTriangle className="size-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Algo deu errado
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ocorreu um erro inesperado. Tente recarregar a página ou clique no
              botão abaixo.
            </p>
            <Button
              onClick={this.handleReset}
              className="rounded-full bg-brand text-brand-foreground hover:bg-brand-hover gap-2"
            >
              <RefreshCw className="size-4" />
              Tentar novamente
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
