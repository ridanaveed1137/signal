import { PORTS } from "@/lib/ports";
import SplitFlap from "@/components/SplitFlap";

export const revalidate = false;

export default function PortsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10">
      <h1 className="font-display text-6xl tracking-[0.02em]">
        <SplitFlap text="PORTS" />
      </h1>
      <p className="mo mb-14 mt-2">
        The lookbook · {PORTS.length} looks
      </p>

      <div className="flex flex-col">
        {PORTS.map((p, i) => (
          <div
            key={p.number}
            className="grid grid-cols-[auto_1fr] items-baseline gap-6 border-t border-ln py-8 first:border-t-0 md:grid-cols-[200px_1fr]"
          >
            <div>
              <p className="mo">Look {String(i + 1).padStart(3, "0")}</p>
              <p className="font-display text-[clamp(48px,6vw,88px)] leading-none">
                {p.number}
              </p>
            </div>
            <div>
              <p className="font-display text-2xl md:text-3xl">{p.name}</p>
              <p className="mo mt-1">{p.protocol}</p>
              <p className="mt-2 max-w-[60ch] text-mu">{p.note}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}