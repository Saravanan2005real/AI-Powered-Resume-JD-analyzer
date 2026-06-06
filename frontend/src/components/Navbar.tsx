import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Resume Analyzer
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Analyzer
            </Link>
            <Link 
              href="/developer" 
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Developer
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
