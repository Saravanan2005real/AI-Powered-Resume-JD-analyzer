"use client";

import { motion } from "framer-motion";
import { Download, Printer, Share2, FileText, CheckCircle, AlertTriangle } from "lucide-react";

export default function ReportSection() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* Report Actions Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel border-white/5 rounded-2xl p-6 bg-black/40">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="text-primary" />
            Detailed Analysis Report
          </h2>
          <p className="text-sm text-gray-400 mt-1">Generated for John Doe on {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all">
            <Download className="w-4 h-4" /> Download PDF
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
          <p className="text-slate-600 leading-relaxed">
            The candidate demonstrates a very strong alignment with the Senior Frontend Developer role requirements. 
            With an overall CareerDNA match score of 87%, the candidate excels in core frontend technologies (React, Next.js, Tailwind) 
            and possesses the required 4+ years of professional experience. The primary area for potential onboarding focus is GraphQL integration.
          </p>
        </section>

        {/* 2. Key Strengths */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">2. Key Strengths</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Deep expertise in React ecosystem",
              "Strong sense of modern UI/UX implementation",
              "Demonstrated leadership in agile environments",
              "Excellent communication skills highlighted in previous roles"
            ].map((strength, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-700">{strength}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Areas of Concern */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">3. Areas of Concern</h2>
          <div className="bg-amber-50 rounded-lg p-5 border border-amber-100">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 mb-1">Missing direct GraphQL experience</h4>
                <p className="text-sm text-amber-800">
                  The JD emphasizes GraphQL for the backend BFF layer. The candidate has predominantly used REST APIs. 
                  Given their senior level, this is a minor gap that can be addressed during the first 30 days of onboarding.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Experience Timeline Breakdown */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">4. Experience Alignment</h2>
          <div className="space-y-6">
            <div className="relative pl-6 border-l-2 border-primary/30">
              <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
              <h4 className="font-bold text-slate-800">Frontend Engineer @ TechCorp</h4>
              <p className="text-sm text-slate-500 mb-2">2021 - Present (2.5 years)</p>
              <p className="text-slate-600 text-sm">Directly aligns with the JD's requirement for building scalable web apps using Next.js.</p>
            </div>
            <div className="relative pl-6 border-l-2 border-slate-200">
              <div className="absolute w-3 h-3 bg-slate-300 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
              <h4 className="font-bold text-slate-800">UI Developer @ WebSolutions</h4>
              <p className="text-sm text-slate-500 mb-2">2019 - 2021 (2 years)</p>
              <p className="text-slate-600 text-sm">Provides the foundational JavaScript and CSS expertise requested in the "Basic Qualifications" section.</p>
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
