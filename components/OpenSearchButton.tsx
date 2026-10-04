"use client";

export default function OpenSearchButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("open-search"))}
      className="btn btn-p"
    >
      {children}
    </button>
  );
}