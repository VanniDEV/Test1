import { Metadata } from 'next';

import { ServiceList } from '../components/service-list';
import { getServicesList } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Services | Acme Growth Agency',
  description: 'Full-funnel services for revenue-focused SaaS teams.'
};

export default async function ServicesPage() {
  const services = await getServicesList();
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
