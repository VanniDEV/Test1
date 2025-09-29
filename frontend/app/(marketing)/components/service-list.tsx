import Link from 'next/link';
import clsx from 'clsx';

type Service = {
  name: string;
  slug: string;
  description: string;
};

type Props = {
  services: Service[];
  className?: string;
};

export function ServiceList({ services, className }: Props) {
  return (
    <div className={clsx('space-y-8', className)}>
      <div className="grid gap-8 md:grid-cols-2">
        {services.map((service) => (
          <article key={service.slug} className="rounded-2xl border border-slate-100 bg-slate-50 p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">{service.name}</h3>
            <p className="mt-3 text-base text-slate-600">{service.description}</p>
            <Link href={`/services/${service.slug}`} className="mt-6 inline-flex text-sm font-semibold text-primary-600">
              Explore service →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
