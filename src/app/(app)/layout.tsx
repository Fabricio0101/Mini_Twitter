import React from "react";
import { Header } from "@/components/header";
import { ScrollToTop } from "@/components/ScrollToTop";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <ScrollToTop />
    </div>
  );
}

