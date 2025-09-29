"""Mocked marketing content for development and demos."""
from __future__ import annotations

from typing import Dict, List, Optional

MOCK_PAGE_SECTIONS: Dict[str, List[Dict[str, object]]] = {
    'home': [
        {
            'heading': 'Why teams choose our revenue engine',
            'body': (
                '<p>Launch branded landing pages with ISR, sync GDPR-ready forms to Zoho CRM EU, '
                'and push AI-assisted updates without waiting on engineering sprints.</p>'
            ),
            'order': 1,
        },
        {
            'heading': 'What is included',
            'body': (
                '<ul><li>Next.js marketing site on Vercel</li>'
                '<li>Django CMS + Admin UI on Cloud Run</li>'
                '<li>Zoho CRM EU integration with consent capture</li>'
                '<li>RAG-assisted publishing workflow</li></ul>'
            ),
            'order': 2,
        },
    ],
}

MOCK_PAGES: Dict[str, Dict[str, object]] = {
    'home': {
        'slug': 'home',
        'hero': {
            'title': 'Launch revenue marketing faster',
            'subtitle': (
                'Connect a production-ready Django CMS with a branded Next.js frontend to capture '
                'demand, sync Zoho CRM (EU), and publish AI-assisted updates in minutes.'
            ),
            'cta_label': 'Explore services',
            'cta_url': '/services',
        },
        'seo_title': 'Revenue marketing platform',
        'seo_description': 'Full-stack marketing system with Zoho CRM EU and RAG publishing.',
        'schema_markup': {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'Revenue Marketing Studio',
            'url': 'https://example.com',
        },
        'sections': MOCK_PAGE_SECTIONS['home'],
    }
}

MOCK_SERVICES: List[Dict[str, object]] = [
    {
        'name': 'RevOps activation',
        'slug': 'revops-activation',
        'description': 'Stand up dashboards, lifecycle stages, and attribution to unlock ARR insights from day one.',
        'long_description': (
            'Our RevOps specialists wire up product analytics, CRM, and marketing automation so your revenue '
            'teams operate from a single source of truth.'
        ),
    },
    {
        'name': 'Lifecycle automation',
        'slug': 'lifecycle-automation',
        'description': 'Automate onboarding, nurture, and expansion motions with GDPR-ready consent capture.',
        'long_description': (
            'Design multi-channel nurtures, in-app guides, and success triggers that respect EU data residency while '
            'accelerating net revenue retention.'
        ),
    },
    {
        'name': 'Demand experimentation',
        'slug': 'demand-experimentation',
        'description': 'Spin up coordinated paid, content, and partner experiments with weekly reporting loops.',
        'long_description': (
            'Rapidly test paid and organic plays with clear MQL→SQL attribution, blending RAG-generated assets with '
            'human QA for compliant launch.'
        ),
    },
]

MOCK_EBOOKS: List[Dict[str, object]] = [
    {
        'title': 'Demand playbook for PLG SaaS',
        'slug': 'demand-playbook',
        'summary': 'Channel mix, scoring models, and automation templates to operationalise product-led growth.',
        'file': 'https://example.com/ebooks/demand-playbook.pdf',
    },
    {
        'title': 'EU RevOps compliance checklist',
        'slug': 'eu-revops-compliance',
        'summary': 'Keep your revenue stack aligned with GDPR, Zoho CRM EU policies, and marketing consent best practices.',
        'file': 'https://example.com/ebooks/eu-revops-compliance.pdf',
    },
]

MOCK_BLOG_POSTS: List[Dict[str, object]] = [
    {
        'title': 'How we ship ISR landing pages in under an hour',
        'slug': 'ship-isr-landing-pages',
        'excerpt': (
            'A repeatable workflow for drafting content with RAG, reviewing in Django admin, and pushing live via Vercel revalidation.'
        ),
        'content': (
            '<p>By combining Retrieval Augmented Generation with editor workflows we reduced launch time for new experiments by 78%.</p>'
        ),
        'published_at': '2024-03-18T09:00:00+00:00',
    },
    {
        'title': 'Connecting Zoho CRM EU to a modern data stack',
        'slug': 'zoho-crm-eu-modern-data-stack',
        'excerpt': 'Map consents, UTMs, and lifecycle events from your marketing site directly into Zoho CRM EU securely.',
        'content': (
            '<p>We cover OAuth setup, refresh token hygiene, and how to pass granular consent flags for compliant marketing automation.</p>'
        ),
        'published_at': '2024-02-05T09:00:00+00:00',
    },
]

MOCK_BLOG_MAP = {post['slug']: post for post in MOCK_BLOG_POSTS}
MOCK_SERVICE_MAP = {service['slug']: service for service in MOCK_SERVICES}
MOCK_EBOOK_MAP = {ebook['slug']: ebook for ebook in MOCK_EBOOKS}




def get_mock_page(slug: str) -> Optional[Dict[str, object]]:
    return MOCK_PAGES.get(slug)


def get_mock_services() -> List[Dict[str, object]]:
    return MOCK_SERVICES


def get_mock_service(slug: str) -> Optional[Dict[str, object]]:
    return MOCK_SERVICE_MAP.get(slug)


def get_mock_ebooks() -> List[Dict[str, object]]:
    return MOCK_EBOOKS


def get_mock_ebook(slug: str) -> Optional[Dict[str, object]]:
    return MOCK_EBOOK_MAP.get(slug)


def get_mock_blog_posts() -> List[Dict[str, object]]:
    return MOCK_BLOG_POSTS


def get_mock_blog_post(slug: str) -> Optional[Dict[str, object]]:
    return MOCK_BLOG_MAP.get(slug)


def get_mock_sections(slug: str) -> List[Dict[str, object]]:
    page = get_mock_page(slug)
    if not page:
        return []
    return list(page.get('sections', []))
