import { Metadata } from 'next';

import { EbookGrid } from '../components/ebook-grid';
import { EbookDownloadForm } from '../components/ebook-download-form';

async function getEbooks() {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const response = await fetch(`${baseUrl}/api/ebooks/`, { next: { revalidate: 600 } });
  if (!response.ok) {
    throw new Error('Failed to load ebooks');
  }
  return response.json();
}

export const metadata: Metadata = {
  title: 'eBooks & Playbooks | Acme Growth Agency',
  description: 'Download actionable resources covering PLG, ABM, and revenue operations.'
};

export default async function EbooksPage() {
  const ebooks = await getEbooks();
  const primarySlug = ebooks[0]?.slug ?? 'demand-playbook';
  return (
    <main className="bg-slate-900 pb-20 text-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-4xl font-bold">Resource library</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Browse our best-performing eBooks and frameworks to level up your go-to-market engine.
        </p>
      </div>
      <EbookGrid ebooks={ebooks} />
      <div className="mx-auto mt-12 max-w-xl px-6">
        <EbookDownloadForm ebookSlug={primarySlug} />
      </div>
    </main>
  );
}
