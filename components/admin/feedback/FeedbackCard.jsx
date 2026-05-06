"use client";

import { useState } from "react";
import StatusBadge from "./StatusBadge";
import { Calendar, User, Mail, Sparkles, ChevronDown, AlertCircle, Trash2, X, RefreshCw, Zap } from "lucide-react";
import { feedbackApi } from "@/lib/api/feedback";

export default function FeedbackCard({ feedback, onDelete }) {
  const [status, setStatus] = useState(feedback.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [localFeedback, setLocalFeedback] = useState(feedback);

  const getPriorityColor = (priority) => {
    if (!priority) return "bg-zinc-100 text-zinc-400";
    if (priority >= 8) return "bg-rose-500 text-white shadow-lg shadow-rose-200";
    if (priority >= 5) return "bg-amber-400 text-white shadow-lg shadow-amber-200";
    return "bg-emerald-400 text-white shadow-lg shadow-emerald-200";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleStatusChange = async (newStatus) => {
    const oldStatus = status;
    setIsUpdating(true);
    setUpdateError(null);
    setStatus(newStatus);

    try {
      const response = await feedbackApi.updateFeedback(feedback._id, { status: newStatus });
      if (!response.success) throw new Error(response.message);
    } catch (err) {
      setStatus(oldStatus);
      setUpdateError("Failed to sync status");
      setTimeout(() => setUpdateError(null), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await feedbackApi.deleteFeedback(feedback._id);
      if (response.success && onDelete) onDelete(feedback._id);
    } catch (err) {
      setIsDeleting(false);
      setShowConfirm(false);
      setUpdateError("Failed to delete");
      setTimeout(() => setUpdateError(null), 3000);
    }
  };

  const handleReAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await feedbackApi.reAnalyze(localFeedback._id);
      if (response.success) setLocalFeedback(response.data);
    } catch (err) {
      setUpdateError("AI analysis failed");
      setTimeout(() => setUpdateError(null), 3000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={`group relative flex flex-col gap-6 rounded-[2.5rem] border border-blue-50 bg-white p-8 transition-all duration-700 shadow-xl shadow-blue-50/50 ${isDeleting ? "scale-95 opacity-0 grayscale" : "hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-100/60"}`}>
      
      {/* Action Buttons - Moved to TOP RIGHT (Clean Space) */}
      <div className="absolute right-6 top-6 z-20 flex items-center gap-2 opacity-0 transition-all duration-300 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0">
        {!showConfirm ? (
          <button 
            onClick={() => setShowConfirm(true)} 
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-xl border border-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-90"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        ) : (
          <div className="flex items-center gap-1 overflow-hidden rounded-2xl bg-red-500 p-1.5 shadow-2xl animate-in slide-in-from-right-4">
            <button onClick={handleDelete} disabled={isDeleting} className="px-3 py-1 text-[11px] font-black text-white hover:bg-white/10 rounded-xl">Confirm Delete?</button>
            <button onClick={() => setShowConfirm(false)} className="flex h-7 w-7 items-center justify-center rounded-xl text-white/80 hover:bg-white/20"><X size={14} /></button>
          </div>
        )}
        <button 
          onClick={handleReAnalyze} 
          disabled={isAnalyzing} 
          className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-xl border border-blue-50 text-blue-400 hover:bg-blue-600 hover:text-white transition-all active:scale-90 ${isAnalyzing ? "animate-spin" : ""}`}
          title="AI Re-analyze"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Header Section */}
      <div className="flex flex-col gap-4">
        {/* Status & Category Row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative inline-flex items-center">
            <StatusBadge type="status" value={status} loading={isUpdating} className="ring-4 ring-white" />
            <select 
              value={status} 
              onChange={(e) => handleStatusChange(e.target.value)} 
              className="absolute inset-0 w-full cursor-pointer opacity-0"
            >
              <option value="New">New</option>
              <option value="In Review">In Review</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-50/50 px-4 py-1.5 rounded-full border border-blue-100">
            {localFeedback.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-black leading-tight text-zinc-800 pr-16">
          {localFeedback.title}
        </h3>
      </div>

      {updateError && (
        <div className="flex items-center gap-2 rounded-2xl bg-red-50 border border-red-100 px-5 py-4 text-xs font-bold text-red-600">
          <AlertCircle size={16} /> {updateError}
        </div>
      )}

      {/* Description */}
      <p className="text-[15px] leading-relaxed text-zinc-500 font-bold line-clamp-3">
        {feedback.description}
      </p>

      {/* AI Summary Card */}
      {localFeedback.ai_summary && (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-50/50 to-indigo-50/50 p-6 border border-blue-50/50">
          <div className="absolute -right-6 -bottom-6 text-blue-200/10 transform rotate-12">
            <Sparkles size={100} />
          </div>
          <div className="relative mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            AI Insight
          </div>
          <p className="relative text-[14px] font-bold italic leading-7 text-blue-800/80">
            "{localFeedback.ai_summary}"
          </p>
        </div>
      )}

      {/* Bottom Section - Now contains Priority Score */}
      <div className="mt-auto flex items-end justify-between pt-6 border-t border-zinc-50">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-xs font-bold text-zinc-400 bg-zinc-50/50 px-3 py-2 rounded-2xl border border-zinc-100/50">
            <User size={14} className="text-blue-400" />
            {localFeedback.submitterName || "Anonymous"}
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-zinc-300 px-3">
            <Calendar size={14} />
            {formatDate(localFeedback.createdAt)}
          </div>
          {localFeedback.submitterEmail && (
            <a href={`mailto:${localFeedback.submitterEmail}`} className="flex items-center gap-2 text-[10px] font-black text-blue-400 hover:text-blue-600 bg-blue-50/30 px-3 py-1.5 rounded-xl border border-blue-100/30 w-fit">
              <Mail size={12} /> {localFeedback.submitterEmail}
            </a>
          )}
        </div>

        <div className="flex flex-col items-end gap-4">
          {/* Priority Score - Moved to Bottom Right for clarity */}
          <div className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-lg ${getPriorityColor(localFeedback.ai_priority)}`}>
            <Zap size={18} fill="currentColor" />
            {localFeedback.ai_priority || "0"}
          </div>
          {localFeedback.ai_sentiment && (
            <StatusBadge type="sentiment" value={localFeedback.ai_sentiment} className="shadow-none border-none text-[9px] bg-transparent" />
          )}
        </div>
      </div>
    </div>
  );
}
