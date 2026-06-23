import Link from "next/link";
import DeveloperCard from "@/components/developers/DeveloperCard";

export default function DevelopersPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] p-4 sm:p-8 pt-12">
      <div className="max-w-5xl w-full mx-auto animate-in fade-in zoom-in-95 duration-700">
        
        <div className="mb-10 flex justify-start">
          <Link href="/" className="group flex items-center gap-2 text-primary hover:text-white transition-all duration-300 px-5 py-2.5 rounded-full glass-panel border border-white/5 hover:bg-white/5 hover:shadow-[0_0_15px_rgba(14,165,233,0.15)] backdrop-blur-md">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span className="font-medium tracking-wide">Back to Dashboard</span>
          </Link>
        </div>

        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500 drop-shadow-sm">
            Meet the Team
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            The visionary engineers architecting CareerDNA AI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto pb-20">
          <DeveloperCard 
            name="Guhan Lakshmanan"
            description="Passionate about building modern AI-powered web applications with clean UI design, responsive experiences, and innovative ideas."
            linkedin="https://www.linkedin.com/in/guhan-lakshmanan/"
            github="https://github.com/Guhan-L"
            glowColor="primary"
            delay={0.1}
            imageSrc="/images/developers/guhan.jpeg"
          />
          <DeveloperCard 
            name="Rohith Kumar S"
            description="Frontend developer focused on creating responsive, user-friendly, and AI-integrated web experiences with modern design principles."
            linkedin="https://www.linkedin.com/in/rohith-kumar-s-399723406/"
            github="https://github.com/Rohithkumar8939"
            glowColor="secondary"
            delay={0.25}
            imageSrc="/images/developers/rohith.jpeg"
          />
        </div>

      </div>
    </div>
  );
}
