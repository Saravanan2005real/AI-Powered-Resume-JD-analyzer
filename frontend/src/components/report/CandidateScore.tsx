import React from 'react';

interface CandidateScoreProps {
  score: number;
  label: string;
}

export default function CandidateScore({ score, label }: CandidateScoreProps) {
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]';
    if (score >= 70) return 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]';
    return 'text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]';
  };

  const getRingColor = (score: number) => {
    if (score >= 85) return 'text-green-500/20';
    if (score >= 70) return 'text-yellow-500/20';
    return 'text-red-500/20';
  };

  const strokeDasharray = 283; // 2 * PI * 45
  const strokeDashoffset = strokeDasharray - (score / 100) * strokeDasharray;

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-panel rounded-2xl relative overflow-hidden group">
      {/* Background glow */}
      <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      <div className="relative w-32 h-32 flex items-center justify-center mb-4">
        {/* Background circle */}
        <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            className={getRingColor(score)}
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            className={`${getScoreColor(score).split(' ')[0]} transition-all duration-1000 ease-out`}
            strokeLinecap="round"
            style={{
              strokeDasharray: strokeDasharray,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>
        <span className={`text-3xl font-extrabold ${getScoreColor(score)}`}>
          {score}%
        </span>
      </div>
      <h3 className="text-gray-300 font-medium tracking-wider uppercase text-sm">{label}</h3>
    </div>
  );
}
