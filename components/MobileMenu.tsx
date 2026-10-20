"use client";
import { useState } from "react";
import Link from "next/link";

export default function MobileMenu({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="mo flex h-9 w-9 items-center justify-center border border-ln"
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <nav className="fixed inset-x-0 top-14 z-40 border-b border-ln bg-bg">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="mo block border-t border-ln px-5 py-4 text-sm hover:text-ac"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}