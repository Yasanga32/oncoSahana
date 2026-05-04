'use client';

import { useContext } from 'react';
import { AppContent } from '../../context/AppContext';
import { Utensils, Info, Check } from 'lucide-react';

export default function FoodGuidanceCard() {
  const { healthInsights, language } = useContext(AppContent);

  const tips = healthInsights?.food?.[language] || [];

  return (
    <div className="h-full rounded-2xl border border-border bg-card p-6 flex flex-col shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
          <Utensils className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-lg">{language === 'en' ? 'Food Guidance' : 'ආහාර උපදෙස්'}</h3>
      </div>

      {!healthInsights ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
          <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-3">
            <Info className="w-6 h-6 text-foreground/20" />
          </div>
          <p className="text-sm text-foreground/60">
            {language === 'en' 
              ? 'Upload a report to see personalized food guidance.' 
              : 'පුද්ගලීකරණය කළ ආහාර උපදෙස් බැලීමට වාර්තාවක් එක් කරන්න.'}
          </p>
        </div>
      ) : (
        <div className="flex-grow space-y-3">
          <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">
            {language === 'en' ? 'Recommended for you' : 'ඔබ සඳහා නිර්දේශිත'}
          </p>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex gap-3 text-sm text-foreground/80 leading-relaxed group">
                <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-success/10 text-success flex items-center justify-center group-hover:bg-success group-hover:text-white transition-colors">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {healthInsights && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-[10px] text-foreground/50 italic">
            {language === 'en' 
              ? 'Suggestions generated based on your latest report.' 
              : 'ඔබේ නවතම වාර්තාව මත පදනම්ව ජනනය කරන ලද යෝජනා.'}
          </p>
        </div>
      )}
    </div>
  );
}
