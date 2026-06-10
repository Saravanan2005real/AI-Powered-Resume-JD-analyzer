"use client";

import { motion } from "framer-motion";
import { Download, Printer, Share2, FileText, CheckCircle, AlertTriangle } from "lucide-react";

export default function ReportSection({ data, onDownload, isGenerating }: { data: any, onDownload: () => void, isGenerating: boolean }) {
  if (!data) return null;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20 mt-16">
      
      {/* Report Actions Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel border-white/5 rounded-2xl p-6 bg-black/40">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="text-primary" />
            Detailed Analysis Report
          </h2>
          <p className="text-sm text-gray-400 mt-1">Generated for {data.candidateName} on {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button 
            onClick={onDownload}
            disabled={isGenerating}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all disabled:opacity-70"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download PDF
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="glass-panel border-white/5 rounded-2xl bg-white shadow-2xl overflow-hidden p-8 sm:p-12 text-slate-900">
        
        {/* Document Header */}
        <div className="border-b-2 border-slate-200 pb-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Candidate Evaluation</h1>
              <p className="text-lg text-slate-600">Confidential Report</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">CareerDNA AI</p>
              <p className="text-sm text-slate-500">Talent Intelligence</p>
            </div>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">1. Executive Summary</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            {data.executiveSummary?.profile}
          </p>
          <p className="text-slate-600 leading-relaxed">
            {data.executiveSummary?.suitability}
          </p>
        </section>

        {/* 2. Key Strengths */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">2. Key Strengths</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.executiveSummary?.strengths?.map((strength: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-700">{strength}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Areas of Concern */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">3. Areas for Improvement</h2>
          <div className="bg-amber-50 rounded-lg p-5 border border-amber-100">
            {data.executiveSummary?.opportunities?.map((opp: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3 mb-3 last:mb-0">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800">
                    {opp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Career DNA Roadmap */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">4. Target Role Roadmap</h2>
          <div className="space-y-6">
            <div className="relative pl-6 border-l-2 border-primary/30">
              <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
              <h4 className="font-bold text-slate-800">Current DNA</h4>
              <p className="text-slate-600 text-sm">{data.roadmap?.currentDNA}</p>
            </div>
            <div className="relative pl-6 border-l-2 border-slate-200">
              <div className="absolute w-3 h-3 bg-slate-300 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
              <h4 className="font-bold text-slate-800">Target DNA</h4>
              <p className="text-slate-600 text-sm">{data.roadmap?.targetDNA}</p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-400">
            This report is AI-generated based on the provided resume and job description. 
            It should be used as a supplementary tool in the hiring process, not as the sole decision-maker.
          </p>
        </div>

      </div>
    </div>
  );
}
