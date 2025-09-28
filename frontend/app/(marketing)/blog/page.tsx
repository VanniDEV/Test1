import { Metadata } from 'next';

import { BlogList } from '../components/blog-list';

async function getBlogPosts() {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const response = await fetch(`${baseUrl}/api/blog-posts/`, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error('Failed to load blog posts');
  }
  return response.json();
}

export const metadata: Metadata = {
  title: 'Blog | Acme Growth Agency',
  description: 'Stay ahead with go-to-market strategies and RAG-enabled marketing workflows.'
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return (
    <main className="bg-white pb-20">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-4xl font-bold text-slate-900">Insights & RAG field notes</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Weekly updates on marketing science, product-led growth, and AI-enhanced content operations.
        </p>
        <div className="mt-12">
          <BlogList posts={posts} />
        </div>
      </section>
    </main>
  );
}
