import Link from 'next/link';

type Props = {
  title: string;
  subtitle?: string;
  ctaLabel?: string | null;
  ctaHref?: string | null;
};

export function Hero({ title, subtitle, ctaLabel, ctaHref }: Props) {
  const hasCta = Boolean(ctaLabel && ctaHref);
  return (
    <section className="relative isolate overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.08),_rgba(255,255,255,0))]" />
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">{title}</h1>
          {subtitle ? (
            <p className="mt-6 text-lg leading-8 text-slate-600">{subtitle}</p>
          ) : null}
          {hasCta ? (
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href={ctaHref as string}
                className="rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-500"
              >
                {ctaLabel}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
