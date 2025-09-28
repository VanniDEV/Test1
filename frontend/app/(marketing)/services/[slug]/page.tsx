import { Metadata } from 'next';
import { notFound } from 'next/navigation';

async function getService(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const response = await fetch(`${baseUrl}/api/services/${slug}/`);
  if (response.status === 404) {
    notFound();
  }
  if (!response.ok) {
    throw new Error('Failed to load service');
  }
  return response.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await getService(params.slug);
  return {
    title: `${service.name} | Acme Growth Agency`,
    description: service.description
  };
}

export default async function ServiceDetail({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug);
  return (
    <main className="bg-white pb-20">
      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-sm uppercase tracking-wide text-primary-600">Service</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">{service.name}</h1>
        <p className="mt-6 text-lg text-slate-600">{service.description}</p>
        {service.long_description ? (
          <article className="mt-10 space-y-4 text-base leading-7 text-slate-700"
            dangerouslySetInnerHTML={{ __html: service.long_description }}
          />
        ) : null}
      </section>
    </main>
  );
}
