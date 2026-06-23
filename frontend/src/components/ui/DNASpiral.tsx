"use client";

import { useEffect, useState } from "react";

export default function DNASpiral() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none flex items-center justify-center">
      <div 
        className="relative w-[300px] h-[130vh] opacity-[0.15] flex flex-col justify-evenly items-center mix-blend-screen will-change-transform"
        style={{ perspective: '1200px', transform: 'rotateZ(-15deg)' }}
      >
        {Array.from({ length: 25 }).map((_, i) => {
          const delay = i * -0.4;
          return (
            <div 
              key={i} 
              className="relative w-full h-8 flex items-center justify-center" 
              style={{ 
                transformStyle: 'preserve-3d',
                animation: `spinDNASpiral 15s linear infinite ${delay}s`,
                willChange: 'transform'
              }}
            >
              <div className="absolute w-full h-[2px] bg-gradient-to-r from-cyan-400/20 via-white/20 to-purple-500/20"></div>
              <div className="absolute -left-3 w-6 h-6 rounded-full bg-cyan-400/80 shadow-[0_0_10px_#22d3ee]"></div>
              <div className="absolute -right-3 w-6 h-6 rounded-full bg-purple-500/80 shadow-[0_0_10px_#a855f7]"></div>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        @keyframes spinDNASpiral {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}
