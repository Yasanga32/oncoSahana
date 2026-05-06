"use client";

import React from 'react';

export default function StatsCard({ title, value, icon, description, color }) {
  // Extract base color for the glow effect
  const glowColor = color.includes('blue') ? 'rgba(59, 130, 246, 0.1)' : 
                    color.includes('amber') ? 'rgba(245, 158, 11, 0.1)' :
                    color.includes('emerald') ? 'rgba(16, 185, 129, 0.1)' :
                    'rgba(168, 85, 247, 0.1)';

  return (
    <div className="relative group overflow-hidden flex flex-col gap-4 rounded-[2.5rem] bg-white p-8 shadow-2xl shadow-blue-50/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-100">
      {/* Decorative gradient blob */}
      <div 
        className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl opacity-60"
        style={{ backgroundColor: glowColor }}
      />
      
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          {title}
        </span>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color} bg-opacity-10 ring-4 ring-white transition-transform duration-500 group-hover:scale-110`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
      </div>
      
      <div className="flex flex-col gap-1">
        <h3 className="text-4xl font-black tracking-tighter text-zinc-800">
          {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}
        </h3>
        {description && (
          <p className="text-xs font-bold text-zinc-400 flex items-center gap-2">
             <span className={`inline-block h-1.5 w-1.5 rounded-full ${color.split(' ')[0]}`} />
            {description}
          </p>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-zinc-50">
        <div 
          className={`h-full transition-all duration-1000 ${color.split(' ')[0]}`} 
          style={{ width: '35%', opacity: 0.4 }} 
        />
      </div>
    </div>
  );
}
