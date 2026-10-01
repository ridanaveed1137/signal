import Link from "next/link";
import AuthButton from "@/components/AuthButton";

export default function Header() {
  const linkClass =
    "text-sm uppercase tracking-widest text-neutral-400 transition-colors hover:text-emerald-400";

  return (
    <header className="flex items-center justify-between p-6">
      <Link href="/" className="font-bold tracking-widest">
        SIGNAL
      </Link>
      <nav className="flex items-center gap-6">
        <Link href="/trends" className={linkClass}>Trends</Link>
        <Link href="/tools" className={linkClass}>Tools</Link>
        <Link href="/papers" className={linkClass}>Papers</Link>
        <Link href="/projects" className={linkClass}>Projects</Link>
        <AuthButton />
      </nav>
    </header>
  );
}