"use client";
import React from 'react';

export default function DNABackground() {
  const rungs = Array.from({ length: 30 });

  return (
    <div className="fixed inset-0 overflow-hidden -z-20 pointer-events-none perspective-[1000px] bg-[radial-gradient(circle_at_50%_50%,rgba(121,40,202,0.15)_0%,rgba(0,0,0,0)_50%)]">
      <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-24 sm:w-32 flex flex-col justify-between py-10 transform-style-3d animate-[rotateDNA_10s_linear_infinite]">
        {rungs.map((_, i) => {
          // Calculate the rotation for each rung to form a helix
          const rotation = (i * 15) % 360;
          return (
            <div 
              key={i} 
              className="relative w-full h-[2px] bg-white/10 transform-style-3d"
              style={{ transform: `rotateY(${rotation}deg)` }}
            >
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(0,112,243,0.8)] translate-z-[20px]" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-secondary shadow-[0_0_15px_rgba(121,40,202,0.8)] -translate-z-[20px]" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
