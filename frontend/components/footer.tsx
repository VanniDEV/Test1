export function Footer() {
  return (
    <footer className="bg-slate-900 py-10 text-sm text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Acme Growth Agency. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="/privacy" className="hover:text-white">
            Privacy
          </a>
          <a href="/security" className="hover:text-white">
            Security
          </a>
        </div>
      </div>
    </footer>
  );
}
