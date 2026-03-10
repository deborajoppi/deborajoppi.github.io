// @ts-nocheck
// app/science/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import ScienceShell from "@/app/components/science-shell";

export const metadata: Metadata = {
  title: "Science — Débora Joppi",
  description: "Research, publications, and teaching by Débora Joppi",
};

export default function ScienceLayout({ children }: { children: ReactNode }) {
  return <ScienceShell>{children}</ScienceShell>;
}
