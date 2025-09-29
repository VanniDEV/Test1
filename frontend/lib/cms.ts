import 'server-only';

import { getBackendBaseUrl, hasBackendIntegration as runtimeHasBackendIntegration, isMockMode } from './runtime-config';

type Hero = {
  title: string;
  subtitle: string;
  cta_label?: string;
  cta_url?: string;
};

type MarketingPage = {
  hero: Hero;
};

type Service = {
  name: string;
  slug: string;
  description: string;
  long_description?: string;
};

type Ebook = {
  title: string;
  slug: string;
  summary: string;
  content?: string;
  file?: string;
};

type BlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published_at: string;
};

type HomePayload = {
  page: MarketingPage;
  services: Service[];
  ebooks: Ebook[];
  posts: BlogPost[];
};

type FetchOptions = RequestInit & { next?: { revalidate?: number } };

export const FALLBACK_HOME: HomePayload = {
  page: {
    hero: {
      title: 'Launch revenue marketing faster',
      subtitle:
        'Connect a production-ready Django CMS with a branded Next.js frontend to capture demand, sync Zoho CRM (EU), and publish AI-assisted updates in minutes.',
      cta_label: 'Explore services',
      cta_url: '/services'
    }
  },
  services: [
    {
      name: 'RevOps activation',
      slug: 'revops-activation',
      description: 'Stand up dashboards, lifecycle stages, and attribution to unlock ARR insights from day one.',
      long_description:
        'Our RevOps specialists wire up product analytics, CRM, and marketing automation so your revenue teams operate from a single source of truth.'
    },
    {
      name: 'Lifecycle automation',
      slug: 'lifecycle-automation',
      description: 'Automate onboarding, nurture, and expansion motions with GDPR-ready consent capture.',
      long_description:
        'Design multi-channel nurtures, in-app guides, and success triggers that respect EU data residency while accelerating net revenue retention.'
    },
    {
      name: 'Demand experimentation',
      slug: 'demand-experimentation',
      description: 'Spin up coordinated paid, content, and partner experiments with weekly reporting loops.',
      long_description:
        'Rapidly test paid and organic plays with clear MQL→SQL attribution, blending RAG-generated assets with human QA for compliant launch.'
    }
  ],
  ebooks: [
    {
      title: 'Demand playbook for PLG SaaS',
      slug: 'demand-playbook',
      summary: 'Channel mix, scoring models, and automation templates to operationalise product-led growth.',
      content:
        '<p>Learn how to combine usage telemetry with marketing automation to trigger the right next best action for your PLG motion.</p>',
      file: 'https://example.com/ebooks/demand-playbook.pdf'
    },
    {
      title: 'EU RevOps compliance checklist',
      slug: 'eu-revops-compliance',
      summary: 'Keep your revenue stack aligned with GDPR, Zoho CRM EU policies, and marketing consent best practices.',
      content:
        '<p>Audit your integrations, consent flows, and retention settings to ensure your GTM operations meet EU standards.</p>',
      file: 'https://example.com/ebooks/eu-revops-compliance.pdf'
    }
  ],
  posts: [
    {
      title: 'How we ship ISR landing pages in under an hour',
      slug: 'ship-isr-landing-pages',
      excerpt: 'A repeatable workflow for drafting content with RAG, reviewing in Django admin, and pushing live via Vercel revalidation.',
      content:
        '<p>By combining Retrieval Augmented Generation with editor workflows we reduced launch time for new experiments by 78%.</p>',
      published_at: '2024-03-18T09:00:00+00:00'
    },
    {
      title: 'Connecting Zoho CRM EU to a modern data stack',
      slug: 'zoho-crm-eu-modern-data-stack',
      excerpt: 'Map consents, UTMs, and lifecycle events from your marketing site directly into Zoho CRM EU securely.',
      content:
        '<p>We cover OAuth setup, refresh token hygiene, and how to pass granular consent flags for compliant marketing automation.</p>',
      published_at: '2024-02-05T09:00:00+00:00'
    }
  ]
};

const FALLBACK_SERVICE_MAP = new Map(FALLBACK_HOME.services.map((service) => [service.slug, service]));
const FALLBACK_EBOOK_MAP = new Map(FALLBACK_HOME.ebooks.map((ebook) => [ebook.slug, ebook]));
const FALLBACK_POST_MAP = new Map(FALLBACK_HOME.posts.map((post) => [post.slug, post]));

async function fetchFromBackend<T>(path: string, options?: FetchOptions): Promise<T | null> {
  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, options);
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getHomeContent(): Promise<HomePayload> {
  const [page, services, ebooks, posts] = await Promise.all([
    fetchFromBackend<MarketingPage>('/api/pages/home/', { next: { revalidate: 300 } }),
    fetchFromBackend<Service[]>('/api/services/', { next: { revalidate: 300 } }),
    fetchFromBackend<Ebook[]>('/api/ebooks/', { next: { revalidate: 300 } }),
    fetchFromBackend<BlogPost[]>('/api/blog-posts/', { next: { revalidate: 300 } })
  ]);

  return {
    page: page ?? FALLBACK_HOME.page,
    services: services && services.length > 0 ? services : FALLBACK_HOME.services,
    ebooks: ebooks && ebooks.length > 0 ? ebooks : FALLBACK_HOME.ebooks,
    posts: posts && posts.length > 0 ? posts : FALLBACK_HOME.posts
  };
}

export async function getServicesList(): Promise<Service[]> {
  const services = await fetchFromBackend<Service[]>('/api/services/', { next: { revalidate: 600 } });
  return services && services.length > 0 ? services : FALLBACK_HOME.services;
}

export async function getServiceDetail(slug: string): Promise<Service | null> {
  const service = await fetchFromBackend<Service>(`/api/services/${slug}/`);
  if (service) {
    return service;
  }
  return FALLBACK_SERVICE_MAP.get(slug) ?? null;
}

export async function getEbooksList(): Promise<Ebook[]> {
  const ebooks = await fetchFromBackend<Ebook[]>('/api/ebooks/', { next: { revalidate: 600 } });
  return ebooks && ebooks.length > 0 ? ebooks : FALLBACK_HOME.ebooks;
}

export async function getEbookDetail(slug: string): Promise<Ebook | null> {
  const ebook = await fetchFromBackend<Ebook>(`/api/ebooks/${slug}/`);
  if (ebook) {
    return ebook;
  }
  return FALLBACK_EBOOK_MAP.get(slug) ?? null;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await fetchFromBackend<BlogPost[]>('/api/blog-posts/', { next: { revalidate: 300 } });
  return posts && posts.length > 0 ? posts : FALLBACK_HOME.posts;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const post = await fetchFromBackend<BlogPost>(`/api/blog-posts/${slug}/`);
  if (post) {
    return post;
  }
  return FALLBACK_POST_MAP.get(slug) ?? null;
}

export const hasBackendIntegration = runtimeHasBackendIntegration;

export { isMockMode };
