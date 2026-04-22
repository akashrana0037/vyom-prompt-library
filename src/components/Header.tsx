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
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-border-muted px-6 py-3">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-6">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-foreground flex items-center justify-center rounded-2xl">
            <Terminal className="w-5 h-5 text-background" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-sm font-black uppercase tracking-tight leading-none">
              Vyom Prompt Library
            </h1>
            <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest mt-1">
              Technical Studio v1.2
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 group-focus-within:text-accent-blue transition-colors" />
          <input
            type="text"
            placeholder="Search prompt, style, or subject..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-background border border-border-muted rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/5 transition-all"
          />
        </div>

        {/* Actions & Filters */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Category Dropdown (Mobile/Tablet) or List (Desktop) */}
          <div className="relative group hidden lg:block">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="appearance-none bg-background border border-border-muted rounded-2xl py-2.5 px-5 pr-10 text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:border-foreground/20 transition-colors focus:outline-none focus:border-accent-blue"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-foreground/30 pointer-events-none" />
          </div>

          <div className="h-10 px-4 bg-foreground text-background rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-accent-blue transition-colors">
            <LayoutList className="w-4 h-4" />
            {resultCount} Prompts
          </div>
        </div>
      </div>
    </header>
  );
}
