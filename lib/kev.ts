export type KevItem = {
  cve: string;
  vendor: string;
  product: string;
  name: string;
  desc: string;
  added: string; // YYYY-MM-DD
  due: string;
  ransomware: boolean;
};

export type Kev = {
  released: string;
  total: number;
  items: KevItem[];
};

// CISA Known Exploited Vulnerabilities catalog (public domain).
// Tried in order: CISA's own feed first, then CISA's official mirror on
// GitHub (same JSON format) in case cisa.gov blocks or times out.
const SOURCES = [
  "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json",
  "https://raw.githubusercontent.com/cisagov/kev-data/develop/known_exploited_vulnerabilities.json",
];

// cisa.gov sits behind a bot filter that often rejects Node's default
// fetch, so we identify like a normal browser.
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
  Accept: "application/json,text/plain,*/*",
  "Accept-Language": "en-US,en;q=0.9",
};

// last good result, reused if every source fails (keeps the page alive
// during a short outage instead of showing "unreachable")
let lastGood: Kev | null = null;

function parse(json: Record<string, unknown>): Kev | null {
  const list = json.vulnerabilities;
  if (!Array.isArray(list) || list.length === 0) return null;

  const items: KevItem[] = list.map((v: Record<string, unknown>) => ({
    cve: String(v.cveID ?? ""),
    vendor: String(v.vendorProject ?? ""),
    product: String(v.product ?? ""),
    name: String(v.vulnerabilityName ?? ""),
    desc: String(v.shortDescription ?? ""),
    added: String(v.dateAdded ?? ""),
    due: String(v.dueDate ?? ""),
    ransomware: v.knownRansomwareCampaignUse === "Known",
  }));

  items.sort((a, b) => b.added.localeCompare(a.added));

  return {
    released: String(json.dateReleased ?? ""),
    total: Number(json.count ?? items.length),
    items,
  };
}

// Cached for an hour, so the page refreshes itself without a rebuild.
export async function getKev(): Promise<Kev | null> {
  for (const url of SOURCES) {
    try {
      const res = await fetch(url, {
        headers: HEADERS,
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) {
        console.warn(`[kev] ${url} -> HTTP ${res.status}`);
        continue;
      }
      const kev = parse(await res.json());
      if (!kev) {
        console.warn(`[kev] ${url} -> unexpected JSON shape`);
        continue;
      }
      lastGood = kev;
      return kev;
    } catch (err) {
      // "fetch failed" hides the real reason; it lives in err.cause
      const e = err as Error & { cause?: { code?: string; message?: string } };
      const why = e.cause?.code ?? e.cause?.message ?? e.message;
      console.warn(`[kev] ${url} -> ${e.message} (${why})`);
    }
  }
  return lastGood;
}