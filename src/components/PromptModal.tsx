"use client";

import { X, Copy, Check, User, Calendar, ChevronLeft, ChevronRight, ImageIcon, Zap, Info, Share2, Download } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface PromptModalProps {
  prompt: {
    id: number;
    title: string;
    description: string;
    prompt: string;
    images: string[];
    author: string;
    date: string;
    category: string;
  };
  onClose: () => void;
}

export default function PromptModal({ prompt, onClose }: PromptModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [imageLoadStates, setImageLoadStates] = useState<Record<number, boolean>>({});

  const hasImages = prompt.images && prompt.images.length > 0;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasImages) {
        setActiveImage((prev) => (prev + 1) % prompt.images.length);
      }
      if (e.key === "ArrowLeft" && hasImages) {
        setActiveImage((prev) => (prev - 1 + prompt.images.length) % prompt.images.length);
      }
    },
    [onClose, hasImages, prompt.images.length]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleImageLoad = (idx: number) => {
    setImageLoadStates((prev) => ({ ...prev, [idx]: true }));
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-md" />

      {/* Modal Container */}
      <div
        className="relative z-10 w-full max-w-[1300px] max-h-[95vh] bg-background rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-border-muted shrink-0 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-foreground flex items-center justify-center rounded-2xl">
              <Zap className="w-5 h-5 text-background fill-current" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-tight leading-none">
                {prompt.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest">
                  {prompt.category}
                </span>
                <span className="w-1 h-1 rounded-full bg-border-muted" />
                <span className="text-[10px] font-medium text-foreground/40 uppercase">
                  ID: {prompt.id.toString().padStart(4, "0")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-2xl border border-border-muted hover:bg-background transition-colors text-foreground/40 hover:text-foreground">
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-foreground text-background hover:bg-accent-blue transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="flex flex-col xl:flex-row">
            {/* Left: Display Column */}
            <div className="xl:w-[60%] flex flex-col p-8 gap-6 border-r border-border-muted">
              {/* Main Image View */}
              <div className="relative aspect-video bg-white rounded-[2rem] overflow-hidden group shadow-lg shadow-black/5">
                {!imageLoadStates[activeImage] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background">
                    <div className="w-10 h-10 border-4 border-foreground/10 border-t-accent-blue rounded-full animate-spin" />
                  </div>
                )}
                <img
                  src={prompt.images[activeImage]}
                  alt={prompt.title}
                  className={`w-full h-full object-contain transition-opacity duration-500 ${
                    imageLoadStates[activeImage] ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => handleImageLoad(activeImage)}
                />

                {/* Nav Arrows */}
                {prompt.images.length > 1 && (
                  <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setActiveImage((p) => (p - 1 + prompt.images.length) % prompt.images.length)}
                      className="glass-panel p-3 rounded-2xl hover:bg-white transition-all shadow-xl"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImage((p) => (p + 1) % prompt.images.length)}
                      className="glass-panel p-3 rounded-2xl hover:bg-white transition-all shadow-xl"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {prompt.images.length > 1 && (
                <div className="flex flex-wrap gap-3">
                  {prompt.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                        activeImage === idx ? "border-accent-blue ring-4 ring-accent-blue/10" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Technical Panel */}
            <div className="xl:w-[40%] flex flex-col p-8 gap-8 bg-white">
              {/* Description Section */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/30">
                  <Info className="w-3 h-3" /> Description & Analysis
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed italic">
                  "{prompt.description}"
                </p>
              </section>

              {/* Prompt Engine Section */}
              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/30">
                    <Terminal className="w-3 h-3" /> Prompt Engine
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent-blue transition-all active:scale-95"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied" : "Copy Prompt"}
                  </button>
                </div>
                <div className="data-block rounded-[1.5rem] p-6 relative group overflow-hidden">
                  <p className="text-xs leading-relaxed text-white/90 font-mono break-words">
                    {prompt.prompt}
                  </p>
                  {/* JSON look overlays */}
                  <div className="absolute top-2 right-2 text-[8px] font-bold text-white/10 uppercase tracking-tighter pointer-events-none">
                    ENGINE_V4.2_STABLE
                  </div>
                </div>
              </section>

              {/* Parameters Grid */}
              <section className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl border border-border-muted bg-background/50 flex flex-col gap-1">
                  <span className="text-[8px] font-black text-foreground/30 uppercase tracking-widest">Model Engine</span>
                  <span className="text-[11px] font-bold text-foreground">Nano Banana Pro</span>
                </div>
                <div className="p-4 rounded-3xl border border-border-muted bg-background/50 flex flex-col gap-1">
                  <span className="text-[8px] font-black text-foreground/30 uppercase tracking-widest">Success Rate</span>
                  <span className="text-[11px] font-bold text-accent-emerald">99.8% Stable</span>
                </div>
                <div className="p-4 rounded-3xl border border-border-muted bg-background/50 flex flex-col gap-1">
                  <span className="text-[8px] font-black text-foreground/30 uppercase tracking-widest">Generation Time</span>
                  <span className="text-[11px] font-bold text-foreground">1.4s Average</span>
                </div>
                <div className="p-4 rounded-3xl border border-border-muted bg-background/50 flex flex-col gap-1">
                  <span className="text-[8px] font-black text-foreground/30 uppercase tracking-widest">Style Seed</span>
                  <span className="text-[11px] font-mono text-foreground/60">4029384752</span>
                </div>
              </section>

              {/* Author Footer */}
              <footer className="mt-auto pt-6 border-t border-border-muted flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background border border-border-muted rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-foreground/40" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-foreground/30 uppercase">Creator</span>
                    <span className="text-[11px] font-bold text-foreground">{prompt.author || "Vyom Studio"}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold text-foreground/30 uppercase">Release Date</span>
                  <span className="text-[11px] font-bold text-foreground">{prompt.date || "2024-04-22"}</span>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
