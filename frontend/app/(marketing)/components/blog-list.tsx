import Link from 'next/link';

type Post = {
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
};

type Props = {
  posts: Post[];
};

export function BlogList({ posts }: Props) {
  return (
    <div className="grid gap-10 md:grid-cols-3">
      {posts.map((post) => (
        <article key={post.slug} className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
            {new Date(post.published_at).toLocaleDateString()}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{post.title}</h3>
          <p className="mt-3 flex-1 text-sm text-slate-600">{post.excerpt}</p>
          <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex text-sm font-semibold text-primary-600">
            Read article →
          </Link>
        </article>
      ))}
    </div>
  );
}
