import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getBlogPost } from '@/lib/cms';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  if (!post) {
    notFound();
  }
  return {
    title: `${post.title} | Acme Growth Agency`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article'
    }
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  if (!post) {
    notFound();
  }
  return (
    <main className="bg-white pb-20">
      <article className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-sm uppercase tracking-wide text-primary-600">Blog</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">{post.title}</h1>
        <p className="mt-4 text-sm text-slate-500">{new Date(post.published_at).toLocaleDateString()}</p>
        <div className="mt-8 space-y-6 text-base leading-7 text-slate-700" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </main>
  );
}
