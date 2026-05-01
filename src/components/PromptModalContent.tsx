"use client";

import { X, Copy, Check, User, ChevronLeft, ChevronRight, Zap, Info, Share2, Download, Terminal, Home } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface PromptModalContentProps {
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
  onClose?: () => void;
  isFullPage?: boolean;
}

export default function PromptModalContent({ prompt, onClose, isFullPage }: PromptModalContentProps) {
  const [copied, setCopied] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [imageLoadStates, setImageLoadStates] = useState<Record<number, boolean>>({});
  const [customArgs, setCustomArgs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (prompt.arguments) {
      const initial: Record<string, string> = {};
      prompt.arguments.forEach(arg => {
        initial[arg.name] = arg.default;
      });
      setCustomArgs(initial);
    }
  }, [prompt.arguments]);

  const hasImages = prompt.images && prompt.images.length > 0;

  const getProcessedPrompt = () => {
    return prompt.prompt.replace(/\{argument name="(.+?)" default="(.+?)"\}/g, (match, name, defaultValue) => {
      return customArgs[name] !== undefined ? customArgs[name] : defaultValue;
    });
  };

  const processedPrompt = getProcessedPrompt();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(processedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
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
    if (!isFullPage) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [handleKeyDown, isFullPage]);

  const handleImageLoad = (idx: number) => {
    setImageLoadStates((prev) => ({ ...prev, [idx]: true }));
  };

  return (
    <div className={`relative w-full ${isFullPage ? 'min-h-screen' : 'max-w-[1400px] h-full md:h-auto md:max-h-[90vh]'} bg-black shadow-2xl flex flex-col overflow-hidden border border-white/5`}>
      {/* Modal Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 shrink-0 bg-zinc-950">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-primary flex items-center justify-center">
            <Terminal className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter leading-none text-white">
              {prompt.title}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] font-mono text-primary uppercase tracking-[0.3em]">
                {prompt.category}
              </span>
              <span className="w-1 h-1 bg-zinc-800" />
              <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                DATA_ID: {prompt.id.toString().padStart(5, "0")}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isFullPage ? (
            <Link href="/" className="p-3 bg-primary text-black hover:bg-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <Home className="w-5 h-5" /> BACK_TO_LIBRARY
            </Link>
          ) : (
            onClose && (
              <button
                onClick={onClose}
                className="p-3 bg-primary text-black hover:bg-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )
          )}
        </div>
      </div>

      {/* Modal Body */}
      <div className="flex-1 overflow-y-auto bg-black">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left: Display Column */}
          <div className="lg:w-[65%] flex flex-col p-8 gap-8 border-r border-white/5 bg-zinc-950/30">
            {/* Main Image View */}
            <div className="relative aspect-video bg-zinc-900 border border-white/5 overflow-hidden group">
              {!imageLoadStates[activeImage] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-primary/20 border-t-primary animate-spin" />
                </div>
              )}
              <img
                src={prompt.images[activeImage]}
                alt={prompt.title}
                className={`w-full h-full object-contain transition-opacity duration-700 ${
                  imageLoadStates[activeImage] ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => handleImageLoad(activeImage)}
              />

              {/* Nav Arrows */}
              {prompt.images.length > 1 && (
                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setActiveImage((p) => (p - 1 + prompt.images.length) % prompt.images.length)}
                    className="bg-primary text-black p-4 hover:bg-white transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setActiveImage((p) => (p + 1) % prompt.images.length)}
                    className="bg-primary text-black p-4 hover:bg-white transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {prompt.images.length > 1 && (
              <div className="flex flex-wrap gap-4">
                {prompt.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-24 overflow-hidden border transition-all ${
                      activeImage === idx ? "border-primary scale-105" : "border-white/5 opacity-40 hover:opacity-100"
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`${prompt.title} thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}

            {/* Author Footer (Technical Style) */}
            <footer className="mt-auto py-8 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-900 border border-white/5 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Creator</span>
                  <span className="text-sm font-black text-white uppercase tracking-tighter">{prompt.author || "VYOM_INTERNAL"}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Released</span>
                <span className="text-sm font-mono text-white tracking-widest">{prompt.date || "2024.04.22"}</span>
              </div>
            </footer>
          </div>

          {/* Right: Technical Panel */}
          <div className="lg:w-[35%] flex flex-col p-8 gap-8 bg-black">
            {/* Prompt Engine Section */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  <Terminal className="w-4 h-4" /> PROMPT_ENGINE
                </div>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "COPIED" : "COPY_DATA"}
                </button>
              </div>
              <div className="bg-zinc-950 p-6 border-l-4 border-primary relative group overflow-hidden">
                <p className="text-sm leading-relaxed text-zinc-300 font-mono break-words">
                  {processedPrompt}
                </p>
                <div className="absolute top-2 right-2 text-[8px] font-mono text-white/5 uppercase pointer-events-none">
                  STABLE_V4.2
                </div>
              </div>
            </section>

            {/* Arguments Configuration Section */}
            {prompt.arguments && prompt.arguments.length > 0 && (
              <section className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                  <Zap className="w-4 h-4 text-primary" /> TEMPLATE_CONFIG
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {prompt.arguments.map((arg) => (
                    <div key={arg.name} className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                        {arg.name}
                      </label>
                      <input
                        type="text"
                        value={customArgs[arg.name] || ""}
                        onChange={(e) =>
                          setCustomArgs((prev) => ({
                            ...prev,
                            [arg.name]: e.target.value,
                          }))
                        }
                        className="w-full bg-zinc-900 border border-white/5 p-2 text-xs font-mono text-white focus:border-primary/50 focus:outline-none transition-colors"
                        placeholder={arg.default}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Description Section */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                <Info className="w-4 h-4" /> ANALYSIS_REPORT
              </div>
              <p className="text-sm text-zinc-400 font-mono italic leading-relaxed">
                "{prompt.description}"
              </p>
            </section>

            {/* Parameters Grid */}
            <section className="grid grid-cols-1 gap-1">
              <div className="p-4 bg-zinc-950 border border-white/5 flex justify-between items-center">
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Model</span>
                <span className="text-[11px] font-black text-white uppercase">Nano Banana Pro</span>
              </div>
              <div className="p-4 bg-zinc-950 border border-white/5 flex justify-between items-center">
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Confidence</span>
                <span className="text-[11px] font-black text-primary uppercase">99.8% STABLE</span>
              </div>
              <div className="p-4 bg-zinc-950 border border-white/5 flex justify-between items-center">
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Latency</span>
                <span className="text-[11px] font-black text-white uppercase">1.4s_AVG</span>
              </div>
              <div className="p-4 bg-zinc-950 border border-white/5 flex justify-between items-center">
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Seed_Hash</span>
                <span className="text-[11px] font-mono text-zinc-400">0x40293847</span>
              </div>
            </section>

            {/* Actions Section */}
            <section className="flex flex-col gap-2 pt-4">
              <button className="w-full py-4 bg-zinc-900 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3">
                <Download className="w-4 h-4" /> DOWNLOAD_ASSET_PACK
              </button>
              <button className="w-full py-4 bg-zinc-900 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3">
                <Share2 className="w-4 h-4" /> SHARE_STATION_DATA
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
