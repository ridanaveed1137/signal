"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Cmd = { label: string; cmd: string };

type Tool = {
  id: string | number;
  slug: string;
  name: string;
  summary: string;
  label: string;
  color: string;
  license: string;
  source: string;
  commands: Cmd[];
  total: number;
};

export default function ToolShelf({ tools }: { tools: Tool[] }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState("All");
  const [sort, setSort] = useState<"new" | "az">("new");
  const [open, setOpen] = useState<Set<string | number>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // press "/" to jump to search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing =
        el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA");
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const labels = Array.from(new Set(tools.map((t) => t.label)));
  const needle = q.trim().toLowerCase();
  const totalCmds = tools.reduce((s, t) => s + t.total, 0);

  let shown = tools.filter(
    (t) =>
      (active === "All" || t.label === active) &&
      (!needle ||
        `${t.name} ${t.summary} ${t.label}`.toLowerCase().includes(needle))
  );
  if (sort === "az") {
    shown = [...shown].sort((a, b) => a.name.localeCompare(b.name));
  }

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1400);
    } catch {
      /* clipboard blocked, ignore */
    }
  };

  const toggle = (id: string | number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div>
      {/* search + chips */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <label className="flex items-center gap-3 border border-ln bg-ch px-4 py-3 font-mono text-sm md:w-[420px]">
          <span className="text-ac">$ grep -i</span>
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="scanner, logs, passwords…"
            className="min-w-0 flex-1 bg-transparent text-tx outline-none placeholder:text-mu/60"
            aria-label="Search tools"
          />
          <kbd className="mo hidden rounded border border-ln px-1.5 py-0.5 md:inline">
            /
          </kbd>
        </label>

        <div className="flex flex-wrap gap-2">
          {["All", ...labels].map((l) => {
            const on = active === l;
            return (
              <button
                key={l}
                type="button"
                onClick={() => setActive(l)}
                className={`mo rounded-full border px-4 py-2 transition-colors ${
                  on
                    ? "border-paper bg-paper text-ink"
                    : "border-paper/30 hover:border-paper"
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6 mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="mo">
          {shown.length} of {tools.length} entries · {totalCmds} commands
          indexed
        </p>
        <div className="mo flex items-center gap-1">
          <span className="mr-2">Sort</span>
          {(
            [
              ["new", "Newest"],
              ["az", "A–Z"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setSort(k)}
              className={`rounded-full border px-3 py-1 transition-colors ${
                sort === k
                  ? "border-paper bg-paper text-ink"
                  : "border-paper/30 hover:border-paper"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 && (
        <p className="border border-ln bg-ch p-6 font-mono text-sm text-mu">
          <span className="text-ac">$</span> no match. try another keyword.
        </p>
      )}

      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((t, i) => {
          const first = t.commands[0];
          const more = t.commands.slice(1);
          const isOpen = open.has(t.id);

          return (
            <article
              key={t.id}
              className="group relative flex animate-[rise-in_0.7s_cubic-bezier(.2,.8,.2,1)_backwards] flex-col border border-ln bg-ch transition-colors duration-300 hover:border-paper/60 motion-reduce:animate-none"
              style={{ animationDelay: `${Math.min(i, 8) * 0.06}s` }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1"
                style={{ background: t.color }}
              />

              <Link
                href={`/post/${t.slug}`}
                className="flex flex-col p-5 pl-6"
              >
                <div className="mo flex items-center justify-between">
                  <span>{t.name.toUpperCase()}(1)</span>
                  <span style={{ color: t.color }}>{t.label}</span>
                </div>
                <h3
                  className={`mt-8 font-mono font-semibold leading-none tracking-tight transition-colors [overflow-wrap:anywhere] group-hover:text-ac ${
                    t.name.length > 12
                      ? "text-[clamp(26px,2.8vw,40px)]"
                      : "text-[clamp(36px,4vw,58px)]"
                  }`}
                >
                  {t.name}
                </h3>
                <p className="mt-4 text-sm text-mu">{t.summary}</p>
              </Link>

              {first && (
                <div className="mx-5 mb-4 ml-6 space-y-2">
                  <button
                    type="button"
                    onClick={() => copy(`${t.id}:0`, first.cmd)}
                    className="flex w-full items-center justify-between gap-3 border border-ln bg-bg px-3 py-2 text-left font-mono text-xs text-tx transition-colors hover:border-paper/60"
                    aria-label={`Copy command for ${t.name}`}
                  >
                    <span className="truncate">
                      <span className="text-ac">$</span> {first.cmd}
                    </span>
                    <span className="mo shrink-0">
                      {copied === `${t.id}:0` ? "Copied" : "Copy"}
                    </span>
                  </button>

                  {more.length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={() => toggle(t.id)}
                        aria-expanded={isOpen}
                        className="mo flex w-full items-center justify-between py-1 hover:text-ac"
                      >
                        <span>
                          {isOpen
                            ? "Hide commands"
                            : `+ ${t.total - 1} more command${t.total - 1 === 1 ? "" : "s"}`}
                        </span>
                        <span
                          className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                        >
                          +
                        </span>
                      </button>

                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ${
                          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <ul className="space-y-2 pb-1">
                            {more.map((c, k) => (
                              <li key={k}>
                                {c.label && (
                                  <p className="mo mb-1 normal-case tracking-normal">
                                    {c.label}
                                  </p>
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    copy(`${t.id}:${k + 1}`, c.cmd)
                                  }
                                  tabIndex={isOpen ? 0 : -1}
                                  className="flex w-full items-center justify-between gap-3 border border-ln bg-bg px-3 py-2 text-left font-mono text-xs text-tx transition-colors hover:border-paper/60"
                                >
                                  <span className="truncate">
                                    <span className="text-ac">$</span> {c.cmd}
                                  </span>
                                  <span className="mo shrink-0">
                                    {copied === `${t.id}:${k + 1}`
                                      ? "Copied"
                                      : "Copy"}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                          {t.total > t.commands.length && (
                            <Link
                              href={`/post/${t.slug}`}
                              className="mo block pb-1 pt-1 hover:text-ac"
                            >
                              and {t.total - t.commands.length} more in the
                              full entry →
                            </Link>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="mo flex items-center justify-between gap-3 border-t border-ln px-5 py-3 pl-6">
                <span className="truncate">{t.license || "—"}</span>
                <Link
                  href={`/post/${t.slug}`}
                  className="shrink-0 hover:text-ac"
                >
                  {t.source ? `${t.source} ↗` : "Read ↗"}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}