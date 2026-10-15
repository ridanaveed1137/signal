import { PORTS } from "@/lib/ports";
import SplitFlap from "@/components/SplitFlap";

export const revalidate = false;

const RISK_COLOR: Record<string, string> = {
  high: "#ff3b30",
  medium: "#e5a53b",
  low: "#4a9d6e",
};

function riskFor(note: string): keyof typeof RISK_COLOR {
  const n = note.toLowerCase();
  if (n.includes("should not") || n.includes("never") || n.includes("ransomware") || n.includes("compromise") || n.includes("no auth")) return "high";
  if (n.includes("legacy") || n.includes("plaintext") || n.includes("weak")) return "medium";
  return "low";
}

export default function PortsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10">
      <h1 className="font-display text-6xl tracking-[0.02em]">
        <SplitFlap text="PORTS" />
      </h1>
      <p className="mo mb-16 mt-2">The lookbook · {PORTS.length} looks</p>

      <div className="flex flex-col">
        {PORTS.map((p, i) => {
          const risk = riskFor(p.note);
          const color = RISK_COLOR[risk];

          return (
            <div
              key={p.number}
              className="border-t border-ln py-10 first:border-t-0"
              style={{ "--ta": color } as React.CSSProperties}
            >
              <p className="mo ta">Look {String(i + 1).padStart(3, "0")}</p>

              <p className="font-display mt-1 text-[clamp(40px,10vw,72px)] leading-[1]">
                {p.number}
              </p>

              <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="font-display text-xl">{p.name}</p>
                <span className="mo ta">{p.protocol}</span>
              </div>

              <p className="mt-2 max-w-[60ch] text-mu">{p.note}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}