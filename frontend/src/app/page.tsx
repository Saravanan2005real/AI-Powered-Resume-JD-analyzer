"use client";

import { useState } from "react";
import UploadPortal from "@/components/UploadPortal";

export default function Home() {
  const [jdFiles, setJdFiles] = useState<File[]>([]);
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const handleAnalyze = async () => {
    if (jdFiles.length === 0 || resumeFiles.length === 0) {
      alert("Please upload both a Job Description and at least one Resume.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("jd", jdFiles[0]);
      
      resumeFiles.forEach((file) => {
        formData.append("resumes", file);
      });

      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze");
      }

      const data = await response.json();
      console.log("Analysis Results:", data);
      setAnalysisResults(data);
      alert("Analysis complete! Check console for results.");
      
      // In the future, we would transition to a "Results State" to display the Dashboard
    } catch (error: any) {
      console.error("Analysis error:", error);
      alert(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 sm:p-8">
      <div className="max-w-6xl w-full mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary drop-shadow-[0_0_20px_rgba(14,165,233,0.5)]">
            CareerDNA AI
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Upload a Job Description and your Resume to unlock AI-powered semantic matching, keyword intelligence, and personalized career insights.
          </p>
        </div>

        {/* Upload Portals Grid */}
        <div className="grid md:grid-cols-2 gap-8 w-full mt-12 animate-in fade-in zoom-in-95 duration-1000 delay-200 fill-mode-both">
          
          <UploadPortal 
            title="Job Description" 
            description="Upload the job requirements and role information."
            accept=".pdf,.doc,.docx,.txt"
            maxFiles={1}
            onFilesChange={(files) => setJdFiles(files)}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            }
          />

          <UploadPortal 
            title="Resume" 
            description="Upload up to 5 resumes for analysis."
            accept=".pdf,.doc,.docx,.txt"
            multiple={true}
            maxFiles={5}
            onFilesChange={(files) => setResumeFiles(files)}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            }
          />

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16 animate-in fade-in duration-1000 delay-500 fill-mode-both">
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`group relative px-8 py-4 w-full sm:w-auto font-bold text-white rounded-full bg-gradient-to-r from-primary to-secondary overflow-hidden transition-all duration-500 transform ${
              isAnalyzing 
                ? "opacity-70 cursor-not-allowed" 
                : "shadow-[0_0_20px_rgba(14,165,233,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] hover:-translate-y-1"
            }`}
          >
            {!isAnalyzing && <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:scale-105 transition-transform duration-300 ease-out"></span>}
            <span className="relative flex items-center justify-center gap-2 text-lg tracking-wide">
              {isAnalyzing ? "Analyzing..." : "Analyze Match"}
              {!isAnalyzing && (
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              )}
            </span>
          </button>

          <button className="group relative px-8 py-4 w-full sm:w-auto font-bold text-white rounded-full glass-panel border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]">
            <span className="relative flex items-center justify-center gap-2 text-lg tracking-wide">
              Download CareerDNA Report
              <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
