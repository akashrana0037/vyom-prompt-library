"use client";

import { useState, useEffect } from "react";
import { login, logout, addPrompt } from "./actions";
import { Lock, Plus, LogOut, Image as ImageIcon, Send, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check for session on mount (simplified)
  useEffect(() => {
    const checkSession = async () => {
      // In a real app, you'd check a server-side session
      // For this simple version, we'll rely on the server action responses
    };
    checkSession();
  }, []);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    
    if (result.success) {
      setIsLoggedIn(true);
    } else {
      setError(result.error || "Login failed");
    }
    setIsLoading(false);
  }

  async function handleSubmitPrompt(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    const formData = new FormData(e.currentTarget);
    const result = await addPrompt(formData);
    
    if (result.success) {
      setSuccess("Prompt added successfully!");
      e.currentTarget.reset();
    } else {
      setError(result.error || "Failed to add prompt");
    }
    setIsLoading(false);
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20">
              <Lock className="text-primary w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Admin Access</h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] mt-2">Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest ml-1">Identity_ID</label>
              <input
                name="id"
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="Enter Admin ID"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest ml-1">Access_Code</label>
              <input
                name="password"
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-[10px] font-mono uppercase bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              disabled={isLoading}
              className="w-full bg-white text-black font-black uppercase py-4 rounded-xl hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? "Validating..." : "Initialize Session"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12 pb-8 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
              <ShieldCheck className="text-green-500 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">Admin Dashboard</h1>
              <p className="text-[10px] font-mono text-green-500 uppercase tracking-[0.3em]">Status: Authenticated</p>
            </div>
          </div>
          <button 
            onClick={() => logout()}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-500/10 hover:text-red-500 border border-white/10 rounded-lg text-[10px] font-mono uppercase transition-all"
          >
            <LogOut className="w-4 h-4" />
            Terminate Session
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats/Info Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
              <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Database_Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Total_Prompts</span>
                  <span className="text-xl font-black tracking-tighter">Verified</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-primary" />
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
              <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">System_Guidelines</h2>
              <ul className="text-[10px] font-mono text-zinc-400 space-y-2 uppercase leading-relaxed">
                <li className="flex gap-2"><span>•</span> Use descriptive titles</li>
                <li className="flex gap-2"><span>•</span> Ensure image URLs are direct</li>
                <li className="flex gap-2"><span>•</span> Check for duplicates</li>
              </ul>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitPrompt} className="bg-zinc-900 border border-white/10 rounded-2xl p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Plus className="text-primary w-5 h-5" />
                <h2 className="text-lg font-black uppercase tracking-tighter">Inject New Data Point</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest ml-1">Title</label>
                  <input
                    name="title"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="E.g. Neon Samurai Portrait"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest ml-1">Category</label>
                  <select
                    name="category"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                  >
                    <option value="UI Mockup" className="bg-zinc-900">UI Mockup</option>
                    <option value="Poster Design" className="bg-zinc-900">Poster Design</option>
                    <option value="Photography" className="bg-zinc-900">Photography</option>
                    <option value="Illustration" className="bg-zinc-900">Illustration</option>
                    <option value="3D Render" className="bg-zinc-900">3D Render</option>
                    <option value="Anime" className="bg-zinc-900">Anime</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest ml-1">Short Description</label>
                <input
                  name="description"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Optional brief summary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest ml-1">Prompt Sequence</label>
                <textarea
                  name="prompt"
                  required
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  placeholder="Enter the full AI prompt sequence..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <ImageIcon className="w-3 h-3" />
                  Image_Assets (Comma separated URLs)
                </label>
                <textarea
                  name="imageUrls"
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-[10px] font-mono uppercase bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 text-green-500 text-[10px] font-mono uppercase bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                  <ShieldCheck className="w-4 h-4" />
                  {success}
                </div>
              )}

              <button
                disabled={isLoading}
                className="w-full bg-primary text-white font-black uppercase py-4 rounded-xl hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? "Processing..." : (
                  <>
                    <Send className="w-4 h-4" />
                    Commit To Database
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
