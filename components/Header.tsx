import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-6">
      <Link href="/">SIGNAL</Link>
      <nav className="flex gap-6">
        <Link href="/trends">Trends, Tools, Papers, and Projects</Link>
        {/* add Tools, Papers, Projects yourself */}
      </nav>
    </header>
  );
}