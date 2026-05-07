'use client';

import { useState, useContext, useRef } from 'react';
import { AppContent } from '../../context/AppContext';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FileText, Upload, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AnalysisCard() {
  const { setHealthInsights } = useContext(AppContent);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const isImage = selectedFile.type.startsWith('image/');
      const isPDF = selectedFile.type === 'application/pdf';

      if (!isImage && !isPDF) {
        toast.error("Please upload an image or a PDF of your report");
        return;
      }

      setFile(selectedFile);
      setPreview(isImage ? URL.createObjectURL(selectedFile) : 'pdf-placeholder');
    }
  };

  const analyzeReport = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API Key is missing. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      // Using 1.5 Flash as it is highly optimized for document and image analysis
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Convert file to base64
      const base64Data = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
      });

      const prompt = `
        Analyze this medical report and provide personalized health suggestions.
        Provide everything in TWO languages: English (en) and Sinhala (si).
        
        Focus on:
        1. Nutrition/Food Guidance: What should the user eat or avoid?
        2. Mindset/Wellness: How should they manage stress, fatigue, or mental health?
        3. Key Insights: Summarize the most important markers from the report.

        Respond ONLY in JSON format with the following structure:
        {
          "food": {
            "en": ["suggestion 1", "suggestion 2"],
            "si": ["සිංහල උපදෙස් 1", "සිංහල උපදෙස් 2"]
          },
          "mindset": {
            "en": ["wellness tip 1", "wellness tip 2"],
            "si": ["සිංහල මානසික උපදෙස් 1", "සිංහල මානසික උපදෙස් 2"]
          },
          "insights": {
            "en": ["key finding 1", "key finding 2"],
            "si": ["සිංහල සොයාගැනීම 1", "සිංහල සොයාගැනීම 2"]
          },
          "summary": {
            "en": "Short 1-sentence summary",
            "si": "කෙටි සිංහල සාරාංශය"
          }
        }
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: file.type
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();

      // Extract JSON from response (handling potential markdown blocks)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const insights = JSON.parse(jsonMatch[0]);
        setHealthInsights(insights);
        toast.success("Analysis complete!");
      } else {
        throw new Error("Failed to parse AI response");
      }

    } catch (error) {
      console.error("Analysis Error:", error);
      toast.error(error.message || "Failed to analyze report");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setHealthInsights(null);
  };

  return (
    <div className="h-full rounded-2xl border border-border bg-card p-6 flex flex-col shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <FileText className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-lg">Report Analysis</h3>
      </div>

      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-secondary/20 hover:bg-secondary/40 hover:border-primary/50 transition-all cursor-pointer p-4 text-center"
        >
          <Upload className="w-8 h-8 text-foreground/40 mb-2" />
          <p className="text-sm font-medium">Upload Medical Report</p>
          <p className="text-xs text-foreground/50 mt-1">Images (PNG, JPG) or PDF</p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,application/pdf"
          />
        </div>
      ) : (
        <div className="flex-grow flex flex-col gap-4">
          <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-black/5 flex items-center justify-center">
            {preview === 'pdf-placeholder' ? (
              <div className="flex flex-col items-center gap-2">
                <div className="p-4 rounded-full bg-red-500/10 text-red-500">
                  <FileText className="w-10 h-10" />
                </div>
                <p className="text-xs font-bold text-foreground/60 uppercase">{file?.name}</p>
              </div>
            ) : (
              <img src={preview} alt="Report Preview" className="w-full h-full object-contain" />
            )}
            {!loading && (
              <button
                onClick={reset}
                className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={analyzeReport}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Document...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Analyze with Gemini
              </>
            )}
          </button>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-[10px] text-foreground/40 uppercase tracking-wider font-bold">
        <AlertCircle className="w-3 h-3" />
        Medical data is processed securely via Gemini AI
      </div>
    </div>
  );
}
