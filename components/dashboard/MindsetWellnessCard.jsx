'use client';

import { useState, useContext } from 'react';
import { AppContent } from '../../context/AppContext';
import { Sprout, Brain, Zap, Smile } from 'lucide-react';

export default function MindsetWellnessCard() {
  const { healthInsights, language } = useContext(AppContent);
  const [fatigue, setFatigue] = useState(2); // 1-3 scale

  const fatigueLevels = [
    { 
      label: language === 'en' ? "Energetic" : "උද්යෝගිමත්", 
      icon: Smile, color: "text-green-500", bg: "bg-green-500/10" 
    },
    { 
      label: language === 'en' ? "Fatigued" : "වෙහෙසකරයි", 
      icon: Zap, color: "text-warning", bg: "bg-warning/10" 
    },
    { 
      label: language === 'en' ? "Exhausted" : "අධික වෙහෙස", 
      icon: Brain, color: "text-cta", bg: "bg-cta/10" 
    },
  ];

  return (
    <div className="h-full rounded-2xl border border-border bg-card p-6 flex flex-col shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
          <Sprout className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-lg">{language === 'en' ? 'Mindset & Wellness' : 'මානසික සුවතාවය'}</h3>
      </div>

      <div className="mb-6">
        <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-3">
          {language === 'en' ? 'How are you feeling?' : 'ඔබට දැනෙන්නේ කෙසේද?'}
        </p>
        <div className="flex gap-2">
          {fatigueLevels.map((level, i) => {
            const Icon = level.icon;
            const active = fatigue === i + 1;
            return (
              <button
                key={i}
                onClick={() => setFatigue(i + 1)}
                className={`flex-1 flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                  active 
                    ? `border-transparent ${level.bg} ${level.color} shadow-sm` 
                    : "border-border bg-transparent text-foreground/40 hover:border-border/80"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "animate-pulse" : ""}`} />
                <span className="text-[9px] font-bold uppercase">{level.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {!healthInsights ? (
        <div className="flex-grow flex items-center justify-center text-center p-4">
          <p className="text-sm text-foreground/60 italic">
            {language === 'en' 
              ? 'Upload a report to unlock personalized wellness insights.' 
              : 'පුද්ගලීකරණය කළ සුවතාවය පිළිබඳ තොරතුරු ලබා ගැනීමට වාර්තාවක් එක් කරන්න.'}
          </p>
        </div>
      ) : (
        <div className="flex-grow space-y-4">
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-xs text-primary font-bold mb-1 flex items-center gap-1.5">
              <Zap className="w-3 h-3" />
              {language === 'en' ? 'Tailored for your fatigue level' : 'ඔබේ තෙහෙට්ටුවට ගැලපෙන උපදෙස්'}
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {language === 'en' ? (
                <>
                  {fatigue === 1 && "Great! Use this energy for light resistance training or outdoor walking."}
                  {fatigue === 2 && "Listen to your body. Try 10 minutes of guided meditation and light stretching."}
                  {fatigue === 3 && "Rest is priority. Practice deep breathing exercises and ensure 8+ hours of sleep."}
                </>
              ) : (
                <>
                  {fatigue === 1 && "නියමයි! සැහැල්ලු ව්‍යායාම හෝ එළිමහන් ඇවිදීම සඳහා මෙම ශක්තිය භාවිතා කරන්න."}
                  {fatigue === 2 && "ඔබේ ශරීරයට සවන් දෙන්න. මිනිත්තු 10 ක මනෝභාවය සන්සුන් කිරීමේ ව්‍යායාම කරන්න."}
                  {fatigue === 3 && "විවේකය ප්‍රමුඛතාවයයි. ගැඹුරු හුස්ම ගැනීමේ ව්‍යායාම කර පැය 8 කට වඩා නිදාගන්න."}
                </>
              )}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">
              {language === 'en' ? 'Mindset Tips' : 'මානසික උපදෙස්'}
            </p>
            {healthInsights.mindset?.[language]?.map((tip, i) => (
              <p key={i} className="text-sm text-foreground/70 pl-3 border-l-2 border-primary/20 italic">
                "{tip}"
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
