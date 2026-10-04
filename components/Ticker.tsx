const TOPICS = [
  "THREAT INTELLIGENCE",
  "NETWORK SECURITY",
  "CLOUD SECURITY",
  "AI SECURITY",
  "ZERO TRUST",
  "MALWARE RESEARCH",
  "CTF",
  "OSINT",
];

export default function Ticker() {
  const items = [...TOPICS, ...TOPICS, ...TOPICS, ...TOPICS];

  return (
    <div className="tick mo" aria-hidden="true">
      <div>
        {items.map((t, i) => (
          <span key={i} className="mr-3">
            {t} <span className="text-ac">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}