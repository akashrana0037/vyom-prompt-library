"use client";

import { Copy, Check, User, Calendar, ImageIcon } from "lucide-react";
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
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLong = prompt.prompt.length > 300;
  const displayText =
    isLong && !expanded ? prompt.prompt.slice(0, 300) + "..." : prompt.prompt;

  const hasImages = prompt.images && prompt.images.length > 0;

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="group relative bg-brand-white border-2 border-brand-black flex flex-col hover:shadow-[6px_6px_0px_0px_#ffd700] transition-shadow duration-200 cursor-pointer"
      >
        {/* Image Preview */}
        {hasImages && (
          <div className="relative aspect-[16/9] bg-[#eaeaea] overflow-hidden border-b-2 border-brand-black/10">
            <img
              src={prompt.images[0]}
              alt={prompt.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {prompt.images.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-brand-black/70 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 flex items-center gap-1">
                <ImageIcon className="w-2.5 h-2.5" />
                +{prompt.images.length - 1}
              </div>
            )}
          </div>
        )}

        {/* Card Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-brand-black/10">
          <span className="bg-brand-black text-brand-yellow px-2 py-0.5 text-[9px] font-black uppercase tracking-widest leading-none">
            {prompt.category}
          </span>
          <span className="text-[9px] font-mono text-brand-black/30 tabular-nums">
            #{prompt.id.toString().padStart(4, "0")}
          </span>
        </div>

        {/* Title + Description */}
        <div className="px-4 pt-3 pb-2 flex flex-col gap-1.5">
          <h3 className="text-sm font-black uppercase leading-snug tracking-tight text-brand-black line-clamp-2">
            {prompt.title}
          </h3>
          <p className="text-xs text-brand-black/60 leading-relaxed font-medium line-clamp-2">
            {prompt.description}
          </p>
        </div>

        {/* Prompt Body */}
        <div className="mx-4 mb-3 border border-brand-black/20 bg-[#fafafa] relative">
          <div className="px-3 pt-2 pb-1 border-b border-brand-black/10 flex items-center justify-between">
            <span className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-black/40">
              Prompt
            </span>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 px-2 py-0.5 bg-brand-yellow border border-brand-black hover:bg-brand-black hover:text-brand-yellow transition-colors text-[8px] font-black uppercase tracking-widest"
              title="Copy prompt"
            >
              {copied ? (
                <>
                  <Check className="w-2.5 h-2.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-2.5 h-2.5" /> Copy
                </>
              )}
            </button>
          </div>
          <div className="px-3 py-2.5 font-mono text-[11px] leading-relaxed text-brand-black/80 whitespace-pre-wrap break-words">
            {displayText}
          </div>
          {isLong && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="w-full px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border-t border-brand-black/10 text-brand-black/40 hover:text-brand-black hover:bg-brand-yellow/20 transition-colors text-center"
            >
              {expanded ? "▲ Show Less" : "▼ Show Full Prompt"}
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto px-4 pb-3 flex items-center justify-between text-[9px] font-bold uppercase tracking-wide text-brand-black/40">
          <div className="flex items-center gap-1.5">
            <User className="w-2.5 h-2.5" />
            <span className="truncate max-w-[100px]">
              {prompt.author || "Vyom"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-2.5 h-2.5" />
            <span>{prompt.date || "—"}</span>
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
