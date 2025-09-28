import Link from 'next/link';

type Ebook = {
  title: string;
  slug: string;
  summary: string;
};

type Props = {
  ebooks: Ebook[];
};

export function EbookGrid({ ebooks }: Props) {
  return (
    <section className="bg-slate-900 py-20 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-semibold">Research library</h2>
          <p className="mt-4 text-base text-slate-300">
            Access our latest playbooks covering product-led growth, ABM, and integrated RevOps programs.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {ebooks.map((ebook) => (
            <article key={ebook.slug} className="rounded-2xl bg-slate-800 p-6 shadow-lg">
              <h3 className="text-xl font-semibold">{ebook.title}</h3>
              <p className="mt-3 text-sm text-slate-300">{ebook.summary}</p>
              <Link href={`/ebooks/${ebook.slug}`} className="mt-6 inline-flex text-sm font-semibold text-primary-200">
                Download guide →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
