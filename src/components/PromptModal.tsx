"use client";

import { createPortal } from "react-dom";
import PromptModalContent from "./PromptModalContent";

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
    arguments?: { name: string; default: string }[];
  };
  onClose: () => void;
}

export default function PromptModal({ prompt, onClose }: PromptModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />

      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-[1400px]"
      >
        <PromptModalContent prompt={prompt} onClose={onClose} isFullPage={false} />
      </div>
    </div>
  );
}
