import React from 'react';

interface Skill {
  skill: string;
  jdRequirement: number;
  candidateLevel: number;
  status: string;
}

interface SkillHeatmapProps {
  skills: Skill[];
}

export default function SkillHeatmap({ skills }: SkillHeatmapProps) {
  return (
    <div className="glass-panel p-6 md:p-8 rounded-2xl">
      <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Skill Matrix Heatmap</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-3 px-4 text-gray-400 font-medium text-sm tracking-wider uppercase">Skill</th>
              <th className="py-3 px-4 text-gray-400 font-medium text-sm tracking-wider uppercase text-center">Required</th>
              <th className="py-3 px-4 text-gray-400 font-medium text-sm tracking-wider uppercase text-center">Matched</th>
              <th className="py-3 px-4 text-gray-400 font-medium text-sm tracking-wider uppercase text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {skills.map((s, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors group">
                <td className="py-4 px-4 font-medium text-gray-200">{s.skill}</td>
                
                <td className="py-4 px-4">
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div 
                        key={`req-${level}`} 
                        className={`w-4 h-4 rounded-sm ${level <= s.jdRequirement ? 'bg-primary shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-surface border border-white/10'}`}
                      />
                    ))}
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div 
                        key={`match-${level}`} 
                        className={`w-4 h-4 rounded-sm transition-all duration-500 delay-${level * 100} ${
                          level <= s.candidateLevel 
                            ? (s.candidateLevel >= s.jdRequirement ? 'bg-accent shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]') 
                            : 'bg-surface border border-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </td>
                
                <td className="py-4 px-4 text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${s.status === 'Excellent' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                    ${s.status === 'Good' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                    ${s.status === 'Average' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : ''}
                    ${s.status === 'Gap' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                  `}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
