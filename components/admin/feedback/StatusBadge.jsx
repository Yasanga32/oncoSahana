"use client";

export default function StatusBadge({ type, value, loading, className = "" }) {
  const getStyles = () => {
    // Status Styles (Pure Light Theme)
    if (type === "status") {
      switch (value) {
        case "New":
          return "bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-50";
        case "In Review":
          return "bg-amber-50 text-amber-600 border-amber-100 shadow-sm shadow-amber-50";
        case "Resolved":
          return "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-50";
        default:
          return "bg-zinc-50 text-zinc-500 border-zinc-100";
      }
    }

    // Sentiment Styles (Pure Light Theme)
    if (type === "sentiment") {
      switch (value) {
        case "Positive":
          return "bg-emerald-50 text-emerald-600 border-emerald-100";
        case "Neutral":
          return "bg-zinc-50 text-zinc-500 border-zinc-100";
        case "Negative":
          return "bg-rose-50 text-rose-600 border-rose-100";
        default:
          return "bg-zinc-50 text-zinc-500 border-zinc-100";
      }
    }

    return "";
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-4 py-1 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${getStyles()} ${loading ? "animate-pulse opacity-70" : ""} ${className}`}>
      {loading ? "Updating..." : value}
    </span>
  );
}
