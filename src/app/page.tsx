"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
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
    <main className="flex w-full">
      <Sidebar
        onSearch={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Content Area */}
      <div className="flex-1 ml-[320px] min-h-screen bg-brand-white">
        {/* Page Header */}
        <header className="px-10 py-7 border-b-4 border-brand-black flex items-end justify-between sticky top-0 bg-brand-white z-40">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-black/30 mb-1">
              Index // Library // v1.0
            </p>
            <h2 className="text-3xl font-black uppercase tracking-tight leading-none">
              Prompt Feed
            </h2>
          </div>
          <div className="font-mono text-[10px] font-bold">
            <span className="bg-brand-black text-brand-yellow px-2.5 py-1.5 uppercase tracking-widest">
              {filteredPrompts.length} Results
            </span>
          </div>
        </header>

        {/* Grid */}
        <div className="px-10 py-8">
          {filteredPrompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredPrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          ) : (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
              <div className="text-6xl font-black text-brand-black/8 mb-3 uppercase">
                No Results
              </div>
              <p className="text-xs text-brand-black/40 font-bold uppercase tracking-widest">
                Try a different search term or category.
              </p>
            </div>
          )}

          <footer className="mt-16 pt-8 border-t border-brand-black/10 flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.2em] text-brand-black/25">
            <div>© 2026 Vyom Prompt System · All Rights Reserved</div>
            <div>Terminal Station: 001.002.003</div>
          </footer>
        </div>
      </div>
    </main>
  );
}
