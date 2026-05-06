'use client';

import { useState, useContext } from 'react';
import { AppContent } from '../../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MessageSquare, Send, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function FeedbackPage() {
  const { userData } = useContext(AppContent);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Improvement",
    submitterName: userData?.name || "",
    submitterEmail: userData?.email || ""
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (formData.description.length < 20) {
      return toast.error("Description must be at least 20 characters long");
    }

    setLoading(true);
    try {
      // Using the rewrite defined in next.config.mjs
      const payload = {
        ...formData,
        appId: process.env.NEXT_PUBLIC_APP_ID || 'cancer-platform'
      };
      
      const response = await axios.post('/feedback-api/feedback', payload);
      
      if (response.data) {
        toast.success("Feedback submitted successfully! Our AI is analyzing it.");
        setSubmitted(true);
        setFormData({
          title: "",
          description: "",
          category: "Improvement",
          submitterName: userData?.name || "",
          submitterEmail: userData?.email || ""
        });
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Error submitting feedback";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container-custom py-20 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-success/10 text-success flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
        <p className="text-foreground/60 max-w-md mb-8">
          Your feedback has been received and is being analyzed by our AI system to help us improve oncoSahana.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="px-8 py-3 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-all"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="container-custom py-12 max-w-3xl">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
          <MessageSquare className="w-3 h-3" />
          Feedback Portal
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Help Us Grow</h1>
        <p className="text-xl text-foreground/60 leading-relaxed">
          Your insights are valuable. Share your thoughts, report bugs, or suggest new features to help us build a better platform for everyone.
        </p>
      </div>

      <form onSubmit={onSubmitHandler} className="space-y-8 bg-card border border-border p-8 rounded-3xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Title */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-foreground/80">Subject / Title</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={onChangeHandler}
              placeholder="Briefly describe your feedback"
              className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">Category</label>
            <select 
              name="category"
              value={formData.category}
              onChange={onChangeHandler}
              className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
            >
              <option value="Bug">Bug Report</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Improvement">General Improvement</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Submitter Name (Optional) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">Your Name (Optional)</label>
            <input 
              type="text" 
              name="submitterName"
              value={formData.submitterName}
              onChange={onChangeHandler}
              className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80 flex justify-between">
            Detailed Description
            <span className={`text-[10px] ${formData.description.length < 20 ? 'text-cta' : 'text-success'}`}>
              {formData.description.length} / 20 min characters
            </span>
          </label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={onChangeHandler}
            rows={6}
            placeholder="Please provide as much detail as possible. If it's a bug, describe how to reproduce it..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            required
          />
          {formData.description.length > 0 && formData.description.length < 20 && (
            <p className="text-xs text-cta flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" />
              Description must be at least 20 characters long.
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button 
            type="submit"
            disabled={loading || formData.description.length < 20}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-cta text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cta/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending to AI System...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Feedback
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-foreground/40 mt-4">
            Our AI system automatically categorizes and prioritizes feedback for our development team.
          </p>
        </div>
      </form>
    </div>
  );
}
