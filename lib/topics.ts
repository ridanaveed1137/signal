export type Topic = {
  slug: string;
  title: string;
  headline: string;
  blurb: string;
  color: string;
};

export const TOPICS: Topic[] = [
  {
    slug: "networking",
    title: "Networking",
    headline: "THE WIRE IS THE ATTACK SURFACE.",
    blurb: "Protocols, infrastructure, attacks and the systems connecting everything.",
    color: "#4fc3f7",
  },
  {
    slug: "ai-security",
    title: "AI Security",
    headline: "MODELS HAVE VULNERABILITIES TOO.",
    blurb: "AI security research, model vulnerabilities, prompt attacks and emerging defenses.",
    color: "#9d7cf5",
  },
  {
    slug: "cloud-security",
    title: "Cloud Security",
    headline: "THE PERIMETER MOVED TO THE CLOUD.",
    blurb: "Identity, infrastructure, workloads and the new security boundary.",
    color: "#6f8cf0",
  },
  {
    slug: "cryptography",
    title: "Cryptography",
    headline: "TRUST THE MATH. AUDIT THE CODE.",
    blurb: "Cryptography, protocols, privacy and the science behind secure communication.",
    color: "#5fd0c4",
  },
  {
    slug: "malware",
    title: "Malware",
    headline: "EVERY SAMPLE TELLS A STORY.",
    blurb: "Malware analysis, loaders, tradecraft and the people who take them apart.",
    color: "#e0705f",
  },
  {
    slug: "osint",
    title: "OSINT",
    headline: "THE PUBLIC RECORD KNOWS.",
    blurb: "Investigation, attribution and reading the public record.",
    color: "#e0a75f",
  },
  {
    slug: "ctf",
    title: "CTF",
    headline: "WE READ THE SOURCE.",
    blurb: "Challenges, writeups, techniques and lessons from the field.",
    color: "#8fd96a",
  },
  {
    slug: "zero-trust",
    title: "Zero Trust",
    headline: "NEVER TRUST. ALWAYS VERIFY.",
    blurb: "Architecture, identity and the end of the implicit internal network.",
    color: "#4fd1b0",
  },
];

export function topicBySlug(slug: string) {
  return TOPICS.find((t) => t.slug === slug);
}