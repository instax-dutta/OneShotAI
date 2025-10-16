"use client";
import Image from "next/image";
import { useState, useEffect, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [year, setYear] = useState("");

  // History state and helpers
  type HistoryItem = { id: string; title: string; idea: string; prompt: string; tags: string[]; createdAt: number };
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historySearch, setHistorySearch] = useState("");
  const [activeTagFilter, setActiveTagFilter] = useState<string>("");

  // Templates
  const templates = useMemo(() => ([
    "AI note-taker that summarizes meetings and action items",
    "E-commerce product recommender using user behavior",
    "Customer support chatbot that triages and answers FAQs",
    "Code review assistant suggesting improvements and tests",
    "SEO content generator for landing pages with variants"
  ]), []);

  // Input guidance
  const minIdeaChars = 12;
  const estimatedTokens = useMemo(() => {
    const words = idea.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words * 1.3));
  }, [idea]);
  const ideaIsValid = idea.trim().length >= minIdeaChars;

  // Abort for cancel
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  // Load/save draft and history
  useEffect(() => {
    try {
      const stored = localStorage.getItem("oneshot_draft");
      if (stored) {
        const draft = JSON.parse(stored);
        if (typeof draft?.idea === "string") setIdea(draft.idea);
      }
      const hist = localStorage.getItem("oneshot_history");
      if (hist) {
        const parsed = JSON.parse(hist);
        if (Array.isArray(parsed)) setHistory(parsed);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("oneshot_draft", JSON.stringify({ idea })); } catch {}
  }, [idea]);
  useEffect(() => {
    try { localStorage.setItem("oneshot_history", JSON.stringify(history)); } catch {}
  }, [history]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ideaIsValid) {
      setError(`Please add more detail (at least ${minIdeaChars} characters).`);
      return;
    }
    setLoading(true);
    setPrompt("");
    setError("");
    try {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
        signal: abortRef.current.signal,
      });
      const data = await res.json();
      if (data.prompt) {
        setPrompt(data.prompt);
        const newItem = {
          id: Math.random().toString(36).slice(2),
          title: idea.trim().slice(0, 60) || "Untitled",
          idea,
          prompt: data.prompt,
          tags: [],
          createdAt: Date.now(),
        };
        setHistory(prev => [newItem, ...prev].slice(0, 200));
      }
      else setError(data.error || "Failed to generate prompt.");
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Request cancelled.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    abortRef.current?.abort();
  }

  function handleRetry() {
    const fakeEvent = { preventDefault: () => {} } as unknown as React.FormEvent;
    handleSubmit(fakeEvent);
  }

  function handleReuse(item: { idea: string; prompt: string }) {
    setIdea(item.idea);
    setPrompt(item.prompt);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleExport(item: { idea: string; prompt: string }) {
    const content = `Idea:\n${item.idea}\n\nPrompt:\n${item.prompt}`;
    navigator.clipboard.writeText(content);
  }

  function updateHistoryTitle(id: string, title: string) {
    setHistory(prev => prev.map(h => h.id === id ? { ...h, title } : h));
  }
  function updateHistoryTags(id: string, tagsCsv: string) {
    const tags = tagsCsv.split(",").map(t => t.trim()).filter(Boolean);
    setHistory(prev => prev.map(h => h.id === id ? { ...h, tags } : h));
  }
  function deleteHistoryItem(id: string) {
    setHistory(prev => prev.filter(h => h.id !== id));
  }

  const filteredHistory = useMemo(() => {
    const q = historySearch.toLowerCase();
    return history.filter(h => {
      const matchesQ = !q || h.title.toLowerCase().includes(q) || h.idea.toLowerCase().includes(q) || h.prompt.toLowerCase().includes(q) || h.tags.join(" ").toLowerCase().includes(q);
      const matchesTag = !activeTagFilter || h.tags.includes(activeTagFilter);
      return matchesQ && matchesTag;
    });
  }, [history, historySearch, activeTagFilter]);

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full" aria-label="Prompt generator form">
          <label htmlFor="idea-input" className="sr-only">Describe your AI project idea</label>
          <textarea
            id="idea-input"
            className="rounded-lg border border-gray-300 dark:border-gray-700 p-4 min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#23272f] text-black dark:text-white text-base shadow-sm transition-all"
            placeholder="Describe your AI project idea..."
            value={idea}
            onChange={e => setIdea(e.target.value)}
            required
            disabled={loading}
          />
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <div>
              <span aria-live="polite">{idea.trim().length} chars</span>
              <span className="mx-2">·</span>
              <span title="Approximate token estimate">~{estimatedTokens} tokens</span>
              {!ideaIsValid && <span className="ml-2 text-amber-600">Add more detail for better results</span>}
            </div>
            <div className="flex gap-2">
              <span className="hidden sm:inline text-gray-500">Templates:</span>
              {templates.map((t, i) => (
                <button type="button" key={i} className="px-2 py-1 rounded bg-gray-100 dark:bg-[#2a2f3a] hover:bg-gray-200 dark:hover:bg-[#353b48] text-gray-800 dark:text-gray-100"
                  onClick={() => setIdea(t)} aria-label={`Use template ${i+1}`}>
                  Try {i+1}
                </button>
              ))}
            </div>
          </div>
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
          {loading && (
            <div className="flex justify-end">
              <button type="button" onClick={handleCancel} className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-semibold shadow" aria-label="Cancel generation">Cancel</button>
            </div>
          )}
          {!loading && error && (
            <div className="flex justify-end">
              <button type="button" onClick={handleRetry} className="px-3 py-1 rounded bg-gray-200 dark:bg-[#2a2f3a] hover:bg-gray-300 dark:hover:bg-[#353b48] text-xs" aria-label="Retry generation">Retry</button>
            </div>
          )}
        </form>
        {error && <div className="text-red-600 mt-2 text-sm text-center">{error}</div>}
        {prompt && (
          <div className="mt-8 w-full bg-white/40 dark:bg-[#23272f]/40 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-inner backdrop-blur-lg backdrop-saturate-150 border-t border-l border-white/40 dark:border-white/10">
            <div className="font-semibold mb-2 text-gray-800 dark:text-gray-100 flex items-center justify-between">
              <span>Your OneShot Prompt:</span>
              <button
                onClick={() => {
                  const promptEl = document.getElementById('oneshot-prompt-text');
                  if (promptEl) {
                    navigator.clipboard.writeText(promptEl.textContent || '');
                  }
                }}
                className="ml-2 px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow transition-all"
                title="Copy prompt to clipboard"
                aria-label="Copy prompt"
              >
                Copy
              </button>
            </div>
            <div id="oneshot-prompt-text" className="prose dark:prose-invert max-w-none text-base text-gray-900 dark:text-gray-100">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{prompt}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* History Panel */}
        <section aria-label="History" className="mt-10 w-full">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">History</h2>
            <div className="flex gap-2 items-center">
              <input aria-label="Search history" value={historySearch} onChange={e=>setHistorySearch(e.target.value)} placeholder="Search..." className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23272f]" />
              <select aria-label="Filter by tag" value={activeTagFilter} onChange={e=>setActiveTagFilter(e.target.value)} className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23272f]">
                <option value="">All tags</option>
                {[...new Set(history.flatMap(h => h.tags))].map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
          {filteredHistory.length === 0 ? (
            <div className="text-xs text-gray-500">No history yet.</div>
          ) : (
            <ul className="space-y-2">
              {filteredHistory.map(item => (
                <li key={item.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-[#23272f]/50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <input
                      aria-label="Rename entry"
                      className="text-sm font-medium bg-transparent outline-none border-b border-transparent focus:border-blue-500 text-gray-900 dark:text-gray-100"
                      value={item.title}
                      onChange={e => updateHistoryTitle(item.id, e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button className="px-2 py-1 text-xs rounded bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleReuse(item)} aria-label="Reuse">Reuse</button>
                      <button className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-[#2a2f3a] hover:bg-gray-300 dark:hover:bg-[#353b48]" onClick={() => handleExport(item)} aria-label="Export">Export</button>
                      <button className="px-2 py-1 text-xs rounded bg-red-500 hover:bg-red-600 text-white" onClick={() => deleteHistoryItem(item.id)} aria-label="Delete">Delete</button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 truncate" title={item.idea}>{item.idea}</div>
                  <div className="mt-2">
                    <label className="text-xs text-gray-500 mr-2" htmlFor={`tags-${item.id}`}>Tags</label>
                    <input id={`tags-${item.id}`} aria-label="Edit tags" placeholder="comma,separated,tags" className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23272f] w-full sm:w-auto"
                      value={item.tags.join(", ")} onChange={e => updateHistoryTags(item.id, e.target.value)} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <footer className="row-start-3 flex flex-col gap-2 items-center justify-center text-xs text-gray-500 dark:text-gray-400 mt-8">
        <span>&copy; {year} OneShotAI. All rights reserved.</span>
        <span>Made with <span className="text-pink-500">♥</span> for creators.</span>
      </footer>
    </div>
  );
}
