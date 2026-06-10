"use client";

import { useState } from "react";
import UploadPortal from "@/components/UploadPortal";
import Dashboard from "@/components/Dashboard";
import ReportSection from "@/components/ReportSection";

type AppState = "upload" | "loading" | "results";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("upload");
  const [jdFiles, setJdFiles] = useState<File[]>([]);
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);

  const handleAnalyze = async () => {
    if (jdFiles.length === 0 || resumeFiles.length === 0) {
      alert("Please upload both a Job Description and at least one Resume.");
      return;
    }

    setAppState("loading");
    
    // Simulate backend analysis delay
    setTimeout(() => {
      setAppState("results");
    }, 2500);
  };

  const handleSampleAnalysis = () => {
    setAppState("loading");
    setTimeout(() => {
      setAppState("results");
    }, 2000);
  };

  const handleReset = () => {
    setAppState("upload");
    setJdFiles([]);
    setResumeFiles([]);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] p-4 sm:p-8 pt-12">
      <div className="max-w-7xl w-full mx-auto">
        
        {appState === "upload" && (
          <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="text-center space-y-6">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary drop-shadow-[0_0_20px_rgba(14,165,233,0.5)]">
                Decode Your Career DNA
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Upload a Job Description and your Resume to unlock AI-powered semantic matching, keyword intelligence, and personalized career insights.
              </p>
            </div>

            {/* Upload Portals Grid */}
            <div className="grid md:grid-cols-2 gap-8 w-full mt-12">
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16 pb-20">
              <button 
                onClick={handleAnalyze}
                className="group relative px-8 py-4 w-full sm:w-auto font-bold text-white rounded-full bg-gradient-to-r from-primary to-secondary overflow-hidden transition-all duration-500 transform shadow-[0_0_20px_rgba(14,165,233,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] hover:-translate-y-1"
              >
                <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:scale-105 transition-transform duration-300 ease-out"></span>
                <span className="relative flex items-center justify-center gap-2 text-lg tracking-wide">
                  Analyze Match
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </span>
              </button>

              <button 
                onClick={handleSampleAnalysis}
                className="group relative px-8 py-4 w-full sm:w-auto font-bold text-white rounded-full glass-panel border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]"
              >
                <span className="relative flex items-center justify-center gap-2 text-lg tracking-wide">
                  Try Sample Analysis
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        )}

        {appState === "loading" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-t-4 border-primary border-r-4 border-r-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-b-4 border-secondary border-l-4 border-l-transparent animate-spin animation-delay-200"></div>
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white text-center">Decoding Career DNA...</h2>
            <p className="text-gray-400 text-center max-w-md">Extracting semantic meaning, matching skills, and ranking candidate suitability.</p>
          </div>
        )}

        {appState === "results" && (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full">
            <div className="flex justify-start">
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                New Analysis
              </button>
            </div>
            
            <Dashboard />
            <ReportSection />
          </div>
        )}

      </div>
    </div>
  );
}
