import React from 'react';

interface RoadmapItem {
  milestone: string;
  title: string;
  description: string;
  completed: boolean;
}

interface CareerRoadmapProps {
  roadmap: RoadmapItem[];
}

export default function CareerRoadmap({ roadmap }: CareerRoadmapProps) {
  return (
    <div className="glass-panel p-6 md:p-8 rounded-2xl">
      <h3 className="text-xl font-bold text-white mb-8 border-b border-white/10 pb-4">Learning Roadmap</h3>
      
      <div className="relative border-l-2 border-white/10 ml-3 md:ml-6 space-y-8">
        {roadmap.map((item, index) => (
          <div key={index} className="relative pl-8 md:pl-10 group animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${index * 150}ms` }}>
            {/* Timeline Dot */}
            <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-surface transition-colors duration-300
              ${item.completed ? 'bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-gray-600 group-hover:bg-gray-400 group-hover:shadow-[0_0_10px_rgba(156,163,175,0.5)]'}
            `}></div>
            
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-2">
              <span className="text-primary font-mono text-xs uppercase tracking-widest">{item.milestone}</span>
              <h4 className="text-lg font-semibold text-white">{item.title}</h4>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
