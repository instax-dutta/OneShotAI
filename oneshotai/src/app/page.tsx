"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setPrompt("");
    setError("");
    try {
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      const data = await res.json();
      if (data.prompt) setPrompt(data.prompt);
      else setError(data.error || "Failed to generate prompt.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] relative">
      {/* Decorative SVG Top Left */}
      <svg className="absolute left-0 top-0 -z-10 w-40 h-40 opacity-30 blur-[2px]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="100" fill="url(#paint0_radial)" />
        <defs>
          <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(100 100) scale(100)" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a5b4fc" />
            <stop offset="1" stopColor="#f472b6" stopOpacity="0.5" />
          </radialGradient>
        </defs>
      </svg>
      {/* Decorative SVG Top Right (new) */}
      <svg className="absolute right-0 top-0 -z-10 w-32 h-32 opacity-25 blur-[1.5px]" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="30" width="100" height="100" rx="30" fill="url(#paint2_radial)" />
        <defs>
          <radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientTransform="translate(80 80) scale(80)" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f472b6" />
            <stop offset="1" stopColor="#38bdf8" stopOpacity="0.4" />
          </radialGradient>
        </defs>
      </svg>
      {/* Decorative SVG Bottom Left (new) */}
      <svg className="absolute left-0 bottom-0 -z-10 w-28 h-28 opacity-20 blur-[1.5px]" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="70" cy="70" rx="60" ry="50" fill="url(#paint3_radial)" />
        <defs>
          <radialGradient id="paint3_radial" cx="0" cy="0" r="1" gradientTransform="translate(70 70) scale(70 60)" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fbbf24" />
            <stop offset="1" stopColor="#a5b4fc" stopOpacity="0.3" />
          </radialGradient>
        </defs>
      </svg>
      {/* Decorative SVG Bottom Right */}
      <svg className="absolute right-0 bottom-0 -z-10 w-52 h-52 opacity-40 blur-[2px]" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="110" cy="110" rx="110" ry="90" fill="url(#paint1_radial)" />
        <defs>
          <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientTransform="translate(110 110) scale(110 90)" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c084fc" />
            <stop offset="1" stopColor="#38bdf8" stopOpacity="0.4" />
          </radialGradient>
        </defs>
      </svg>
      {/* Decorative SVG Center Faint Lines */}
      <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[90vw] h-[90vw] max-w-3xl max-h-3xl opacity-10" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="300" cy="300" r="250" stroke="#818cf8" strokeWidth="2" />
        <circle cx="300" cy="300" r="180" stroke="#f472b6" strokeWidth="2" />
        <circle cx="300" cy="300" r="110" stroke="#38bdf8" strokeWidth="2" />
      </svg>
      <main className="flex flex-col gap-10 row-start-2 items-center w-full max-w-xl bg-white/60 dark:bg-[#18181b]/60 rounded-3xl shadow-2xl p-8 sm:p-12 border border-gray-200 dark:border-gray-800 backdrop-blur-xl backdrop-saturate-150 border-t border-l border-white/40 dark:border-white/10" style={{boxShadow:'0 8px 32px 0 rgba(31, 38, 135, 0.18)'}}>
        <div className="flex flex-col items-center w-full">
          <div className="rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 p-1 mb-4 shadow-lg">
            <Image
              src="/logo.svg"
              alt="OneShotAI Logo"
              width={64}
              height={64}
              className="rounded-full bg-white dark:bg-[#18181b] p-2"
              priority
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-center tracking-tight text-gray-900 dark:text-white drop-shadow">OneShotAI</h1>
          <p className="text-center text-lg mb-6 text-gray-700 dark:text-gray-300 max-w-md">Describe your vision. Get a single, highly effective prompt for your AI project.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <textarea
            className="rounded-lg border border-gray-300 dark:border-gray-700 p-4 min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#23272f] text-black dark:text-white text-base shadow-sm transition-all"
            placeholder="Describe your AI project idea..."
            value={idea}
            onChange={e => setIdea(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 text-lg shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading || !idea.trim()}
          >
            {loading ? (
              <span className="flex items-center gap-2"><span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>Generating...</span>
            ) : (
              "Generate Prompt"
            )}
          </button>
        </form>
        {error && <div className="text-red-600 mt-2 text-sm text-center">{error}</div>}
        {prompt && (
          <div className="mt-8 w-full bg-white/40 dark:bg-[#23272f]/40 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-inner backdrop-blur-lg backdrop-saturate-150 border-t border-l border-white/40 dark:border-white/10">
            <div className="font-semibold mb-2 text-gray-800 dark:text-gray-100">Your OneShot Prompt:</div>
            <pre className="whitespace-pre-wrap break-words text-base text-gray-900 dark:text-gray-100">{prompt}</pre>
          </div>
        )}
      </main>
      <footer className="row-start-3 flex flex-col gap-2 items-center justify-center text-xs text-gray-500 dark:text-gray-400 mt-8">
        <span>&copy; {year} OneShotAI. All rights reserved.</span>
        <span>Made with <span className="text-pink-500">♥</span> for creators.</span>
      </footer>
    </div>
  );
}
