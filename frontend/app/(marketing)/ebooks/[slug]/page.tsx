import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';

async function getEbook(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const response = await fetch(`${baseUrl}/api/ebooks/${slug}/`);
  if (response.status === 404) {
    notFound();
  }
  if (!response.ok) {
    throw new Error('Failed to load ebook');
  }
  return response.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const ebook = await getEbook(params.slug);
  return {
    title: `${ebook.title} | Acme Growth Agency`,
    description: ebook.summary,
    openGraph: {
      title: ebook.title,
      description: ebook.summary,
      type: 'article'
    }
  };
}

export default async function EbookDetail({ params }: { params: { slug: string } }) {
  const ebook = await getEbook(params.slug);
  return (
    <main className="bg-slate-900 pb-20 text-white">
      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-20 md:grid-cols-[1.3fr,1fr]">
        <div>
          <p className="text-sm uppercase tracking-wide text-primary-200">Resource</p>
          <h1 className="mt-2 text-4xl font-bold">{ebook.title}</h1>
          <p className="mt-6 text-lg text-slate-200">{ebook.summary}</p>
          <a
            href={ebook.file}
            className="mt-8 inline-flex rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-400"
          >
            Download eBook
          </a>
        </div>
        <div className="relative h-72 w-full overflow-hidden rounded-3xl bg-primary-500">
          <Image
            src="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80"
            alt="Ebook cover"
            fill
            className="object-cover opacity-80"
          />
        </div>
      </section>
    </main>
  );
}
