'use client';

import { useContext } from 'react';
import { AppContent } from '../../../context/AppContext';
import AnalysisCard from '../../../components/dashboard/AnalysisCard';
import FoodGuidanceCard from '../../../components/dashboard/FoodGuidanceCard';
import MindsetWellnessCard from '../../../components/dashboard/MindsetWellnessCard';
import { Globe } from 'lucide-react';

export default function PatientDashboard() {
  const { language, setLanguage } = useContext(AppContent);

  return (
    <div className="container-custom py-12">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {language === 'en' ? 'AI-Powered Insights Active' : 'AI තාක්ෂණය ක්‍රියාත්මකයි'}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            {language === 'en' ? 'Patient Dashboard' : 'රෝගී උපකරණ පුවරුව'}
          </h1>
          <p className="text-xl text-foreground/60 mt-2">
            {language === 'en' ? 'Welcome back to your health journey.' : 'ඔබේ සෞඛ්‍ය ගමනට නැවතත් සාදරයෙන් පිළිගනිමු.'}
          </p>
        </div>

        {/* Language Toggle */}
        <div className="flex p-1 bg-secondary/50 rounded-xl border border-border self-start">
          <button 
            onClick={() => setLanguage('en')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              language === 'en' ? 'bg-white text-primary shadow-sm' : 'text-foreground/40 hover:text-foreground/60'
            }`}
          >
            English
          </button>
          <button 
            onClick={() => setLanguage('si')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              language === 'si' ? 'bg-white text-primary shadow-sm' : 'text-foreground/40 hover:text-foreground/60'
            }`}
          >
            සිංහල
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
        <AnalysisCard />
        <FoodGuidanceCard />
        <MindsetWellnessCard />
      </div>
      
      <div className="mt-12 p-8 rounded-3xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-primary/10" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div>
            <h4 className="text-xl font-bold mb-1">Upcoming Milestone: Personalized Recovery Plan</h4>
            <p className="text-foreground/60">Our AI is learning from your data to generate a 30-day recovery roadmap.</p>
          </div>
          <div className="px-6 py-2 rounded-xl bg-white border border-border shadow-sm text-sm font-bold text-primary whitespace-nowrap">
            Coming in Phase 3
          </div>
        </div>
      </div>
    </div>
  );
}
