import { Metadata } from 'next';

import { ServiceList } from '../components/service-list';

async function getServices() {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const response = await fetch(`${baseUrl}/api/services/`, { next: { revalidate: 600 } });
  if (!response.ok) {
    throw new Error('Failed to load services');
  }
  return response.json();
}

export const metadata: Metadata = {
  title: 'Services | Acme Growth Agency',
  description: 'Full-funnel services for revenue-focused SaaS teams.'
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <main className="bg-white pb-20">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-4xl font-bold text-slate-900">Revenue acceleration services</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Build a modern demand engine with integrated lifecycle orchestration, analytics, and customer marketing.
        </p>
        <ServiceList services={services} className="mt-12" />
      </section>
    </main>
  );
}
