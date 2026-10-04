"use client";

export default function SearchBox() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("open-search"))}
      aria-label="Search"
      className="transition-colors hover:text-ac"
    >
      ⌕ /
    </button>
  );
}