import UploadPortal from "@/components/UploadPortal";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 sm:p-8">
      <div className="max-w-6xl w-full mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4 animate-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 drop-shadow-sm">
            AI-Powered Matcher
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Upload a Job Description and your Resume to get deep semantic matching, keyword extraction, and personalized improvement suggestions.
          </p>
        </div>

        {/* Upload Portals Grid */}
        <div className="grid md:grid-cols-2 gap-8 w-full mt-12 animate-in zoom-in-95 duration-700 delay-150">
          
          <UploadPortal 
            title="Job Description" 
            description="Upload the requirements and roles you want to match against."
            accept=".pdf,.doc,.docx,.txt"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            }
          />

          <UploadPortal 
            title="Your Resume" 
            description="Upload your latest CV to let Gemini analyze your qualifications."
            accept=".pdf,.doc,.docx,.txt"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            }
          />

        </div>

        {/* Analyze Action Button */}
        <div className="flex justify-center mt-12 animate-in fade-in duration-1000 delay-300">
          <button className="group relative px-8 py-4 font-bold text-white rounded-full bg-gradient-to-r from-primary to-secondary overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:shadow-[0_0_60px_rgba(139,92,246,0.6)] transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 w-full h-full bg-white/20 group-hover:scale-105 transition-transform duration-300 ease-out"></div>
            <span className="relative flex items-center gap-2 text-lg tracking-wide">
              Analyze Match
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
