"use client";

import { Search, Grid, LayoutList, Terminal, ChevronDown } from "lucide-react";

interface HeaderProps {
  onSearch: (query: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  resultCount: number;
}

export default function Header({
  onSearch,
  categories,
  selectedCategory,
  onCategoryChange,
  resultCount,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel px-6 py-4">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-8">
        {/* Logo & Brand */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 bg-primary flex items-center justify-center">
            <Terminal className="w-6 h-6 text-black" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-black uppercase tracking-tighter leading-none text-white">
              Vyom Prompt Studio
            </h1>

            <p className="text-[9px] font-mono text-primary uppercase tracking-[0.3em] mt-1">
              Data Synchronization v1.0
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-3xl relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="SYSTEM_SEARCH: Enter prompt keywords, styles, or IDs..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/5 py-3 pl-12 pr-4 text-sm font-mono text-white placeholder:text-white/10 focus:outline-none focus:border-primary transition-all"
          />
        </div>

        {/* Actions & Filters */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Category Dropdown (Mobile/Tablet) or List (Desktop) */}
          <div className="relative group hidden lg:block">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="appearance-none bg-black/40 border border-white/5 py-3 px-6 pr-12 text-[10px] font-black uppercase tracking-widest text-white cursor-pointer hover:border-primary/50 transition-colors focus:outline-none focus:border-primary"
            >
              <option value="All">CATEGORY: ALL_DATA</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.toUpperCase()}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
          </div>

          <div className="h-12 px-6 bg-primary text-black flex items-center gap-3 text-[11px] font-black uppercase tracking-tighter cursor-default">
            <Grid className="w-4 h-4" />
            {resultCount.toLocaleString()} DATA_POINTS
          </div>
        </div>
      </div>
    </header>
  );
}
