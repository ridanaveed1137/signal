"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { supabase } from "@/lib/supabase";

type Result = { id: string; type: string; title: string; slug: string };

export default function CommandPalette() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [active, setActive] = useState(0);
  const [searched, setSearched] = useState(false);

  // open and close shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    function onOpen() {
      setOpen(true);
    }

    window.addEventListener("keydown", onKey);
    window.addEventListener("open-search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-search", onOpen);
    };
  }, []);

  // focus the input when it opens, clear everything when it closes
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery("");
      setResults([]);
      setActive(0);
      setSearched(false);
    }
  }, [open]);

  // search as you type, waiting 200ms after the last keystroke
  useEffect(() => {
    const term = query.replace(/[^a-zA-Z0-9 -]/g, " ").trim();

    if (!term) {
      setResults([]);
      setSearched(false);
      return;
    }

    let cancelled = false;

    const id = setTimeout(async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, type, title, slug")
        .or(
          `title.ilike.%${term}%,summary.ilike.%${term}%,body.ilike.%${term}%`
        )
        .order("created_at", { ascending: false })
        .limit(6);

      if (cancelled) return;
      setResults(data ?? []);
      setActive(0);
      setSearched(true);
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [query]);

  function go(result?: Result) {
    const q = query.trim();
    setOpen(false);
    if (result) {
      router.push(`/post/${result.slug}`);
    } else if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  }

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-[15vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="w-full max-w-xl border border-neutral-800 bg-neutral-950"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKey}
              placeholder="Search trends, tools, papers, projects..."
              className="w-full border-b border-neutral-800 bg-transparent p-4 text-sm outline-none"
            />

            <ul>
              {results.map((r, i) => (
                <li key={r.id}>
                  <button
                    onClick={() => go(r)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-center gap-3 p-3 text-left text-sm transition-colors ${
                      i === active ? "bg-neutral-900" : ""
                    }`}
                  >
                    <span className="w-16 shrink-0 text-xs uppercase tracking-widest text-emerald-400">
                      {r.type}
                    </span>
                    <span className="truncate">{r.title}</span>
                  </button>
                </li>
              ))}
            </ul>

            {searched && results.length === 0 && (
              <p className="p-4 text-sm text-neutral-500">No results.</p>
            )}

            <p className="border-t border-neutral-800 p-3 text-xs text-neutral-600">
              ↑↓ to move · Enter to open (or see all results if none is selected) · Esc to close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}