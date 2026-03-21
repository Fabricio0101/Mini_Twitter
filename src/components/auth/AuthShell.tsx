"use client";

import { useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

const formVariants = {
  enter: (direction: number) => ({
    x: direction * 50,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction * -50,
    opacity: 0,
  }),
};

export function AuthShell() {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = pathname === "/register" ? "register" : "login";

  const prevTabRef = useRef(activeTab);
  const direction =
    activeTab === prevTabRef.current
      ? 0
      : activeTab === "register"
        ? 1
        : -1;
  prevTabRef.current = activeTab;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-[440px] space-y-10">
        <h1 className="text-center text-3xl font-semibold text-brand">
          Mini Twitter
        </h1>

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            router.push(value === "register" ? "/register" : "/login")
          }
          className="w-full"
        >
          <TabsList
            variant="line"
            className="grid w-full grid-cols-2 border-b border-border/60 h-auto p-0"
          >
            <TabsTrigger
              value="login"
              className="pb-3 text-base font-medium text-muted-foreground data-active:text-brand after:!bg-brand after:!bottom-[8px] after:!h-[2px]"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="pb-3 text-base font-medium text-muted-foreground data-active:text-brand after:!bg-brand after:!bottom-[8px] after:!h-[2px]"
            >
              Cadastrar
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="-mx-4 overflow-hidden px-4">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={activeTab}
              custom={direction}
              variants={formVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
