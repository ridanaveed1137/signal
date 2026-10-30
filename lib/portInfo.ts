// Descriptions + search tags for every port on the Ports page.
// Keyed by port number. `tags` feed the search; `desc` feeds the description box.

export type PortInfo = { desc: string; tags: string[] };

export const PORT_INFO: Record<number, PortInfo> = {
  20: {
    desc: "FTP data channel. In active mode the server opens this port to push file contents to the client. FTP sends everything, including file data, unencrypted, so prefer SFTP or FTPS.",
    tags: ["ftp", "file transfer", "legacy", "plaintext", "files"],
  },
  21: {
    desc: "FTP control channel, where logins and commands travel. Credentials cross the network in plaintext and anonymous or weak logins are commonly abused. Replace it with SFTP or FTPS where possible.",
    tags: ["ftp", "file transfer", "login", "plaintext", "legacy", "files"],
  },
  22: {
    desc: "SSH, the standard encrypted way to get a remote shell, copy files (SCP/SFTP) and tunnel traffic. Safe by design but a constant brute-force target, so use keys, disable root login and rate-limit attempts.",
    tags: ["ssh", "secure shell", "remote access", "encrypted", "sftp", "scp", "terminal"],
  },
  23: {
    desc: "Telnet gives a remote command line with no encryption, so passwords and commands are readable by anyone on the path. It should be disabled everywhere and replaced with SSH.",
    tags: ["telnet", "remote access", "shell", "plaintext", "legacy", "terminal"],
  },
  25: {
    desc: "SMTP, used by mail servers to relay email between each other. Open relays get abused for spam and phishing, so restrict it to your mail infrastructure and require authentication.",
    tags: ["smtp", "email", "mail", "relay", "spam"],
  },
  53: {
    desc: "DNS, which turns domain names into IP addresses. It uses UDP for normal lookups and TCP for large replies and zone transfers. Misconfigured servers enable amplification attacks and zone leaks.",
    tags: ["dns", "domain", "names", "lookup", "resolver", "amplification"],
  },
  67: {
    desc: "DHCP server port, which hands out IP addresses and network settings to devices on a local network. It should only be reachable on the internal network, where rogue DHCP servers are a known attack.",
    tags: ["dhcp", "ip address", "network", "lan", "bootp"],
  },
  80: {
    desc: "HTTP, the standard web port. Traffic is unencrypted, so most sites use it only to redirect visitors to HTTPS on port 443.",
    tags: ["http", "web", "website", "plaintext", "browser"],
  },
  110: {
    desc: "POP3, an older protocol for downloading email from a server. Logins and messages are sent in plaintext unless wrapped in TLS, so use POP3S on 995 instead.",
    tags: ["pop3", "email", "mail", "plaintext", "legacy"],
  },
  123: {
    desc: "NTP, which keeps clocks synchronised. Accurate time matters for logs, certificates and authentication. Exposed servers can be used in reflection and amplification DDoS attacks.",
    tags: ["ntp", "time", "clock", "sync", "amplification"],
  },
  143: {
    desc: "IMAP, which lets mail clients read and manage email that stays on the server. By default it is unencrypted, so use STARTTLS or move to IMAPS on 993.",
    tags: ["imap", "email", "mail", "plaintext"],
  },
  161: {
    desc: "SNMP, used to monitor and manage network devices. Versions 1 and 2c rely on community strings like 'public' that act as passwords and are often left at defaults. Use SNMPv3 and restrict access.",
    tags: ["snmp", "monitoring", "network", "devices", "community string", "legacy"],
  },
  389: {
    desc: "LDAP, the directory protocol behind Active Directory and many login systems. Unencrypted binds expose credentials and it can leak user and group data. Use LDAPS or StartTLS and keep it internal.",
    tags: ["ldap", "directory", "active directory", "authentication", "login", "users"],
  },
  443: {
    desc: "HTTPS, HTTP wrapped in TLS encryption. It carries most of the modern web and APIs, so keep certificates and TLS versions up to date.",
    tags: ["https", "web", "tls", "ssl", "encrypted", "website", "api"],
  },
  445: {
    desc: "SMB, used for Windows file and printer sharing. It has been a major attack path for worms and ransomware, including EternalBlue and WannaCry. Never expose it to the internet.",
    tags: ["smb", "windows", "file sharing", "files", "ransomware", "cifs", "eternalblue"],
  },
  465: {
    desc: "SMTPS, SMTP over implicit TLS. Mail submission and relay are encrypted from the first byte. Many providers now prefer port 587 with STARTTLS.",
    tags: ["smtps", "email", "mail", "tls", "encrypted"],
  },
  587: {
    desc: "Mail submission port, where email clients send outgoing mail to their provider. It normally requires authentication and STARTTLS, which makes it the recommended way to send mail.",
    tags: ["smtp", "submission", "email", "mail", "starttls", "encrypted"],
  },
  636: {
    desc: "LDAPS, LDAP over TLS. Directory queries and logins are encrypted, which protects credentials. Still keep it internal and check certificates.",
    tags: ["ldaps", "ldap", "directory", "active directory", "tls", "encrypted"],
  },
  993: {
    desc: "IMAPS, IMAP over TLS. Email stays on the server and is read over an encrypted connection, so it is the secure choice instead of port 143.",
    tags: ["imaps", "imap", "email", "mail", "tls", "encrypted"],
  },
  995: {
    desc: "POP3S, POP3 over TLS. Downloading mail is encrypted, but POP3 itself is dated and delivers messages without server-side sync. IMAPS is usually the better option.",
    tags: ["pop3s", "pop3", "email", "mail", "tls", "encrypted"],
  },
  1433: {
    desc: "Microsoft SQL Server's default database port. Internet-facing instances face constant brute-force and exploit attempts, so keep it behind a firewall or VPN and use strong credentials.",
    tags: ["mssql", "sql server", "database", "microsoft", "db"],
  },
  1521: {
    desc: "Oracle Database listener, the default endpoint clients use to reach Oracle databases. Restrict it to application servers and keep the listener patched and password-protected.",
    tags: ["oracle", "database", "db", "listener", "tns"],
  },
  2375: {
    desc: "Docker daemon API without encryption or authentication. Anyone who can reach it controls the host, often leading to full compromise and cryptominer infections. Never expose it.",
    tags: ["docker", "container", "api", "unencrypted", "no auth", "remote code", "plaintext"],
  },
  2376: {
    desc: "Docker daemon API secured with TLS and client certificates. It is the safe way to manage Docker remotely, provided certificates are protected and access is limited.",
    tags: ["docker", "container", "api", "tls", "encrypted"],
  },
  3306: {
    desc: "MySQL and MariaDB's default database port. Databases should not be reachable from the internet, since exposed instances attract brute-force attacks and data theft. Bind to localhost or a private network.",
    tags: ["mysql", "mariadb", "database", "db", "sql"],
  },
  3389: {
    desc: "Remote Desktop Protocol, which gives a full graphical Windows session. Exposed RDP is a leading ransomware entry point through weak passwords and flaws like BlueKeep. Put it behind a VPN with MFA.",
    tags: ["rdp", "remote desktop", "windows", "remote access", "ransomware", "bluekeep"],
  },
  5432: {
    desc: "PostgreSQL's default database port. Like other databases, it should only be reachable from trusted application hosts, with strong passwords and TLS enabled.",
    tags: ["postgres", "postgresql", "database", "db", "sql"],
  },
  5900: {
    desc: "VNC, graphical remote desktop sharing. Authentication is often weak and traffic is not strongly encrypted by default, so tunnel it through SSH or a VPN rather than exposing it.",
    tags: ["vnc", "remote desktop", "remote access", "screen sharing", "weak"],
  },
  6379: {
    desc: "Redis in-memory data store, which ships without authentication by default. Exposed instances can be read, wiped or abused to run code on the host. Bind to localhost and set a password.",
    tags: ["redis", "database", "cache", "db", "nosql", "no auth", "key value"],
  },
  8080: {
    desc: "Common alternate HTTP port used by proxies, dev servers, admin consoles and apps such as Tomcat and Jenkins. It is often forgotten, so audit whatever is running there.",
    tags: ["http", "web", "alternate", "proxy", "tomcat", "jenkins", "dev"],
  },
  9200: {
    desc: "Elasticsearch REST API. Older or default setups have no authentication, which has caused many large data leaks. Enable security features and never expose it publicly.",
    tags: ["elasticsearch", "elastic", "search", "database", "db", "api", "nosql", "no auth"],
  },
  27017: {
    desc: "MongoDB's default database port. Instances with authentication turned off have been wiped and ransomed in mass attacks. Enable auth and bind to private interfaces only.",
    tags: ["mongodb", "mongo", "database", "db", "nosql", "no auth", "ransomware"],
  },
};

// Short explanations shown when a risk counter is selected.
export const RISK_BLURB = {
  high: "High risk ports expose services that attackers actively target and that should rarely, if ever, face the internet, such as unencrypted remote access and databases. Close or firewall them first.",
  medium:
    "Watch list ports run legacy or weakly protected protocols. They are not always dangerous, but they need encryption, strong authentication or restricted access.",
  low: "Low risk ports use protocols that are encrypted or normally meant to be public. Keep the software patched and configured correctly, since low risk is not the same as risk free.",
} as const;

type SearchPort = {
  number: number;
  name: string;
  protocol: string;
  note: string;
  risk: string;
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ");

// Every word typed must match somewhere: port number (prefix), name,
// protocol, risk label, note, or the tags above. Results are ranked.
export function searchPorts<T extends SearchPort>(ports: T[], query: string): T[] {
  const q = norm(query).trim();
  if (!q) return ports;
  const words = q.split(/\s+/).filter(Boolean);

  const scored: { p: T; score: number }[] = [];
  for (const p of ports) {
    const info = PORT_INFO[p.number];
    const name = norm(p.name);
    const tags = norm((info?.tags ?? []).join(" "));
    const rest = norm(`${p.note} ${p.protocol} ${p.risk} ${info?.desc ?? ""}`);
    const num = String(p.number);

    let total = 0;
    let ok = true;
    for (const w of words) {
      let s = 0;
      if (num === w) s = 100;
      else if (num.startsWith(w) && /^\d+$/.test(w)) s = 60;
      else if (name.split(/\s+/).includes(w)) s = 80;
      else if (name.includes(w)) s = 50;
      else if (tags.split(/\s+/).includes(w)) s = 40;
      else if (tags.includes(w)) s = 25;
      else if (rest.includes(w)) s = 10;
      if (s === 0) {
        ok = false;
        break;
      }
      total += s;
    }
    if (ok) scored.push({ p, score: total });
  }
  return scored.sort((a, b) => b.score - a.score || a.p.number - b.p.number).map((x) => x.p);
}