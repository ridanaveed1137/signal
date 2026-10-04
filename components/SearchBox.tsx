"use client";

export default function SearchBox() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("open-search"))}
      className="flex items-center gap-2 border border-neutral-800 px-3 py-1.5 text-xs text-neutral-500 transition-colors hover:border-emerald-400 hover:text-neutral-300"
    >
      Search <kbd className="text-neutral-600">Ctrl K</kbd>
    </button>
  );
}