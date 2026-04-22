"use client";

import { Search, Filter, Terminal } from "lucide-react";

interface SidebarProps {
  onSearch: (query: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function Sidebar({ onSearch, categories, selectedCategory, onCategoryChange }: SidebarProps) {
  return (
    <aside className="w-[320px] h-screen bg-brand-yellow border-r-4 border-brand-black flex flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 pt-7 pb-6 border-b-2 border-brand-black/15 shrink-0">
        <div className="w-8 h-8 bg-brand-black flex items-center justify-center shrink-0">
          <Terminal className="text-brand-yellow w-4 h-4" />
        </div>
        <div>
          <h1 className="text-base font-black uppercase tracking-tighter leading-none">
            Vyom Prompt Style
          </h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-brand-black/50 mt-0.5">
            Prompt Library
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 pt-5 pb-4 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-3 h-3 text-brand-black/50" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-black/50">Search Index</span>
        </div>
        <input
          type="text"
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search prompts..."
          className="w-full bg-transparent border-b-2 border-brand-black py-1.5 text-sm font-semibold placeholder:text-brand-black/30 focus:outline-none focus:border-black transition-colors"
        />
      </div>

      {/* Categories */}
      <div className="px-6 pt-2 pb-4 shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-3 h-3 text-brand-black/50" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-black/50">Categories</span>
        </div>
      </div>

      {/* Category List — scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-0.5">
        <button
          onClick={() => onCategoryChange("All")}
          className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
            selectedCategory === "All"
              ? "bg-brand-black text-brand-yellow"
              : "text-brand-black hover:bg-brand-black/10"
          }`}
        >
          All Prompts
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
              selectedCategory === cat
                ? "bg-brand-black text-brand-yellow"
                : "text-brand-black hover:bg-brand-black/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t-2 border-brand-black/15 text-[9px] font-mono uppercase tracking-tight text-brand-black/40 shrink-0">
        Status: Optimal &nbsp;·&nbsp; Corpus: 10,256 Items
      </div>
    </aside>
  );
}
