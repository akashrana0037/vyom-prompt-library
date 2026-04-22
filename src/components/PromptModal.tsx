"use client";

import { X, Copy, Check, User, Calendar, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
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
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brand-black/80 backdrop-blur-sm" />

      {/* Modal Container */}
      <div
        className="relative z-10 w-[95vw] max-w-[1200px] max-h-[92vh] bg-brand-white border-2 border-brand-black shadow-[12px_12px_0px_0px_#ffd700] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-brand-black bg-brand-yellow shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="bg-brand-black text-brand-yellow px-2 py-0.5 text-[9px] font-black uppercase tracking-widest shrink-0">
              {prompt.category}
            </span>
            <h2 className="text-sm font-black uppercase tracking-tight truncate">
              {prompt.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 bg-brand-black text-brand-yellow flex items-center justify-center hover:bg-brand-white hover:text-brand-black border border-brand-black transition-colors"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body — scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col lg:flex-row">
            {/* Left: Image Gallery */}
            <div className="lg:w-[55%] bg-[#f5f5f5] border-b-2 lg:border-b-0 lg:border-r-2 border-brand-black/10">
              {hasImages ? (
                <div className="flex flex-col h-full">
                  {/* Main Image */}
                  <div className="relative aspect-[4/3] lg:aspect-auto lg:flex-1 bg-[#eaeaea] flex items-center justify-center overflow-hidden min-h-[300px]">
                    {!imageLoadStates[activeImage] && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-brand-black/20 border-t-brand-yellow animate-spin" />
                      </div>
                    )}
                    <img
                      src={prompt.images[activeImage]}
                      alt={`${prompt.title} — output ${activeImage + 1}`}
                      className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
                        imageLoadStates[activeImage] ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() => handleImageLoad(activeImage)}
                    />

                    {/* Nav Arrows */}
                    {prompt.images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setActiveImage(
                              (prev) =>
                                (prev - 1 + prompt.images.length) %
                                prompt.images.length
                            )
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-black/70 text-white flex items-center justify-center hover:bg-brand-yellow hover:text-brand-black transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setActiveImage(
                              (prev) => (prev + 1) % prompt.images.length
                            )
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-black/70 text-white flex items-center justify-center hover:bg-brand-yellow hover:text-brand-black transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {prompt.images.length > 1 && (
                    <div className="flex gap-1 p-3 border-t border-brand-black/10 bg-[#f0f0f0] shrink-0">
                      {prompt.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImage(idx)}
                          className={`w-14 h-14 border-2 overflow-hidden shrink-0 transition-all ${
                            activeImage === idx
                              ? "border-brand-yellow shadow-[2px_2px_0px_0px_#ffd700]"
                              : "border-brand-black/20 hover:border-brand-black/50"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                      <div className="flex items-center pl-2 text-[9px] font-bold uppercase tracking-widest text-brand-black/30">
                        {activeImage + 1} / {prompt.images.length}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-brand-black/15">
                  <ImageIcon className="w-16 h-16 mb-3" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    No Images Available
                  </span>
                </div>
              )}
            </div>

            {/* Right: Prompt Details */}
            <div className="lg:w-[45%] flex flex-col">
              {/* Meta */}
              <div className="px-6 pt-5 pb-3 border-b border-brand-black/10">
                <p className="text-xs text-brand-black/60 leading-relaxed font-medium">
                  {prompt.description}
                </p>
                <div className="flex items-center gap-4 mt-3 text-[9px] font-bold uppercase tracking-wide text-brand-black/40">
                  <div className="flex items-center gap-1.5">
                    <User className="w-2.5 h-2.5" />
                    <span>{prompt.author || "Vyom"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-2.5 h-2.5" />
                    <span>{prompt.date || "—"}</span>
                  </div>
                  <div className="ml-auto font-mono text-brand-black/25">
                    #{prompt.id.toString().padStart(4, "0")}
                  </div>
                </div>
              </div>

              {/* Prompt Text */}
              <div className="px-6 pt-4 pb-6 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-black/40">
                    Full Prompt
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 px-3 py-1 bg-brand-yellow border border-brand-black hover:bg-brand-black hover:text-brand-yellow transition-colors text-[9px] font-black uppercase tracking-widest"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy Prompt
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-[#fafafa] border border-brand-black/15 p-4 font-mono text-[11px] leading-relaxed text-brand-black/80 whitespace-pre-wrap break-words max-h-[400px] overflow-y-auto">
                  {prompt.prompt}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
