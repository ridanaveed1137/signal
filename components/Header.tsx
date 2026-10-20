import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import SearchBox from "@/components/SearchBox";
import Ticker from "@/components/Ticker";
import MobileMenu from "@/components/MobileMenu";

const links = [
  { href: "/trends", label: "Trends" },
  { href: "/tools", label: "Tools" },
  { href: "/ports", label: "Ports" },
  { href: "/projects", label: "Projects" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ln bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-5 sm:gap-5">
        <Link href="/" className="font-display text-3xl tracking-[0.02em]">
          SIGNAL
        </Link>

        <span className="hidden sm:inline">
          <span className="live mo text-ac">Live</span>
        </span>

        <nav className="mo ml-4 hidden gap-5 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap transition-colors hover:text-ac"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mo ml-auto flex items-center gap-3 whitespace-nowrap sm:gap-4">
          <SearchBox />
          <AuthButton />
          <MobileMenu links={links} />
        </div>
      </div>

      <Ticker />
    </header>
  );
}