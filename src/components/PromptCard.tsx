"use client";

import { Copy, Check, User, Calendar, ImageIcon, Zap, Eye } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
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
    arguments?: { name: string; default: string }[];
  };
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    // For the card copy, we'll just copy the raw prompt. 
    // Detailed customization happens in the modal.
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasImages = prompt.images && prompt.images.length > 0;
  const isConfigurable = prompt.arguments && prompt.arguments.length > 0;
  
  // Mock metrics for that "Pro" look
  const successRate = 95 + (prompt.id % 5);
  const modelType = prompt.id % 2 === 0 ? "Nano Banana Pro" : "Nano Banana Max";

  return (
    <>
      <article
        onClick={() => setShowModal(true)}
        className="masonry-item group relative bg-black border border-white/5 overflow-hidden transition-all duration-300 cursor-pointer hover:border-primary/50"
      >

        {/* Visual Header */}
        {hasImages && (
          <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
            <img
              src={prompt.images[0]}
              alt={prompt.title}
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              loading="lazy"
            />
            
            {/* Badges Overlay */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex flex-col gap-1 items-start">
                <span className="bg-primary text-black px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter">
                  {prompt.category}
                </span>
                {isConfigurable && (
                  <span className="bg-white text-black px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter flex items-center gap-1">
                    <Zap className="w-2 h-2 fill-current" /> CONFIGURABLE
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-mono text-white/50 tabular-nums">
                  #{prompt.id.toString().padStart(5, "0")}
                </span>
              </div>
            </div>

            {/* Quick Actions Overlay (Mobile Friendly) */}
            <div className="absolute bottom-4 right-4 flex gap-1">
              <button
                onClick={copyToClipboard}
                className="glass-panel p-2 hover:bg-primary hover:text-black transition-colors"
                title="Copy Prompt"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Card Content Area */}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary" />
            <h3 className="text-sm font-black leading-tight uppercase tracking-tight text-white group-hover:text-primary transition-colors">
              {prompt.title}
            </h3>
          </div>

          {/* Data Block (Geist Mono snippet) */}
          <div className="bg-zinc-950 p-3 border-l-2 border-primary/30 group-hover:border-primary transition-colors">
            <p className="line-clamp-3 text-[11px] leading-relaxed font-mono text-zinc-400">
              {prompt.prompt}
            </p>
          </div>

          {/* Footer Metrics - High Density */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[9px] font-mono uppercase tracking-widest text-zinc-600">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">{prompt.author || "ANONYMOUS"}</span>
              <span className="text-zinc-800">/</span>
              <span>{modelType}</span>
            </div>
            <div className="flex items-center gap-1 group-hover:text-primary transition-colors">
              VIEW DETAIL <Eye className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 pointer-events-none border border-primary/0 group-hover:border-primary/20 transition-all duration-300" />
      </article>

      {/* Detail Modal */}
      {showModal &&
        createPortal(
          <PromptModal prompt={prompt} onClose={() => setShowModal(false)} />,
          document.body
        )}
    </>
  );
}
