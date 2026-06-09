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

const DNABackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none flex items-center justify-center">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Soft moving light effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-1000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-1000 delay-500"></div>

      {/* Floating AI particles */}
      <div className="absolute w-2 h-2 bg-primary rounded-full top-[20%] left-[30%] shadow-[0_0_15px_#0ea5e9] animate-[floatParticle_6s_infinite]" />
      <div className="absolute w-3 h-3 bg-secondary rounded-full top-[60%] left-[70%] shadow-[0_0_20px_#a855f7] animate-[floatParticle_8s_infinite_1s]" />
      <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[40%] left-[80%] shadow-[0_0_10px_#ffffff] animate-[floatParticle_5s_infinite_2s]" />
      <div className="absolute w-2.5 h-2.5 bg-accent rounded-full top-[80%] left-[20%] shadow-[0_0_15px_#06b6d4] animate-[floatParticle_7s_infinite_3s]" />
      
      {/* Animated DNA Helix */}
      <div className="relative w-64 h-[120%] -rotate-12 opacity-30 flex flex-col justify-evenly items-center mix-blend-screen">
        {Array.from({ length: 25 }).map((_, i) => {
          const delay = i * -0.2;
          return (
            <div key={i} className="relative w-full h-8 flex items-center justify-center" style={{ perspective: '1000px' }}>
              <div 
                className="absolute w-full h-[2px] bg-gradient-to-r from-primary/30 via-white/50 to-secondary/30"
                style={{ animation: `spinDNA 5s linear infinite ${delay}s` }}
              ></div>
              <div 
                className="absolute left-0 w-3 h-3 rounded-full bg-primary shadow-[0_0_15px_#0ea5e9]"
                style={{ animation: `spinDNA 5s linear infinite ${delay}s` }}
              ></div>
              <div 
                className="absolute right-0 w-3 h-3 rounded-full bg-secondary shadow-[0_0_15px_#a855f7]"
                style={{ animation: `spinDNA 5s linear infinite ${delay}s` }}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

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
        <DNABackground />
        <Navbar />
        <main className="flex-1 pt-16 relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
