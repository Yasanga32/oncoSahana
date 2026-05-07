'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import { AppContent } from '../../../context/AppContext';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send, Loader2, Bot, User, ShieldAlert, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AISupport() {
  const { language } = useContext(AppContent);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Hello! I'm your oncoSahana AI assistant. I'm here to provide support, answer your health questions, and guide you through your journey. How are you feeling today?\n\nආයුබෝවන්! මම ඔබේ oncoSahana AI සහායකයා. ඔබට සහාය වීමට, ඔබේ සෞඛ්‍ය ප්‍රශ්නවලට පිළිතුරු දීමට සහ ඔබේ ගමන පුරා ඔබට මග පෙන්වීමට මම මෙහි සිටිමි. අද ඔබට කොහොමද?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API Key is missing. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: "You are oncoSahana, a compassionate AI health assistant for cancer patients. Provide medical information, emotional support, and lifestyle guidance. ALWAYS include a disclaimer that you are an AI and not a doctor. Be empathetic. You support both English and Sinhala."
      });

      // Gemini history MUST start with a 'user' message. 
      // We skip our initial 'ai' welcome message for the API history.
      const history = messages
        .filter((m, i) => i > 0 || m.role === 'user')
        .map(m => ({
          role: m.role === 'ai' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      const chat = model.startChat({ history });

      const result = await chat.sendMessage(input);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'ai', content: text }]);
    } catch (error) {
      console.error("Chat Error:", error);
      toast.error("Failed to get response from AI assistant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-8 h-[calc(100vh-5rem)] flex flex-col max-w-4xl">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            AI Support
            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-widest">Live</span>
          </h1>
          <p className="text-foreground/60 text-sm">Empathetic care, instant answers.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-warning uppercase bg-warning/5 px-3 py-1.5 rounded-lg border border-warning/20">
          <ShieldAlert className="w-3 h-3" />
          AI is not a substitute for professional medical advice
        </div>
      </header>

      <div className="flex-grow flex flex-col overflow-hidden border border-border rounded-3xl bg-card shadow-xl relative">
        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-border">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'ai' ? 'bg-primary/10 text-primary' : 'bg-cta/10 text-cta'
                }`}>
                {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'ai'
                ? 'bg-secondary/50 text-foreground border border-border rounded-tl-none'
                : 'bg-primary text-white shadow-lg shadow-primary/10 rounded-tr-none'
                }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-secondary/50 p-4 rounded-2xl rounded-tl-none border border-border">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card">
          <form onSubmit={handleSend} className="flex gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'en' ? "Ask me anything about your care..." : "ඔබේ සෞඛ්‍යය ගැන ඕනෑම දෙයක් අසන්න..."}
              className="flex-grow px-5 py-3.5 rounded-2xl bg-secondary/30 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm pr-12"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-30 disabled:shadow-none"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] text-foreground/40 font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-primary" />
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </div>
    </div>
  );
}
