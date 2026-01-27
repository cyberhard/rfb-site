import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeroUIProviderWrapper from "@/components/HeroUIProviderWrapper";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "RFB 4 - RusFurBal",
  description: "Русский фурри бал 2026",
  icons: {
    icon: "/furryicon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru"><body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0f111b] text-white`}><HeroUIProviderWrapper>{children}</HeroUIProviderWrapper></body></html>
  );
}
