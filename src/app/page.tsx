"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import PromptCard from "@/components/PromptCard";
import promptsData from "@/data/prompts.json";

const BATCH_SIZE = 60;

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

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

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [searchQuery, selectedCategory]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + BATCH_SIZE, filteredPrompts.length)
          );
        }
      },
      { rootMargin: "600px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredPrompts.length]);

  const visiblePrompts = filteredPrompts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPrompts.length;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header
        onSearch={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        resultCount={filteredPrompts.length}
      />

      <main className="max-w-[1920px] mx-auto px-6 py-8">
        {/* Category System - Technical Pills */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-4 no-scrollbar border-b border-white/5">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
              selectedCategory === "All"
                ? "bg-primary text-black"
                : "text-zinc-500 hover:text-white hover:bg-white/5"
            }`}
          >
            DATA_ALL
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                selectedCategory === cat
                  ? "bg-primary text-black"
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        {filteredPrompts.length > 0 ? (
          <>
            <div className="masonry-grid">
              {visiblePrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>

            {/* Infinite Scroll Sentinel */}
            {hasMore && (
              <div
                ref={sentinelRef}
                className="flex items-center justify-center py-16"
              >
                <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.3em]">
                  <div className="w-2 h-2 bg-primary animate-pulse" />
                  LOADING_DATA... {visibleCount} / {filteredPrompts.length}
                </div>
              </div>
            )}

            {!hasMore && filteredPrompts.length > BATCH_SIZE && (
              <div className="flex items-center justify-center py-16">
                <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.3em]">
                  END_OF_STREAM // {filteredPrompts.length} DATA_POINTS LOADED
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="h-[60vh] flex flex-col items-center justify-center border border-dashed border-white/10">
            <div className="text-[120px] font-black text-white/5 uppercase select-none leading-none">
              404_NULL
            </div>
            <p className="text-[10px] font-mono text-primary uppercase tracking-[0.5em] mt-4">
              Search query returned zero data points.
            </p>
          </div>
        )}

        <footer className="mt-32 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-600">
            <div className="w-2 h-2 bg-primary animate-pulse" />
            STATION: VYOM_PROMPT_STUDIO // STATUS: ONLINE
          </div>
          <div className="flex gap-12 text-[9px] font-black uppercase tracking-widest text-zinc-500">
            <a href="https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Data_Credits</a>
            <a href="#" className="hover:text-primary transition-colors">API_Access</a>
            <a href="#" className="hover:text-primary transition-colors">Security_Protocol</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
