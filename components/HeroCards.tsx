import Link from "next/link";
import Visual from "@/components/Visual";
import type { Post } from "@/lib/types";
import { labelFor, readMinutes, stamp } from "@/lib/editorial";

const SECTIONS = [
  { label: "Trends", href: "/trends" },
  { label: "Tools", href: "/tools" },
  { label: "Ports", href: "/ports" },
  { label: "Projects", href: "/projects" },
];

export default function HeroCards({
  lead,
  next,
}: {
  lead: Post;
  next?: Post;
}) {
  const facts = [
    ["Topic", labelFor(lead)],
    ["Author", lead.author_name],
    ["Length", `${readMinutes(lead.body)} min read`],
    ["Date", stamp(lead.created_at)],
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      {/* tall card + small circle + thumbnail */}
      <div className="flex items-start gap-3">
        <Link
          href={`/post/${lead.slug}`}
          className="flex h-[min(72vh,570px)] w-[min(448px,86vw)] bg-paper text-ink"
        >
          <div className="w-[39%] shrink-0 overflow-hidden [&_svg]:h-full [&_svg]:w-full [&_svg]:grayscale">
            <Visual post={lead} big />
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-center gap-6 p-4">
            <div>
              <span className="mo text-ink/50">(Cover story)</span>
              <p className="font-display mt-2 text-[15px] uppercase leading-[1.05] [overflow-wrap:anywhere]">
                {lead.title}
              </p>
            </div>

            <dl className="space-y-3 text-[11px] leading-snug">
              {facts.map(([k, v], i) => (
                <div key={k} className="flex gap-3">
                  <dt className="text-ink/50">1.{i + 1}</dt>
                  <dd className="min-w-0">
                    <span className="block font-semibold">{k}</span>
                    <span className="block text-ink/70 [overflow-wrap:anywhere]">
                      {v}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Link>

        <div className="hidden w-[68px] shrink-0 flex-col gap-2 sm:flex">
          <div className="relative aspect-square rounded-full bg-paper">
            <span className="absolute left-[18%] top-[30%] h-[16%] w-[16%] rounded-full bg-ink" />
            <span className="absolute left-[64%] top-[14%] h-[11%] w-[11%] rounded-full bg-ink" />
            <span className="absolute left-[46%] top-[74%] h-[8%] w-[8%] rounded-full bg-ink" />
          </div>
          <div className="aspect-square overflow-hidden [&_svg]:h-full [&_svg]:w-full [&_svg]:grayscale">
            <Visual post={lead} />
          </div>
        </div>
      </div>

      {/* wide card */}
      {next && (
        <Link
          href={`/post/${next.slug}`}
          className="flex h-[min(44vh,340px)] w-[min(1040px,92vw)] bg-paper text-ink"
        >
          <div className="w-[34%] shrink-0 overflow-hidden [&_svg]:h-full [&_svg]:w-full [&_svg]:grayscale">
            <Visual post={next} big />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
            <span className="mo text-ink/50">
              (Next up) · {labelFor(next)}
            </span>
            <p className="font-display text-[clamp(14px,1.6vw,22px)] uppercase leading-[1.05] [overflow-wrap:anywhere]">
              {next.title}
            </p>
            <span className="mo text-ink/50">
              {readMinutes(next.body)} min · {stamp(next.created_at)}
            </span>
          </div>
          <div className="hidden w-[30%] shrink-0 flex-col justify-center pr-6 md:flex">
            {SECTIONS.map((s) => (
              <span
                key={s.href}
                className="text-[clamp(20px,2.4vw,38px)] leading-[1.04] tracking-[-0.03em]"
              >
                {s.label}
              </span>
            ))}
          </div>
        </Link>
      )}
    </div>
  );
}