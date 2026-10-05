export default function Footer() {
  return (
    <footer className="border-t border-ln">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6">
        <span className="mo">© {new Date().getFullYear()} Signal</span>
        <span className="mo">Research · Trends · Tools · Projects</span>
      </div>
    </footer>
  );
}