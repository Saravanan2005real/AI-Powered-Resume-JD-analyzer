"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DNAAnimation from "./DNAAnimation";

interface DNALoaderProps {
  onComplete: () => void;
}

export default function DNALoader({ onComplete }: DNALoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // After 3.5 seconds, start the fade out process
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // Wait for the fade out animation to finish before calling onComplete
    }, 3500);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020205] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Subtle Grid Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none"></div>
          
          {/* Soft central glow */}
          <div className="absolute w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>
          
          {/* The DNA Animation */}
          <div className="mb-8 z-10">
            <DNAAnimation />
          </div>
          
          {/* Text Animation */}
          <div className="z-10 flex flex-col items-center text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-extrabold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500 drop-shadow-sm mb-3"
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
            >
              CAREER DNA
            </motion.h1>
            
            <motion.p 
              className="text-sm md:text-base text-cyan-200/40 tracking-widest uppercase font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2.2 }}
            >
              Decoding Your Career Genome...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
