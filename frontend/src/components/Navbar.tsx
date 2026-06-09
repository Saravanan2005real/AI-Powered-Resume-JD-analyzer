import Link from "next/link";

const DNALogo = () => (
  <svg className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" className="text-primary/30" />
    <path d="M30 20 C 50 20, 50 80, 70 80" stroke="url(#glow-blue)" strokeWidth="4" strokeLinecap="round" />
    <path d="M70 20 C 50 20, 50 80, 30 80" stroke="url(#glow-purple)" strokeWidth="4" strokeLinecap="round" />
    <circle cx="30" cy="20" r="6" fill="#0ea5e9" />
    <circle cx="70" cy="80" r="6" fill="#0ea5e9" />
    <circle cx="70" cy="20" r="6" fill="#a855f7" />
    <circle cx="30" cy="80" r="6" fill="#a855f7" />
    <defs>
      <linearGradient id="glow-blue" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
      <linearGradient id="glow-purple" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#c084fc" />
      </linearGradient>
    </defs>
  </svg>
);

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 glass-panel border-b border-white/5 bg-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 group">
            <div className="flex items-center justify-center transition-transform duration-500 group-hover:rotate-180 group-hover:scale-110">
              <DNALogo />
            </div>
            <Link href="/" className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              CareerDNA AI
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-sm font-semibold tracking-wide text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all"
            >
              Dashboard
            </Link>
            <Link 
              href="/developer" 
              className="text-sm font-semibold tracking-wide text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all"
            >
              Developer
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
