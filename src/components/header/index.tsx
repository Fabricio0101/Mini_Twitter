"use client";

import { HeaderDesktop } from "@/components/header/HeaderDesktop";
import { HeaderMobile } from "@/components/header/HeaderMobile";
import { TourProvider } from "@/components/tour/TourProvider";

export function Header() {
  return (
    <>
      <HeaderDesktop />
      <HeaderMobile />
      <TourProvider />
    </>
  );
}
