import Link from "next/link";
import type { Post } from "@/lib/types";
import { colorFor, labelFor } from "@/lib/editorial";

function host(u?: string | number | null) {
  try {
    return new URL(String(u)).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export default function ToolFeature({ post }: { post: Post }) {
  const meta = post.metadata ?? {};
  const color = colorFor(post);

  const rows = [
    ["NAME", post.title],
    ["TOPIC", labelFor(post)],
    ["LICENSE", String(meta.license ?? "")],
    ["SOURCE", host(post.source_url) || host(meta.repo)],
  ].filter(([, v]) => v);

  return (
    <Link
      href={`/post/${post.slug}`}
      className="group grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12"
      style={{ "--ta": color } as React.CSSProperties}
    >
      <div className="flex min-w-0 flex-col justify-between gap-8 md:col-span-7">
        <p className="mo ta">(Featured tool)</p>
        <h3 className="font-mono text-[clamp(64px,11vw,190px)] font-semibold leading-[0.85] tracking-tight transition-colors [overflow-wrap:anywhere] group-hover:text-ac">
          {post.title.split(":")[0]}
        </h3>
        {post.summary && (
          <p className="max-w-[36ch] text-lg text-mu md:text-xl">
            {post.summary}
          </p>
        )}
      </div>

      <div className="flex min-w-0 flex-col justify-between border border-ln bg-ch p-6 font-mono text-[13px] leading-7 md:col-span-5 md:p-8">
        <div className="mo mb-6 flex justify-between">
          <span>TOOL(1)</span>
          <span>Signal field manual</span>
        </div>

        <div className="space-y-2">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[88px_minmax(0,1fr)] gap-3">
              <span className="ta">{k}</span>
              <span className="break-words text-tx">{v}</span>
            </div>
          ))}
        </div>

        <span className="mo ta mt-8 block">Read the full entry ↗</span>
      </div>
    </Link>
  );
}