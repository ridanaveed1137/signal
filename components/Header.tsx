import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import SearchBox from "@/components/SearchBox";
import Ticker from "@/components/Ticker";

const links = [
  { href: "/trends", label: "Trends" },
  { href: "/tools", label: "Tools" },
  { href: "/papers", label: "Papers" },
  { href: "/projects", label: "Projects" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ln bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-5 px-5">
        <Link href="/" className="text-xl font-bold tracking-[0.06em]">
          SIGNAL
        </Link>

        <span className="live mo text-ac">Live</span>

        <nav className="mo ml-4 flex gap-5 overflow-x-auto">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
             className="font-serif text-xl font-bold tracking-[0.06em]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mo ml-auto flex items-center gap-4 whitespace-nowrap">
          <SearchBox />
          <AuthButton />
        </div>
      </div>

      <Ticker />
    </header>
  );
}