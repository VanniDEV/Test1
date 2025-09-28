import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/ebooks', label: 'eBooks' },
  { href: '/blog', label: 'Blog' }
];

export function Navigation() {
  return (
    <header className="bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          Acme Growth
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary-600">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
