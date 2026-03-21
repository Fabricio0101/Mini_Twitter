"use client";

import { HeaderDesktop } from "@/components/header/HeaderDesktop";
import { HeaderMobile } from "@/components/header/HeaderMobile";

export function Header() {
  return (
    <>
      <HeaderDesktop />
      <HeaderMobile />
    </>
  );
}
