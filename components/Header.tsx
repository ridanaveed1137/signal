import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import AdminLink from "@/components/AdminLink";
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
    // positioning (sticky / hide on scroll) is handled by <HideOnScroll> in layout.tsx
    <header className="border-b border-ln bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:gap-5 sm:px-5">
        <Link
          href="/"
          className="font-display shrink-0 text-2xl tracking-[0.02em] sm:text-3xl"
        >
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

        <div className="mo ml-auto flex min-w-0 items-center gap-2 whitespace-nowrap sm:gap-4">
          <SearchBox />
          {/* only visible to a signed-in admin; hidden on phones to save space */}
          <span className="hidden md:inline-flex">
            <AdminLink className="rounded-full border border-paper/40 px-3 py-1 transition-colors hover:border-paper hover:bg-paper hover:text-ink" />
          </span>
          <AuthButton />
          {/* never let the menu button get pushed off screen */}
          <span className="shrink-0">
            <MobileMenu links={links} />
          </span>
        </div>
      </div>

      <Ticker />
    </header>
  );
}