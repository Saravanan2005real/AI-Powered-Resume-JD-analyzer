"use client";

import { motion } from "framer-motion";
import { 
  Trophy, 
  Target, 
  Briefcase, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  Map, 
  MessageSquare,
  BarChart3
} from "lucide-react";

export default function Dashboard({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Analysis Overview</h2>
          <p className="text-gray-400 mt-1">Based on {data.candidateName}'s Resume against {data.jdAnalysis?.title}</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-4 py-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm text-gray-300 font-medium">Analysis Complete</span>
        </div>
      </div>

      {/* Top Cards: Score & Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* CareerDNA Score */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 md:col-span-1 glass-panel neon-border rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden bg-black/40"
        >
          <div className="absolute top-0 right-0 p-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-300 mb-6">CareerDNA Match</h3>
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="none" className="text-white/10" />
              <motion.circle 
                cx="50" cy="50" r="45" 
                stroke="url(#score-gradient)" 
                strokeWidth="8" 
                fill="none" 
                strokeLinecap="round"
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * (data.matchPercentage || 0)) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="score-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{data.matchPercentage || 0}%</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-emerald-400 font-medium">
            {data.matchPercentage >= 80 ? 'Top Tier Candidate' : 'Average Match'}
          </p>
        </motion.div>

        {/* Small Metric Cards */}
        <div className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: "Skills Match", value: `${data.matchScores?.skills || 0}%`, icon: <Target />, color: "text-blue-400" },
            { title: "Experience Fit", value: `${data.matchScores?.experience || 0}%`, icon: <Briefcase />, color: "text-purple-400" },
            { title: "ATS Optimization", value: `${data.matchScores?.ats || 0}%`, icon: <TrendingUp />, color: "text-emerald-400" }
          ].map((metric, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (idx * 0.1) }}
              className="glass-panel border-white/5 rounded-2xl p-6 flex flex-col justify-between bg-black/20 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-white/5 ${metric.color}`}>
                  {metric.icon}
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">{metric.value}</p>
                <p className="text-sm text-gray-400 font-medium">{metric.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Skill Gap Analysis */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel border-white/5 rounded-2xl p-6 bg-black/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Zap className="text-yellow-400 w-5 h-5" />
              <h3 className="text-xl font-bold text-white">Skill Gap Analysis</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <h4 className="text-sm font-semibold text-emerald-400 mb-3">Matched Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.skillGapAnalysis?.matchedSkills?.slice(0, 8).map((skill: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-md border border-emerald-500/20">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <h4 className="text-sm font-semibold text-red-400 mb-3">Missing Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.skillGapAnalysis?.missingSkills?.slice(0, 8).map((skill: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-md border border-red-500/20">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 30/60/90 Day Action Plan Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-panel border-white/5 rounded-2xl p-6 bg-black/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Map className="text-primary w-5 h-5" />
              <h3 className="text-xl font-bold text-white">Onboarding Action Plan</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { day: "30 Days", title: "Ramp Up", desc: data.actionPlan?.day30?.[0] || "Get familiar with the core stack." },
                { day: "60 Days", title: "Contribution", desc: data.actionPlan?.day60?.[0] || "Begin taking on larger features." },
                { day: "90 Days", title: "Leadership", desc: data.actionPlan?.day90?.[0] || "Establish full ownership." }
              ].map((phase, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
                  <h4 className="text-sm font-bold text-primary mb-1">{phase.day}</h4>
                  <h5 className="text-white font-medium mb-2">{phase.title}</h5>
                  <p className="text-xs text-gray-400">{phase.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-8">
          
          {/* Recruiter Verdict */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-panel neon-border rounded-2xl p-6 bg-black/40 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="text-emerald-400 w-6 h-6" />
              <h3 className="text-xl font-bold text-white">Recruiter Verdict</h3>
            </div>
            <p className="text-3xl font-extrabold text-white mb-2">{data.recruiterVerdict?.verdict}</p>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              {data.recruiterVerdict?.reasoning}
            </p>
          </motion.div>

          {/* Interview Questions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-panel border-white/5 rounded-2xl p-6 bg-black/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="text-secondary w-5 h-5" />
              <h3 className="text-lg font-bold text-white">Suggested Questions</h3>
            </div>
            <div className="space-y-4">
              {data.interviewReadiness?.potentialQuestions?.slice(0, 3).map((q: string, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <p className="text-sm text-gray-300">"{q}"</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
