import Link from "next/link";

export default function DeveloperPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 sm:p-8">
      <div className="max-w-4xl w-full mx-auto animate-in fade-in zoom-in-95 duration-700">
        
        <div className="mb-6 flex justify-start">
          <Link href="/" className="group flex items-center gap-2 text-primary hover:text-white transition-all duration-300 px-5 py-2 rounded-full glass-panel border border-white/10 hover:bg-white/5 hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:border-primary/50">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span className="font-medium tracking-wide">Back to Dashboard</span>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary drop-shadow-sm mb-4">
            Meet the Developer
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            The visionary behind CareerDNA AI.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden group">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            {/* Developer Photo */}
            <div className="w-48 h-48 md:w-64 md:h-64 relative rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.3)] group-hover:border-primary/50 transition-colors duration-500 flex-shrink-0 bg-gradient-to-br from-gray-800 to-black">
              {/* Fallback avatar if no image provided */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                <svg className="w-24 h-24 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span className="text-xs uppercase tracking-widest font-semibold">Developer</span>
              </div>
            </div>

            {/* Developer Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">John Doe</h2>
              <h3 className="text-primary font-medium text-lg mb-6">Lead Software Engineer</h3>
              
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Architected and built CareerDNA AI, bridging the gap between modern UI/UX design and powerful Large Language Models.
                </p>
                <p>
                  <strong>Contributions:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-1 ml-2">
                  <li>Designed the scalable Next.js frontend architecture.</li>
                  <li>Implemented Gemini AI integration for semantic matching.</li>
                  <li>Created the beautiful, interactive glassmorphic UI.</li>
                  <li>Developed custom resume parsing and scoring algorithms.</li>
                </ul>
              </div>

              <div className="mt-8 flex items-center justify-center md:justify-start gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all shadow-lg hover:shadow-primary/50">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:border-secondary transition-all shadow-lg hover:shadow-secondary/50">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
