"use client";
import { useRef, useState } from "react";
import CountUp from "@/components/CountUp";
import { PORT_INFO, RISK_BLURB, searchPorts } from "@/lib/portInfo";

type Risk = "high" | "medium" | "low";

type Port = {
  number: number;
  name: string;
  protocol: string;
  note: string;
  risk: Risk;
};

const COLOR: Record<Risk, string> = {
  high: "#ff3b30",
  medium: "#e5a53b",
  low: "#4a9d6e",
};

const LABEL: Record<Risk, string> = {
  high: "High risk",
  medium: "Watch it",
  low: "Low risk",
};

const EXAMPLES = [22, 80, 443, 3389, 445];

// chip text was tiny (inherited from .mo); sized inline so it always wins
const CHIP_FONT = { fontSize: "clamp(12px, 1.05vw, 14px)" } as const;

function rangeOf(n: number) {
  if (n <= 1023) return "Well-known port (0–1023): assigned to core services.";
  if (n <= 49151)
    return "Registered port (1024–49151): used by specific applications.";
  return "Dynamic port (49152–65535): temporary, normally used by clients.";
}

const MAX_LOG = Math.log10(65535);
// rounded so server and browser render the exact same string (avoids a
// hydration mismatch from tiny floating-point differences in Math.log10)
const posOf = (n: number) =>
  Math.round(
    ((Math.log10(Math.max(n, 10)) - 1) / (MAX_LOG - 1)) * 100 * 100
  ) / 100;

function Led({ risk, size = 10 }: { risk: Risk; size?: number }) {
  return (
    <span
      className="relative inline-flex shrink-0"
      style={{ width: size, height: size }}
    >
      {risk === "high" && (
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 motion-reduce:animate-none"
          style={{ background: COLOR[risk] }}
        />
      )}
      <span
        className="relative inline-flex h-full w-full rounded-full"
        style={{ background: COLOR[risk] }}
      />
    </span>
  );
}

export default function PortConsole({ ports }: { ports: Port[] }) {
  const [digits, setDigits] = useState("");
  const [picked, setPicked] = useState<number | null>(null);
  const [risk, setRisk] = useState<"all" | Risk>("all");
  const [proto, setProto] = useState("All");
  const [q, setQ] = useState("");
  const [hover, setHover] = useState<Port | null>(null);
  const [copied, setCopied] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const typed = digits !== "";
  const n = typed ? Number(digits) : picked;
  const entry = n === null ? undefined : ports.find((p) => p.number === n);

  const counts = {
    high: ports.filter((p) => p.risk === "high").length,
    medium: ports.filter((p) => p.risk === "medium").length,
    low: ports.filter((p) => p.risk === "low").length,
  };

  const protos = ["All", ...Array.from(new Set(ports.map((p) => p.protocol)))];

  // risk + protocol chips narrow the list, then the smarter search ranks it
  const base = ports.filter(
    (p) =>
      (risk === "all" || p.risk === risk) &&
      (proto === "All" || p.protocol === proto)
  );
  const shown = searchPorts(base, q);

  const pick = (num: number, scroll = true) => {
    setDigits("");
    setPicked(num);
    if (scroll)
      heroRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // tapping a risk counter now also drives the description box
  const pickRisk = (r: Risk) => {
    const next = risk === r ? "all" : r;
    setRisk(next);
    setPicked(null);
    setDigits("");
    if (next !== "all")
      heroRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const onType = (v: string) => {
    let d = v.replace(/\D/g, "").slice(0, 5);
    if (d !== "" && Number(d) > 65535) d = "65535";
    setPicked(null);
    setDigits(d);
  };

  const command = (p: Port | undefined, num: number) => {
    const udpOnly = p && /udp/i.test(p.protocol) && !/tcp/i.test(p.protocol);
    return `nmap ${udpOnly ? "-sU " : ""}-p ${num} <target>`;
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  };

  const active = hover ?? entry ?? null;
  const activeInfo = active ? PORT_INFO[active.number] : undefined;
  // nothing specific selected, but a risk level is: describe that level
  const riskView: Risk | null =
    !active && n === null && risk !== "all" ? risk : null;
  const riskPorts = riskView ? ports.filter((p) => p.risk === riskView) : [];

  return (
    <div>
      {/* lookup + result */}
      <section
        ref={heroRef}
        className="mx-auto w-full max-w-7xl px-5 pb-10"
      >
        <label className="mo block" htmlFor="port-input">
          Look up a port · 0 to 65535
        </label>
        <input
          id="port-input"
          inputMode="numeric"
          autoComplete="off"
          value={digits}
          onChange={(e) => onType(e.target.value)}
          placeholder={picked !== null ? String(picked) : "22"}
          aria-label="Port number"
          className="font-display mt-2 w-full bg-transparent text-[clamp(72px,19vw,300px)] leading-[0.95] tracking-[-0.03em] caret-[var(--color-ac)] outline-none placeholder:text-paper/25"
        />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mo mr-1">Try</span>
          {EXAMPLES.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => pick(e, false)}
              className="mo rounded-full border border-paper/30 px-4 py-2 transition-colors hover:border-paper hover:bg-paper hover:text-ink"
            >
              {e}
            </button>
          ))}
        </div>

        <div
          className="mt-10 border bg-ch p-6 transition-colors duration-300 md:p-8"
          style={{
            borderColor: active
              ? COLOR[active.risk]
              : riskView
                ? COLOR[riskView]
                : "var(--color-ln)",
          }}
          aria-live="polite"
        >
          {active ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
              <div className="md:col-span-5">
                <div className="mo flex items-center gap-2">
                  <Led risk={active.risk} />
                  {LABEL[active.risk]} · {active.protocol}
                </div>
                <p className="font-display mt-5 text-[clamp(56px,8vw,120px)] leading-none">
                  {active.number}
                </p>
                <p className="font-display mt-3 text-[clamp(26px,2.8vw,42px)] uppercase leading-[1.05]">
                  {active.name}
                </p>
              </div>
              <div className="md:col-span-7">
                <p className="text-lg text-mu md:text-xl">{active.note}</p>
                {activeInfo && (
                  <p className="mt-4 text-base leading-relaxed text-tx/80 md:text-lg">
                    {activeInfo.desc}
                  </p>
                )}
                <p className="mo mt-5 normal-case tracking-normal">
                  {rangeOf(active.number)}
                </p>
                <button
                  type="button"
                  onClick={() => copy(command(active, active.number))}
                  className="mt-6 flex w-full items-center justify-between gap-3 border border-ln bg-bg px-3 py-3 text-left font-mono text-xs text-tx transition-colors hover:border-paper/60 sm:text-sm"
                >
                  <span className="truncate">
                    <span className="text-ac">$</span>{" "}
                    {command(active, active.number)}
                  </span>
                  <span className="mo shrink-0">
                    {copied ? "Copied" : "Copy"}
                  </span>
                </button>
                <p className="mo mt-3 normal-case tracking-normal opacity-70">
                  Only scan systems you own or are authorized to test.
                </p>
              </div>
            </div>
          ) : riskView ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
              <div className="md:col-span-5">
                <div className="mo flex items-center gap-2">
                  <Led risk={riskView} />
                  {LABEL[riskView]} · all protocols
                </div>
                <p className="font-display mt-5 text-[clamp(56px,8vw,120px)] leading-none">
                  {riskPorts.length}
                </p>
                <p className="font-display mt-3 text-[clamp(26px,2.8vw,42px)] uppercase leading-[1.05]">
                  Ports in this group
                </p>
              </div>
              <div className="md:col-span-7">
                <p className="text-lg text-mu md:text-xl">
                  {RISK_BLURB[riskView]}
                </p>
                <p className="mo mt-5 normal-case tracking-normal">
                  Tap a port to read about it.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {riskPorts.map((p) => (
                    <button
                      key={p.number}
                      type="button"
                      onClick={() => pick(p.number, false)}
                      className="mo rounded-full border border-paper/30 px-3 py-1.5 transition-colors hover:border-paper hover:bg-paper hover:text-ink"
                      style={CHIP_FONT}
                    >
                      {p.number} · {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : n !== null ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
              <div className="md:col-span-5">
                <p className="mo">Not in the lookbook</p>
                <p className="font-display mt-5 text-[clamp(56px,8vw,120px)] leading-none">
                  {n}
                </p>
              </div>
              <div className="md:col-span-7">
                <p className="text-lg text-mu md:text-xl">
                  No common service is catalogued on this port.
                </p>
                <p className="mo mt-5 normal-case tracking-normal">
                  {rangeOf(n)}
                </p>
                <p className="mt-5 text-sm text-mu">
                  An unexpected open port deserves a look: find out which
                  program is listening and whether it should be.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <p className="font-display text-[clamp(32px,4vw,56px)] uppercase leading-none md:col-span-5">
                Type a number.
              </p>
              <p className="text-base text-mu md:col-span-7">
                Or hover the strip below, tap a port in the panel, or tap a
                risk level. Every answer shows the service, how risky it is,
                and a scan command you can copy.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* scan strip */}
      <section className="mx-auto w-full max-w-7xl px-5 pb-14">
        <div className="mo mb-3 flex items-center justify-between">
          <span>(Scan strip)</span>
          <span>
            {hover ? `${hover.number} · ${hover.name}` : "hover a tick"}
          </span>
        </div>
        <div className="relative h-20 border-y border-paper/30">
          {[10, 100, 1000, 10000, 65535].map((m) => (
            <span
              key={m}
              className={`mo absolute bottom-1 ${
                m === 10
                  ? ""
                  : m === 65535
                    ? "-translate-x-full"
                    : "-translate-x-1/2"
              }`}
              style={{ left: `${posOf(m)}%` }}
            >
              {m === 65535 ? "65k" : m >= 1000 ? `${m / 1000}k` : m}
            </span>
          ))}
          {ports.map((p) => {
            const sel = n === p.number;
            return (
              <button
                key={p.number}
                type="button"
                onMouseEnter={() => setHover(p)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(p)}
                onBlur={() => setHover(null)}
                onClick={() => pick(p.number)}
                aria-label={`Port ${p.number}, ${p.name}`}
                className="group absolute top-0 -translate-x-1/2 px-[3px]"
                style={{ left: `${posOf(p.number)}%` }}
              >
                <span
                  className="block w-[2px] transition-all duration-200 group-hover:w-[4px]"
                  style={{
                    height: sel
                      ? 52
                      : p.risk === "high"
                        ? 40
                        : p.risk === "medium"
                          ? 30
                          : 22,
                    background: COLOR[p.risk],
                    opacity: sel ? 1 : 0.8,
                  }}
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* risk board */}
      <section className="mx-auto w-full max-w-7xl px-5 pb-14">
        <div className="grid grid-cols-1 border-y border-paper/30 md:grid-cols-3 md:divide-x md:divide-paper/30">
          {(["high", "medium", "low"] as Risk[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => pickRisk(r)}
              className={`p-6 text-left transition-colors hover:bg-paper/5 ${
                risk === r ? "bg-paper/10" : ""
              }`}
            >
              <span className="mo flex items-center gap-2">
                <Led risk={r} /> {LABEL[r]}
              </span>
              <CountUp
                to={counts[r]}
                className="font-display mt-4 block text-[clamp(56px,8vw,120px)] leading-none"
              />
              <span className="mo mt-3 block">
                {risk === r
                  ? "Showing in panel · tap to clear"
                  : "tap to filter"}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* patch panel */}
      <section className="border-t border-paper/30">
        <div className="mx-auto w-full max-w-7xl px-5 py-14">
          <div className="mb-8 flex items-end justify-between gap-3 border-b border-paper/30 pb-3">
            <h2 className="font-display text-[clamp(36px,7vw,110px)] uppercase leading-[0.85]">
              <sup className="mo mr-3 align-top">(01)</sup>
              Patch panel
            </h2>
            <span className="mo">
              ({shown.length} of {ports.length} ports)
            </span>
          </div>

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <label className="flex items-center gap-3 border border-ln bg-ch px-5 py-4 font-mono text-base md:w-[440px] md:text-lg">
              <span className="text-ac">name:</span>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ssh, database, plaintext…"
                aria-label="Filter ports"
                className="min-w-0 flex-1 bg-transparent text-tx outline-none placeholder:text-mu/60"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {(["all", "high", "medium", "low"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRisk(r)}
                  className={`mo flex items-center gap-2 rounded-full border px-5 py-2.5 transition-colors ${
                    risk === r
                      ? "border-paper bg-paper text-ink"
                      : "border-paper/30 hover:border-paper"
                  }`}
                  style={CHIP_FONT}
                >
                  {r !== "all" && (
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ background: COLOR[r] }}
                    />
                  )}
                  {r === "all" ? "All risks" : LABEL[r]}
                </button>
              ))}
              {protos.length > 2 &&
                protos.map((pr) => (
                  <button
                    key={pr}
                    type="button"
                    onClick={() => setProto(pr)}
                    className={`mo rounded-full border px-5 py-2.5 transition-colors ${
                      proto === pr
                        ? "border-paper bg-paper text-ink"
                        : "border-paper/30 hover:border-paper"
                    }`}
                    style={CHIP_FONT}
                  >
                    {pr}
                  </button>
                ))}
            </div>
          </div>

          {shown.length === 0 && (
            <p className="mt-8 border border-ln bg-ch p-6 font-mono text-sm text-mu">
              <span className="text-ac">$</span> no ports match
              {q.trim() ? ` "${q.trim()}"` : " those filters"}. try a number, a
              service name, or a word like database, email or remote.
            </p>
          )}

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {shown.map((p, i) => {
              const sel = n === p.number;
              return (
                <button
                  key={p.number}
                  type="button"
                  onClick={() => pick(p.number)}
                  aria-pressed={sel}
                  className="group relative flex animate-[rise-in_0.6s_cubic-bezier(.2,.8,.2,1)_backwards] flex-col justify-between overflow-hidden rounded-xl border bg-ch p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-paper/60 motion-reduce:animate-none"
                  style={{
                    animationDelay: `${Math.min(i, 12) * 0.04}s`,
                    borderColor: sel ? COLOR[p.risk] : "var(--color-ln)",
                    boxShadow: sel ? `0 0 0 1px ${COLOR[p.risk]}` : undefined,
                  }}
                >
                  <span className="flex items-center justify-between">
                    <Led risk={p.risk} size={10} />
                    <span className="mo">{p.protocol}</span>
                  </span>
                  <span className="font-display mt-8 block text-[clamp(38px,4.6vw,66px)] leading-none">
                    {p.number}
                  </span>
                  <span className="mt-3 block text-[clamp(15px,1.35vw,20px)] font-semibold uppercase leading-tight [overflow-wrap:anywhere]">
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}