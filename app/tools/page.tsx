import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import SplitFlap from "@/components/SplitFlap";
import Visual from "@/components/Visual";
import { colorFor, labelFor, voiceFor } from "@/lib/editorial";

export const dynamic = "force-dynamic";

const shortName = (p: Post) => p.title.split(":")[0].trim();

function host(u?: string | number | null) {
  try {
    return new URL(String(u)).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export default async function ToolsPage() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("type", "tool")
    .order("created_at", { ascending: false });

  if (error) console.log(error);

  const tools = (data ?? []) as Post[];
  const featured = tools.find((p) => p.featured) ?? tools[0];

  const sorted = [...tools].sort((a, b) =>
    shortName(a).localeCompare(shortName(b))
  );
  const groups = new Map<string, Post[]>();
  sorted.forEach((p) => {
    const letter = shortName(p)[0]?.toUpperCase() ?? "#";
    groups.set(letter, [...(groups.get(letter) ?? []), p]);
  });

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10">
      <h1 className="font-display text-6xl tracking-[0.02em]">
        <SplitFlap text="TOOLS" />
      </h1>
      <p className="mo mb-12 mt-2">
        Field manual · {tools.length} {tools.length === 1 ? "entry" : "entries"}
      </p>

      {tools.length === 0 && <p className="text-mu">Nothing here yet.</p>}

      {featured && (
        <Link
          href={`/post/${featured.slug}`}
          className="group mb-20 grid gap-8 md:grid-cols-12 md:gap-10"
          style={{ "--ta": colorFor(featured) } as React.CSSProperties}
        >
          <div className="flex flex-col justify-end md:col-span-5">
            <p className="mo ta">Tool of the moment</p>
            <h2 className="display mt-3 text-[clamp(56px,8vw,120px)] italic leading-[0.85] transition-colors group-hover:text-ac">
              {shortName(featured)}
            </h2>
            {featured.summary && (
              <p className="mt-5 max-w-[40ch] text-lg text-mu">
                {featured.summary}
              </p>
            )}
          </div>

          <div className="aspect-[16/9] overflow-hidden border border-ln md:col-span-7">
            <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03] [&>svg]:block [&>svg]:h-full [&>svg]:w-full">
              <Visual post={featured} big />
            </div>
          </div>
        </Link>
      )}

      <div className="border-t border-ln">
        {[...groups.entries()].map(([letter, items]) => (
          <div
            key={letter}
            className="grid gap-4 border-b border-ln py-10 md:grid-cols-12 md:gap-10"
          >
            <div className="font-display text-[clamp(60px,8vw,110px)] italic leading-none text-tx/15 md:col-span-2">
              {letter}
            </div>

            <div className="flex flex-col md:col-span-10">
              {items.map((p) => {
                const meta = p.metadata ?? {};
                const details = [
                  meta.license ? String(meta.license) : "",
                  host(p.source_url) || host(meta.repo),
                ].filter(Boolean);

                return (
                  <Link
                    key={p.id}
                    href={`/post/${p.slug}`}
                    className="group border-t border-ln py-6 pl-6 transition-colors first:border-t-0 hover:bg-ch"
                    style={{
                      "--ta": colorFor(p),
                      borderLeft: "3px solid transparent",
                      marginLeft: "-1.5rem",
                    } as React.CSSProperties}
                  >
                    <p className="mo ta">
                      {labelFor(p)}
                      {details.length > 0 && ` · ${details.join(" · ")}`}
                    </p>
                    <h3
                    className={`${voiceFor(p.slug)} mt-1 leading-[0.95] transition-colors group-hover:text-ac`}
                    >
                      {shortName(p)}
                    </h3>
                    {p.summary && (
                      <p className="mt-2 max-w-[62ch] text-mu">{p.summary}</p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}