import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import SplitFlap from "@/components/SplitFlap";
import { safeUrl, stamp } from "@/lib/editorial";

export const dynamic = "force-dynamic";

export default async function PapersPage() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("type", "paper")
    .order("created_at", { ascending: false });

  if (error) console.log(error);

  const papers = (data ?? []) as Post[];

  return (
    <main className="flex-1 bg-paper text-ink">
      <div className="mx-auto w-full max-w-5xl px-5 py-14">
        <h1 className="font-mono text-3xl font-bold uppercase tracking-widest">
          <SplitFlap text="PAPERS" />
        </h1>
        <p className="mo mt-2 text-ink/60">
          Research in plain language · {papers.length} on file
        </p>

        {papers.length === 0 && (
          <p className="mt-16 text-ink/70">
            No papers yet.{" "}
            <Link href="/submit" className="underline">
              Submit one.
            </Link>
          </p>
        )}

        <div className="mt-14 flex flex-col">
          {papers.map((p, i) => {
            const meta = p.metadata ?? {};
            const original = safeUrl(meta.link);

            return (
              <article
                key={p.id}
                className="grid gap-6 border-t border-ink/15 py-12 md:grid-cols-12 md:gap-10"
              >
                <div className="mo text-ink/60 md:col-span-3">
                  <p>No. {String(i + 1).padStart(2, "0")}</p>
                  {meta.authors && <p className="mt-3">{meta.authors}</p>}
                  {meta.year && <p>{meta.year}</p>}
                  <p className="mt-3">
                    {p.curated ? "Curated by" : "By"} {p.author_name}
                  </p>
                  <p>{stamp(p.created_at)}</p>
                </div>

                <div className="md:col-span-9">
                  <Link href={`/post/${p.slug}`} className="group block">
                    <h2 className="max-w-[22ch] text-[clamp(30px,4.6vw,64px)] font-semibold leading-[1.02] tracking-[-0.02em] decoration-1 underline-offset-8 group-hover:underline">
                      {p.title}
                    </h2>
                    {p.summary && (
                      <p className="pull mt-5 max-w-[52ch] text-[clamp(22px,2.6vw,32px)] text-ink/85">
                        "{p.summary}"
                      </p>
                    )}
                  </Link>

                  <div className="mo mt-6 flex flex-wrap gap-x-6 gap-y-2 text-ink/60">
                    <Link
                      href={`/post/${p.slug}`}
                      className="hover:text-ink"
                    >
                      Read the summary →
                    </Link>
                    {original && (
                      <a
                        href={original}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-ink"
                      >
                        Original paper ↗
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}