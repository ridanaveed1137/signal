import Link from "next/link";

const links = [
  { href: "/trends", label: "Trends" },
  { href: "/tools", label: "Tools" },
  { href: "/ports", label: "Ports" },
  { href: "/projects", label: "Projects" },
];

export default function Footer() {
  return (
    <footer className="border-t border-ln">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6">
        <span className="mo">© {new Date().getFullYear()} Signal</span>
        <nav className="mo flex flex-wrap gap-x-3">
          {links.map((l, i) => (
            <span key={l.href}>
              <Link href={l.href} className="hover:text-ac">
                {l.label}
              </Link>
              {i < links.length - 1 && " · "}
            </span>
          ))}
        </nav>
      </div>
    </footer>
  );
}