"use client";

import { useState, useEffect, useCallback } from "react";
import UploadPortal from "@/components/UploadPortal";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import DNALoader from "@/components/ui/DNALoader";

type AppState = "upload" | "loading" | "results";

export default function Home() {
  const [showLoader, setShowLoader] = useState(true);
  const [appState, setAppState] = useState<AppState>("upload");
  const [jdFiles, setJdFiles] = useState<File[]>([]);
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [analysisData, setAnalysisData] = useState<any[]>([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    // Only show on first load per session
    const hasLoaded = sessionStorage.getItem('careerDNA_loader_shown');
    if (hasLoaded) {
      setShowLoader(false);
    }
  }, []);

  const handleLoaderComplete = useCallback(() => {
    sessionStorage.setItem('careerDNA_loader_shown', 'true');
    setShowLoader(false);
  }, []);

  const handleAnalyze = async () => {
    console.log("Analyze button clicked");
    if (jdFiles.length === 0 || resumeFiles.length === 0) {
      alert("Please upload both a Job Description and at least one Resume.");
      return;
    }

    setAppState("loading");
    
    const formData = new FormData();
    formData.append('jd', jdFiles[0]);
    resumeFiles.forEach((file) => {
      formData.append('resumes', file);
    });

    try {
      console.log("Sending request to backend...");
      console.log("Request payload:", formData);
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      console.log("Response:", data);
      
      if (data && data.length > 0) {
        setAnalysisData(data); // Save the entire array
        setAppState("results");
      } else {
        alert("No results returned.");
        setAppState("upload");
      }
    } catch (error: any) {
      console.error("API ERROR:", error);
      console.error('Analysis pipeline error:', error);
      alert(`Analysis Failed: ${error.message || 'An unexpected error occurred.'}`);
      setAppState("upload");
    }
  };

  const handleDownloadReport = async () => {
    if (!analysisData || analysisData.length === 0) return;
    
    setIsGeneratingPdf(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisData),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate report from server');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'CareerDNA_Report.pdf';
      if (contentDisposition && contentDisposition.includes('filename=')) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      } else if (response.headers.get('Content-Type') === 'application/zip') {
        filename = 'CareerDNA_Reports.zip';
      } else {
        // Fallback for single candidate
        const safeName = (analysisData[0].candidateName || 'Candidate').replace(/\s+/g, '');
        filename = `CareerDNA_Report_${safeName}.pdf`;
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (error: any) {
      console.error(error);
      alert(`Failed to download report: ${error.message}`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleReset = () => {
    setAppState("upload");
    setJdFiles([]);
    setResumeFiles([]);
    setAnalysisData([]);
  };

  return (
    <>
      {showLoader && <DNALoader onComplete={handleLoaderComplete} />}
      
      <div className={`flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] p-4 sm:p-8 pt-12 transition-opacity duration-1000 ${showLoader ? 'opacity-0 overflow-hidden h-screen pointer-events-none' : 'opacity-100'}`}>
      <div className="max-w-7xl w-full mx-auto">
        
        {appState === "upload" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7 }} 
            className="space-y-12"
          >
            {/* Header Section */}
            <div className="text-center space-y-6">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500 drop-shadow-sm">
                CareerDNA AI
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Decode Your Career Genome with AI-Powered Resume Intelligence
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
                className={`group relative px-8 py-4 w-full sm:w-auto font-bold text-white rounded-full bg-gradient-to-r from-primary to-secondary overflow-hidden transition-all duration-300 transform will-change-transform ${
                  jdFiles.length === 0 || resumeFiles.length === 0 
                  ? 'opacity-50 hover:translate-y-0 shadow-none' 
                  : 'shadow-[0_0_10px_rgba(14,165,233,0.2)] hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:-translate-y-1'
                }`}
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
                disabled={true}
                className="group relative px-8 py-4 w-full sm:w-auto font-bold text-gray-500 rounded-full glass-panel border border-white/5 bg-black/50 cursor-not-allowed"
                title="Analysis required before downloading"
              >
                <span className="relative flex items-center justify-center gap-2 text-lg tracking-wide">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  Download CareerDNA Report
                </span>
              </button>
            </div>
          </motion.div>
        )}

        {appState === "loading" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5 }} 
            className="flex flex-col items-center justify-center min-h-[60vh] space-y-8"
          >
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
            <p className="text-gray-400 text-center max-w-md">Extracting semantic meaning, matching skills, and ranking candidate suitability. This may take up to a minute.</p>
          </motion.div>
        )}

        {appState === "results" && analysisData && analysisData.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7 }} 
            className="flex flex-col items-center justify-center min-h-[50vh] space-y-10 w-full pb-20"
          >
            
            <div className="flex flex-col items-center justify-center space-y-6 mt-10">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md text-center">
                ✓ Analysis Complete
              </h2>
              <p className="text-gray-400 text-lg text-center">
                {analysisData.length > 1 
                  ? `Analyzed and ranked ${analysisData.length} candidates.` 
                  : `Your personalized CareerDNA report is ready.`}
              </p>
            </div>

            {/* Dynamic Rankings Display */}
            <GlassCard glowColor="accent" className="w-full max-w-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                Candidate Rankings
              </h3>
              <div className="space-y-3">
                {analysisData.map((cand: any, idx: number) => {
                  let medal = <span className="text-xl font-bold text-gray-500 w-8 text-center">#{idx + 1}</span>;
                  if (idx === 0) medal = <span className="text-2xl" title="Rank 1">🥇</span>;
                  else if (idx === 1) medal = <span className="text-2xl" title="Rank 2">🥈</span>;
                  else if (idx === 2) medal = <span className="text-2xl" title="Rank 3">🥉</span>;
                  
                  return (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8">
                          {medal}
                        </div>
                        <span className="text-lg font-semibold text-white truncate max-w-[200px] sm:max-w-[300px]">
                          {cand.candidateName || 'Unknown Candidate'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-3 sm:mt-0 ml-12 sm:ml-0">
                        {cand.error ? (
                          <div className="flex flex-col items-end">
                            <span className="text-red-400 font-bold text-sm bg-red-500/10 px-3 py-1 rounded-md border border-red-500/20 max-w-xs text-right">
                              ⚠️ Error: {cand.error}
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden hidden sm:block">
                              <div className="h-full bg-primary" style={{ width: `${cand.matchPercentage || 0}%` }}></div>
                            </div>
                            <span className="text-primary font-bold min-w-[4rem] text-right">
                              {cand.matchPercentage || 0}% Match
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 w-full max-w-2xl">
              <button 
                onClick={handleDownloadReport}
                disabled={isGeneratingPdf}
                className="group relative px-8 py-4 font-bold text-white text-lg rounded-full bg-gradient-to-r from-primary to-secondary overflow-hidden transition-all duration-300 transform shadow-[0_0_10px_rgba(14,165,233,0.2)] hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none w-full sm:w-auto flex-1 will-change-transform"
              >
                <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:scale-105 transition-transform duration-300 ease-out"></span>
                <span className="relative flex items-center justify-center gap-3 tracking-wide">
                  {isGeneratingPdf ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white/50 border-t-white rounded-full animate-spin" />
                      Generating {analysisData.length > 1 ? 'PDFs' : 'PDF'}...
                    </>
                  ) : (
                    <>
                      📄 Download {analysisData.length > 1 ? 'All Reports' : 'Report'}
                    </>
                  )}
                </span>
              </button>
              
              <button 
                onClick={handleReset}
                className="px-8 py-4 font-bold text-gray-300 text-lg rounded-full glass-panel border border-white/10 hover:text-white hover:bg-white/5 transition-colors w-full sm:w-auto"
              >
                New Analysis
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
    </>
  );
}
