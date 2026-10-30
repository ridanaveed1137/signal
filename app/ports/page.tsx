import Link from "next/link";
import { PORTS } from "@/lib/ports";
import PortConsole from "@/components/PortConsole";

export const revalidate = false;

type Risk = "high" | "medium" | "low";

function riskFor(note: string): Risk {
  const n = note.toLowerCase();
  if (
    n.includes("should not") ||
    n.includes("never") ||
    n.includes("ransomware") ||
    n.includes("compromise") ||
    n.includes("no auth")
  )
    return "high";
  if (n.includes("legacy") || n.includes("plaintext") || n.includes("weak"))
    return "medium";
  return "low";
}

const wrap = "mx-auto w-full max-w-7xl px-5";

export default function PortsPage() {
  const ports = PORTS.map((p) => ({
    number: Number(p.number),
    name: String(p.name),
    protocol: String(p.protocol),
    note: String(p.note),
    risk: riskFor(String(p.note)),
  })).filter((p) => Number.isFinite(p.number));

  return (
    <main className="flex-1 overflow-x-clip">
      <section className={`${wrap} pb-8 pt-8`}>
        <div className="mo flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ac opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ac" />
            </span>
            (Port reference)
          </span>
          <span>{ports.length} ports catalogued</span>
        </div>

        <h1 className="font-display mt-8 text-[clamp(40px,8vw,128px)] uppercase leading-[0.9] tracking-[-0.02em]">
          Which port is that?
        </h1>
      </section>

      <PortConsole ports={ports} />

      <section className={`${wrap} py-20 text-center`}>
        <p className="mo">(Contribute)</p>
        <h2 className="font-display mt-3 text-[clamp(32px,7vw,100px)] uppercase leading-[0.9]">
          Missing a port?
        </h2>
        <p className="mx-auto mt-4 max-w-[50ch] text-mu">
          Tell the community what runs where. An editor reviews it and approved
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