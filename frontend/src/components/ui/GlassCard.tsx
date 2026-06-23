"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { twMerge } from "tailwind-merge";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glowColor?: "primary" | "secondary" | "accent" | "none";
}

export default function GlassCard({
  children,
  className,
  glowColor = "none",
  ...props
}: GlassCardProps) {
  const glowMap = {
    primary: "group-hover:shadow-[0_0_15px_rgba(14,165,233,0.15)]",
    secondary: "group-hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]",
    accent: "group-hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]",
    none: "",
  };

  return (
    <motion.div
      className={twMerge(
        "group relative overflow-hidden rounded-2xl border border-white/5",
        "bg-black/60 backdrop-blur-md will-change-transform",
        "transition-all duration-300 hover:-translate-y-1 hover:border-white/10",
        glowMap[glowColor],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
