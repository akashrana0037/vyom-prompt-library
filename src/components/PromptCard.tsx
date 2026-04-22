"use client";

import { Copy, Check, User, Calendar, ImageIcon, Zap, Eye } from "lucide-react";
import { useState } from "react";
import PromptModal from "./PromptModal";

interface PromptCardProps {
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
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasImages = prompt.images && prompt.images.length > 0;
  
  // Mock metrics for that "Pro" look
  const successRate = 95 + (prompt.id % 5);
  const modelType = prompt.id % 2 === 0 ? "Nano Banana Pro" : "Nano Banana Max";

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="masonry-item group relative bg-card border border-border-muted rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 cursor-pointer"
      >
        {/* Visual Header */}
        {hasImages && (
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={prompt.images[0]}
              alt={prompt.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            
            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="glass-panel px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-foreground">
                {prompt.category}
              </span>
              <span className="bg-accent-emerald/90 text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current" />
                {successRate}% Success
              </span>
            </div>

            {/* Quick Actions Overlay */}
            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={copyToClipboard}
                className="glass-panel p-2 rounded-xl hover:bg-white transition-colors"
                title="Copy Prompt"
              >
                {copied ? <Check className="w-4 h-4 text-accent-emerald" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                className="glass-panel p-2 rounded-xl hover:bg-white transition-colors"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Card Content Area */}
        <div className="p-5 flex flex-col gap-4">
          {/* Header Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-medium text-foreground/40 uppercase tracking-widest">
              <User className="w-3 h-3" />
              {prompt.author || "Vyom"}
            </div>
            <span className="text-[10px] font-mono text-foreground/20 tabular-nums">
              ID: {prompt.id.toString().padStart(4, "0")}
            </span>
          </div>

          <h3 className="text-base font-bold leading-tight tracking-tight text-foreground group-hover:text-accent-blue transition-colors">
            {prompt.title}
          </h3>

          {/* Data Block (The "Technical" part) */}
          <div className="data-block rounded-2xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">
                JSON CONFIG / PROMPT
              </span>
              <span className="text-[9px] font-bold text-accent-emerald/60 uppercase">
                {modelType}
              </span>
            </div>
            <p className="line-clamp-4 text-[11px] leading-relaxed italic text-white/70">
              "{prompt.prompt}"
            </p>
            
            {/* Subtle Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-data to-transparent pointer-events-none" />
          </div>

          {/* Footer Metrics */}
          <div className="flex items-center justify-between pt-2 border-t border-border-muted">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-foreground/30 uppercase tracking-tighter">Model</span>
                <span className="text-[10px] font-bold text-foreground/70 leading-none">V4.2 Pro</span>
              </div>
              <div className="flex flex-col border-l border-border-muted pl-3">
                <span className="text-[8px] font-bold text-foreground/30 uppercase tracking-tighter">Tested</span>
                <span className="text-[10px] font-bold text-foreground/70 leading-none">12.2k Runs</span>
              </div>
            </div>
            <div className="text-[10px] font-bold text-accent-blue/80 flex items-center gap-1">
              PROMPT SETUP <Eye className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && (
        <PromptModal prompt={prompt} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
