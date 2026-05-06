"use client";

import { Filter, ChevronDown, ArrowUpDown, Clock, Zap, Smile, Search } from "lucide-react";

const CATEGORIES = ["All", "Bug", "Feature Request", "Improvement", "Other"];
const STATUSES = ["All Statuses", "New", "In Review", "Resolved"];
const SORTS = [
  { value: "date", label: "Newest First", icon: <Clock size={14} /> },
  { value: "priority", label: "Highest Priority", icon: <Zap size={14} /> },
  { value: "sentiment", label: "AI Sentiment", icon: <Smile size={14} /> },
];

export default function FilterBar({
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  selectedSort,
  onSortChange,
  searchTerm,
  onSearchChange,
}) {
  const currentSort = SORTS.find(s => s.value === selectedSort) || SORTS[0];

  return (
    <div className="flex flex-col gap-6 rounded-[2.5rem] bg-white/80 backdrop-blur-md border border-white p-5 shadow-2xl shadow-blue-100/50 lg:flex-row lg:items-center lg:justify-between lg:p-5">
      {/* Search Bar */}
      <div className="relative flex flex-1 items-center">
        <div className="absolute left-5 text-blue-500">
          <Search size={20} className="stroke-[3px]" />
        </div>
        <input
          type="text"
          placeholder="Search feedback insights..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-14 w-full rounded-2xl border-none bg-blue-50/50 pl-14 pr-6 text-sm font-bold text-blue-900 outline-none ring-2 ring-transparent transition-all focus:ring-blue-500/20 focus:bg-white focus:shadow-xl lg:max-w-md placeholder:text-blue-300"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none px-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`whitespace-nowrap rounded-2xl px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
              selectedCategory === cat
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                : "text-blue-400 hover:bg-blue-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Selectors Group */}
      <div className="flex flex-col gap-4 sm:flex-row px-2">
        {/* Status Dropdown */}
        <div className="relative inline-flex items-center group">
          <div className="flex h-12 w-full items-center justify-between gap-3 rounded-2xl bg-emerald-50 px-5 text-xs font-black uppercase tracking-tighter text-emerald-600 border border-emerald-100 transition-all group-hover:bg-emerald-100 sm:w-44">
            <span className="truncate">
              {selectedStatus === "" ? "Any Status" : selectedStatus}
            </span>
            <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />

            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="absolute inset-0 w-full cursor-pointer opacity-0"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status === "All Statuses" ? "" : status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="relative inline-flex items-center group">
          <div className="flex h-12 w-full items-center justify-between gap-3 rounded-2xl bg-purple-50 px-5 text-xs font-black uppercase tracking-tighter text-purple-600 border border-purple-100 transition-all group-hover:bg-purple-100 sm:w-48">
            <div className="flex items-center gap-2 truncate">
              <ArrowUpDown size={14} />
              <span>{currentSort.label}</span>
            </div>
            <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />

            <select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
              className="absolute inset-0 w-full cursor-pointer opacity-0"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
