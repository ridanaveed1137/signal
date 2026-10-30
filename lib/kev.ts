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

const URL =
  "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";

// CISA Known Exploited Vulnerabilities catalog (public domain).
// Cached for an hour, so the page refreshes itself without a rebuild.
export async function getKev(): Promise<Kev | null> {
  try {
    const res = await fetch(URL, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();

    const items: KevItem[] = (json.vulnerabilities ?? []).map(
      (v: Record<string, unknown>) => ({
        cve: String(v.cveID ?? ""),
        vendor: String(v.vendorProject ?? ""),
        product: String(v.product ?? ""),
        name: String(v.vulnerabilityName ?? ""),
        desc: String(v.shortDescription ?? ""),
        added: String(v.dateAdded ?? ""),
        due: String(v.dueDate ?? ""),
        ransomware: v.knownRansomwareCampaignUse === "Known",
      })
    );

    items.sort((a, b) => b.added.localeCompare(a.added));

    return {
      released: String(json.dateReleased ?? ""),
      total: Number(json.count ?? items.length),
      items,
    };
  } catch {
    return null;
  }
}