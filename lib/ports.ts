export type Port = {
  number: number;
  name: string;
  protocol: "TCP" | "UDP" | "TCP/UDP";
  note: string;
};

export const PORTS: Port[] = [
  { number: 20, name: "FTP (data)", protocol: "TCP", note: "File transfer data channel. Plaintext — avoid on untrusted networks." },
  { number: 21, name: "FTP (control)", protocol: "TCP", note: "File transfer commands. Credentials sent in plaintext by default." },
  { number: 22, name: "SSH", protocol: "TCP", note: "Encrypted remote shell. Disable password auth, use keys." },
  { number: 23, name: "Telnet", protocol: "TCP", note: "Unencrypted remote shell. Should not be exposed, ever." },
  { number: 25, name: "SMTP", protocol: "TCP", note: "Mail transfer between servers. Often a spam/relay target." },
  { number: 53, name: "DNS", protocol: "TCP/UDP", note: "Name resolution. Watch for tunneling and exfiltration over this port." },
  { number: 67, name: "DHCP (server)", protocol: "UDP", note: "Assigns IP addresses on a local network." },
  { number: 80, name: "HTTP", protocol: "TCP", note: "Unencrypted web traffic. Should redirect to 443 in production." },
  { number: 110, name: "POP3", protocol: "TCP", note: "Mail retrieval. Largely legacy; prefer IMAP over TLS." },
  { number: 123, name: "NTP", protocol: "UDP", note: "Time sync. Can be abused for DDoS amplification." },
  { number: 143, name: "IMAP", protocol: "TCP", note: "Mail retrieval, syncs across devices." },
  { number: 161, name: "SNMP", protocol: "UDP", note: "Network device monitoring. Default community strings are a classic weakness." },
  { number: 389, name: "LDAP", protocol: "TCP", note: "Directory services. Use LDAPS (636) in production." },
  { number: 443, name: "HTTPS", protocol: "TCP", note: "Encrypted web traffic. The baseline expectation today." },
  { number: 445, name: "SMB", protocol: "TCP", note: "Windows file sharing. Frequent target for worms and lateral movement." },
  { number: 465, name: "SMTPS", protocol: "TCP", note: "Encrypted SMTP submission." },
  { number: 587, name: "SMTP (submission)", protocol: "TCP", note: "Authenticated mail submission, usually with STARTTLS." },
  { number: 636, name: "LDAPS", protocol: "TCP", note: "Encrypted directory services." },
  { number: 993, name: "IMAPS", protocol: "TCP", note: "Encrypted mail retrieval." },
  { number: 995, name: "POP3S", protocol: "TCP", note: "Encrypted mail retrieval, legacy." },
  { number: 1433, name: "MS SQL Server", protocol: "TCP", note: "Should never be internet-facing without strict controls." },
  { number: 1521, name: "Oracle DB", protocol: "TCP", note: "Default listener port for Oracle databases." },
  { number: 2375, name: "Docker (unencrypted)", protocol: "TCP", note: "Unauthenticated Docker API if exposed — full host compromise risk." },
  { number: 2376, name: "Docker (TLS)", protocol: "TCP", note: "Encrypted Docker remote API." },
  { number: 3306, name: "MySQL", protocol: "TCP", note: "Should not be exposed directly to the internet." },
  { number: 3389, name: "RDP", protocol: "TCP", note: "Windows remote desktop. A top ransomware entry point when exposed." },
  { number: 5432, name: "PostgreSQL", protocol: "TCP", note: "Database access. Restrict by firewall/VPC, not just auth." },
  { number: 5900, name: "VNC", protocol: "TCP", note: "Remote desktop, often weakly authenticated." },
  { number: 6379, name: "Redis", protocol: "TCP", note: "Frequently left open with no auth — a very common misconfiguration." },
  { number: 8080, name: "HTTP (alt)", protocol: "TCP", note: "Common alternate web/proxy port, often used for admin panels." },
  { number: 9200, name: "Elasticsearch", protocol: "TCP", note: "Exposed instances are routinely scraped by scanners." },
  { number: 27017, name: "MongoDB", protocol: "TCP", note: "Default port. Historically exposed with no authentication by default." },
];