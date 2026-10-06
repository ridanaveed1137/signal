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
    ["SUMMARY", post.summary ?? ""],
    ["TOPIC", labelFor(post)],
    ["LICENSE", String(meta.license ?? "")],
    ["SOURCE", host(post.source_url) || host(meta.repo)],
  ].filter(([, v]) => v);

  return (
    <Link
      href={`/post/${post.slug}`}
      className="group grid gap-8 md:grid-cols-12 md:gap-10"
      style={{ "--ta": color } as React.CSSProperties}
    >
      <div className="md:col-span-5">
        <p className="mo ta">Featured tool</p>
        <h3 className="mt-3 font-mono text-[clamp(36px,5.5vw,80px)] font-semibold leading-none tracking-tight transition-colors group-hover:text-ac">
          {post.title.split(":")[0]}
        </h3>
      </div>

      <div className="border border-ln bg-ch p-5 font-mono text-[13px] leading-7 md:col-span-7">
        <div className="mo mb-3 flex justify-between">
          <span>TOOL(1)</span>
          <span>Signal field manual</span>
        </div>

        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[88px_1fr] gap-3">
            <span className="ta">{k}</span>
            <span className="text-tx">{v}</span>
          </div>
        ))}
      </div>
    </Link>
  );
}