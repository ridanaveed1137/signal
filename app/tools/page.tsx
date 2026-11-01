import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import ToolShelf from "@/components/ToolShelf";
import { colorFor, labelFor } from "@/lib/editorial";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools · Signal",
  description: "Open-source security tools, explained in plain language.",
};

export const revalidate = 60;

const wrap = "mx-auto w-full max-w-7xl px-5";

function host(u?: string | number | null) {
  try {
    return new URL(String(u)).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

// pull labeled commands out of the code blocks in an entry's body
function commandsOf(body?: string | null) {
  const out: { label: string; cmd: string }[] = [];
  if (!body) return { list: out, total: 0 };

  const re = /```[^\n]*\r?\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body))) {
    let label = "";
    for (const raw of m[1].split(/\r?\n/)) {
      const line = raw.trim();
      if (!line) continue;
      if (line.startsWith("#")) {
        label = line.replace(/^#+\s*/, "");
        continue;
      }
      out.push({ label, cmd: line.slice(0, 120) });
      label = "";
    }
  }
  return { list: out.slice(0, 6), total: out.length };
}

export default async function ToolsPage() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("type", "tool")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) console.log(error);

  const list = (data ?? []) as Post[];

  const tools = list.map((p) => {
    const meta = p.metadata ?? {};
    const { list: commands, total } = commandsOf(p.body);
    return {
      id: p.id,
      slug: p.slug,
      name: p.title.split(":")[0].trim(),
      summary: p.summary ?? "",
      label: labelFor(p),
      color: colorFor(p),
      license: String(meta.license ?? ""),
      source: host(p.source_url) || host(meta.repo),
      commands,
      total,
    };
  });

  const typed = (
    n: number,
    delay: number,
    text: string,
    cls = "text-tx"
  ) => (
    <p
      className={`typed ${cls}`}
      style={
        {
          "--n": n,
          animationDelay: `${delay}s`,
        } as React.CSSProperties
      }
    >
      {text}
    </p>
  );

  return (
    <main className="flex-1 overflow-x-clip">
      {/* manual hero */}
      <section className={`${wrap} pb-10 pt-8`}>
        <div className="mo flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ac opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ac" />
            </span>
            (Field manual)
          </span>
          <span className="hidden sm:inline">TOOLS(1)</span>
          <span>
            {tools.length} {tools.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        <h1 className="mt-8 font-mono text-[clamp(72px,17vw,280px)] font-bold uppercase leading-[0.85] tracking-tight">
          Tools
          <span className="ml-[0.04em] animate-[blink_1s_step-end_infinite] text-ac motion-reduce:animate-none">
            _
          </span>
        </h1>

        {/* terminal */}
        <div className="mt-10 max-w-3xl border border-ln bg-ch font-mono text-[11px] sm:text-sm">
          <div className="flex items-center gap-2 border-b border-ln px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
            <span className="mo ml-3">~/signal/tools</span>
          </div>
          <div className="space-y-2 p-4 leading-relaxed">
            {typed(18, 0.4, "$ man signal-tools")}
            {typed(
              43,
              1.4,
              "NAME   open-source security tools, explained",
              "text-mu"
            )}
            {typed(
              50,
              2.6,
              "TRY    pick a tool, copy a command, read the entry",
              "text-mu"
            )}
            <p className="text-tx">
              <span className="text-ac">$</span>{" "}
              <span className="inline-block h-[1em] w-[0.6ch] translate-y-[2px] animate-[blink_1s_step-end_infinite] bg-tx motion-reduce:animate-none" />
            </p>
          </div>
        </div>
      </section>

      {tools.length === 0 && (
        <section className={`${wrap} pb-20`}>
          <p className="text-mu">Nothing here yet.</p>
        </section>
      )}

      {/* shelf */}
      {tools.length > 0 && (
        <section className="border-t border-paper/30">
          <div className={`${wrap} py-14`}>
            <ToolShelf tools={tools} />
          </div>
        </section>
      )}

      {/* submit */}
      <section className={`${wrap} py-20 text-center`}>
        <p className="mo">(Contribute)</p>
        <h2 className="font-display mt-3 text-[clamp(32px,7vw,100px)] uppercase leading-[0.9]">
          Know a tool we missed?
        </h2>
        <p className="mx-auto mt-4 max-w-[50ch] text-mu">
          Write up a tool in plain language. An editor reviews it and approved
          work goes public with your name and timestamp.
        </p>
        <Link
          href="/submit"
          className="mt-8 inline-flex items-center rounded-full bg-paper px-8 py-4 font-mono text-xs uppercase tracking-widest text-ink hover:opacity-80"
        >
          Submit a post ↗
        </Link>
      </section>
    </main>
  );
}