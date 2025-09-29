import { Metadata } from 'next';

import { BlogList } from './components/blog-list';
import { EbookGrid } from './components/ebook-grid';
import { Hero } from './components/hero';
import { LeadCaptureForm } from './components/lead-capture-form';
import { RagPublisher } from './components/rag-publisher';
import { ServiceList } from './components/service-list';
import { getHomeContent } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Acme Growth Agency | Revenue Marketing for SaaS',
  description: 'Launch a performant marketing platform with connected CRM and AI-assisted publishing.',
  alternates: {
    canonical: 'https://example.com/'
  }
};

export default async function HomePage() {
  const { page, services, ebooks, posts } = await getHomeContent();
  const hero = page.hero ?? {
    title: 'Growth marketing meets AI-driven operations',
    subtitle: 'Deploy a branded Next.js front-end with a Django CMS, integrated Zoho CRM, and Retrieval-Augmented Generation for rapid publishing.'
  };

  return (
    <main className="space-y-20 pb-20">
      <Hero title={hero.title} subtitle={hero.subtitle} ctaLabel={hero.cta_label} ctaHref={hero.cta_url} />
      <section className="mx-auto -mt-24 max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[2fr,1fr]">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Services designed for ARR growth</h2>
            <p className="mt-4 text-base text-slate-600">
              Multi-channel acquisition, lifecycle nurture, and RevOps activation aligned to B2B SaaS revenue goals.
            </p>
            <ServiceList services={services} className="mt-8" />
          </div>
          <div className="flex flex-col gap-8">
            <LeadCaptureForm endpoint={`/api/forms/contact/`} />
            <RagPublisher />
          </div>
        </div>
      </section>
      <EbookGrid ebooks={ebooks} />
      <section className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold text-slate-900">Latest field notes</h2>
        <p className="mt-3 text-base text-slate-600">
          Stay current on GTM experiments, AI-assisted operations, and Zoho CRM automation for European teams.
        </p>
        <div className="mt-10">
          <BlogList posts={posts} />
        </div>
      </section>
    </main>
  );
}
