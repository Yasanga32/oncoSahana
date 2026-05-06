"use client";

import { Sparkles, TrendingUp, AlertCircle, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { feedbackApi } from "@/lib/api/feedback";

export default function SummarySection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await feedbackApi.getSummary();
      if (res.success && typeof res.data !== "string") {
        setData(res.data);
      } else if (typeof res.data === "string") {
        setError(res.data);
      } else {
        setError("Could not generate summary.");
      }
    } catch (err) {
      setError("Failed to connect to AI service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="mb-10 w-full animate-pulse rounded-[2.5rem] border border-blue-50 bg-white p-10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-50"></div>
          <div className="space-y-2">
            <div className="h-4 w-48 rounded bg-blue-50"></div>
            <div className="h-3 w-24 rounded bg-blue-50/50"></div>
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <div className="h-5 w-full rounded-xl bg-blue-50/30"></div>
          <div className="h-5 w-4/5 rounded-xl bg-blue-50/30"></div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="mb-10 flex items-center justify-between rounded-[2rem] border border-red-100 bg-white p-8 shadow-xl shadow-red-100/50">
        <div className="flex items-center gap-4 text-red-500">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
            <AlertCircle size={24} />
          </div>
          <div>
            <span className="block text-sm font-black uppercase tracking-tight">AI Generation Halted</span>
            <span className="text-xs font-bold opacity-60">{error}</span>
          </div>
        </div>
        <button 
          onClick={fetchSummary} 
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-red-500 shadow-lg border border-red-50 hover:bg-red-500 hover:text-white transition-all active:scale-90"
        >
          <RefreshCcw size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="group relative mb-12 overflow-hidden rounded-[3rem] border border-blue-100 bg-white p-10 shadow-2xl shadow-blue-100/50 transition-all hover:shadow-blue-200/60">
      {/* Decorative Gradients */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-400/10 blur-[100px] transition-transform duration-1000 group-hover:scale-150" />
      <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-400/10 blur-[100px] transition-transform duration-1000 group-hover:scale-150" />
      
      <div className="absolute right-10 top-10 text-blue-500/5 transition-all duration-700 group-hover:scale-125 group-hover:rotate-12">
        <Sparkles size={160} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-200 transform transition-transform group-hover:rotate-6">
              <Sparkles size={28} fill="white" className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600/60">AI System Active</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-zinc-800">Trend Intelligence</h3>
              <p className="text-sm font-bold text-zinc-400">7-Day Sentiment Analysis Engine</p>
            </div>
          </div>
          <button 
            onClick={fetchSummary} 
            className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-blue-50 text-blue-500 transition-all hover:bg-blue-600 hover:text-white hover:rotate-180 active:scale-90" 
            title="Refresh AI Insights"
          >
            <RefreshCcw size={20} />
          </button>
        </div>

        <div className="mt-10 relative">
          <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-transparent rounded-full opacity-20" />
          <p className="text-xl font-bold leading-relaxed text-zinc-700 italic">
            "{data?.summary}"
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-blue-500 mr-4">
            <TrendingUp size={16} strokeWidth={3} /> Detection Themes
          </div>
          {data?.top_themes.map((theme) => (
            <span 
              key={theme} 
              className="rounded-2xl border border-blue-50 bg-blue-50/50 px-6 py-2.5 text-sm font-black text-blue-600 transition-all hover:border-blue-200 hover:bg-white hover:shadow-lg hover:-translate-y-1"
            >
              {theme.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
