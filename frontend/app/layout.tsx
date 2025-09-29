import '../styles/globals.css';
import type { Metadata } from 'next';
import { GoogleTagManager } from '@/components/google-tag-manager';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { EnvironmentGuard } from '@/components/environment-guard';

export const metadata: Metadata = {
  title: 'Acme Growth Agency',
  description: 'Next.js + Django marketing platform with RAG-powered publishing.',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: 'Acme Growth Agency',
    description: 'Growth marketing for B2B SaaS.',
    url: 'https://example.com',
    siteName: 'Acme Growth Agency',
    locale: 'en_US',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-gradient-to-b from-primary-50 via-white to-white antialiased">
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        <EnvironmentGuard>
          <Navigation />
          <div className="min-h-screen">{children}</div>
          <Footer />
        </EnvironmentGuard>
      </body>
    </html>
  );
}
