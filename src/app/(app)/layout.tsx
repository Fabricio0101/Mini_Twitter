import React from "react";
import { Header } from "@/components/header";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ScrollToTopOnNav } from "@/components/ScrollToTopOnNav";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 min-w-0 pb-16 md:pb-0">{children}</main>
      </div>
      <ScrollToTop />
      <ScrollToTopOnNav />
      <ChatProvider />
      <MobileBottomNav />
    </div>
  );
}
