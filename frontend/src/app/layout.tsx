import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerDNA AI",
  description: "Unlock AI-powered semantic matching, keyword intelligence, and personalized career insights.",
};

import DNASpiral from "@/components/ui/DNASpiral";
import Particles from "@/components/ui/Particles";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <Particles />
        <DNASpiral />
        <Navbar />
        <main className="flex-1 pt-16 relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
