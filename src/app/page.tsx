"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import PromptCard from "@/components/PromptCard";
import promptsData from "@/data/prompts.json";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = new Set(promptsData.map((p) => p.category));
    return Array.from(cats).sort();
  }, []);

  const filteredPrompts = useMemo(() => {
    return promptsData.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.prompt.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        resultCount={filteredPrompts.length}
      />

      <main className="max-w-[1600px] mx-auto px-6 py-10">
        {/* Category Pills (Sub-navigation) */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
              selectedCategory === "All"
                ? "bg-foreground text-background"
                : "bg-white text-foreground/40 border border-border-muted hover:border-foreground/20"
            }`}
          >
            All Prompts
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-foreground text-background shadow-lg shadow-black/10"
                  : "bg-white text-foreground/40 border border-border-muted hover:border-foreground/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        {filteredPrompts.length > 0 ? (
          <div className="masonry-grid">
            {filteredPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        ) : (
          <div className="h-[50vh] flex flex-col items-center justify-center text-center">
            <div className="text-8xl font-black text-foreground/5 mb-4 uppercase select-none">
              Empty
            </div>
            <p className="text-sm text-foreground/30 font-bold uppercase tracking-[0.2em]">
              No results found for your query.
            </p>
          </div>
        )}

        <footer className="mt-20 py-10 border-t border-border-muted flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/20">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
            System Online // Vyom Prompt System © 2026
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
            <a href="#" className="hover:text-foreground transition-colors">API Status</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
