"use client";

import { motion } from "framer-motion";

export default function DNAAnimation() {
  const length = 16;
  return (
    <div className="relative w-[120px] h-[220px] opacity-[0.25] flex flex-col justify-evenly items-center mix-blend-screen will-change-transform" style={{ perspective: '800px' }}>
      {Array.from({ length }).map((_, i) => {
        const buildDelay = i * 0.12;
        const spinDelay = i * -0.25;
        
        return (
          <motion.div 
            key={i} 
            className="relative w-full h-3 flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '100%' }}
            transition={{ duration: 0.8, delay: buildDelay, ease: "easeOut" }}
          >
            <div 
              className="absolute w-full h-full flex items-center justify-center will-change-transform"
              style={{ 
                animation: `spinDNASpiral 8s linear infinite ${spinDelay}s`,
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="absolute w-full h-[1px] bg-gradient-to-r from-cyan-400/40 via-white/40 to-purple-500/40"></div>
              <motion.div 
                className="absolute -left-1.5 w-3 h-3 rounded-full bg-cyan-400/80 shadow-[0_0_8px_#22d3ee]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: buildDelay }}
              />
              <motion.div 
                className="absolute -right-1.5 w-3 h-3 rounded-full bg-purple-500/80 shadow-[0_0_8px_#a855f7]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: buildDelay + 0.2 }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
