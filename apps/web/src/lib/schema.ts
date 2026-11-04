// Разметка Schema.org (JSON-LD) для поисковиков и AI-ассистентов.
import type { Case, Faq, Global, N8nService, Service } from './types';

const site = (import.meta.env.SITE_URL ?? 'https://bredih.in').replace(/\/$/, '');
export const abs = (path: string) => `${site}${path}`;

export const ids = {
  person: abs('/#person'),
  business: abs('/#business'),
  website: abs('/#website'),
};

const sameAs = (g: Global) => [g.telegram, ...(g.socials ?? []).map((s) => s.url)].filter((v, i, a) => v && a.indexOf(v) === i);

export function siteGraph(g: Global) {
  return [
    {
      '@type': 'WebSite', '@id': ids.website, url: abs('/'), name: g.siteName, inLanguage: 'ru-RU',
      publisher: { '@id': ids.person },
    },
    {
      '@type': 'Person', '@id': ids.person, name: g.siteName, url: abs('/about/'),
      jobTitle: 'Разработчик, специалист по автоматизации бизнес-процессов',
      knowsAbout: ['Автоматизация бизнес-процессов', 'Разработка сайтов', 'Telegram-боты', 'Разработка приложений', 'Интеграция CRM'],
      knowsLanguage: 'ru', email: g.email ? `mailto:${g.email}` : undefined, sameAs: sameAs(g),
    },
    {
      '@type': 'ProfessionalService', '@id': ids.business, name: g.siteName, url: abs('/'),
      description: g.seo.metaDescription, founder: { '@id': ids.person },
      areaServed: { '@type': 'Country', name: 'Россия' }, availableLanguage: 'ru',
      email: g.email, telephone: g.phone, sameAs: sameAs(g),
      contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', url: g.telegram, email: g.email, availableLanguage: 'ru' },
    },
  ];
}

export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Главная', path: '/' }, ...items].map((it, i) => ({
    '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path),
  })),
});

export const faqPage = (faq: Faq[]) => ({
  '@type': 'FAQPage',
  mainEntity: faq.map((q) => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } })),
});

/** «от 30 000 ₽» → 30000 */
const priceNumber = (s?: string) => { const n = s?.replace(/[^\d]/g, ''); return n ? Number(n) : undefined; };

export function serviceSchema(s: Service) {
  const price = priceNumber(s.priceFrom);
  return {
    '@type': 'Service', '@id': abs(`/services/${s.slug}/#service`), name: s.title, url: abs(`/services/${s.slug}/`),
    description: s.description ?? s.short, serviceType: s.title, provider: { '@id': ids.business },
    areaServed: { '@type': 'Country', name: 'Россия' },
    hasOfferCatalog: s.features?.length ? {
      '@type': 'OfferCatalog', name: `Что входит: ${s.title}`,
      itemListElement: s.features.map((f) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: f.title } })),
    } : undefined,
    offers: price ? {
      '@type': 'Offer', priceCurrency: 'RUB', url: abs(`/services/${s.slug}/`),
      priceSpecification: { '@type': 'PriceSpecification', minPrice: price, priceCurrency: 'RUB' },
    } : undefined,
  };
}

export function caseSchema(c: Case, image?: string) {
  return {
    '@type': 'CreativeWork', '@id': abs(`/cases/${c.slug}/#case`), name: c.title, url: abs(`/cases/${c.slug}/`),
    headline: c.title, abstract: c.summary, inLanguage: 'ru-RU', image,
    text: [c.task, c.solution, c.result].filter(Boolean).join(' '),
    author: { '@id': ids.person }, keywords: c.stack?.join(', '),
    about: c.services?.map((s) => ({ '@type': 'Service', name: s.title, url: abs(`/services/${s.slug}/`) })),
  };
}

export function n8nServiceSchema(s: N8nService, path: string) {
  return {
    '@type': 'Service', '@id': abs(`${path}#service`), name: s.title, url: abs(path),
    description: s.description ?? s.short, serviceType: 'Автоматизация бизнес-процессов на n8n',
    provider: { '@id': ids.business }, areaServed: { '@type': 'Country', name: 'Россия' },
    offers: s.price != null ? {
      '@type': 'Offer', priceCurrency: 'RUB', url: abs(path),
      priceSpecification: { '@type': 'PriceSpecification', minPrice: s.price, priceCurrency: 'RUB' },
    } : undefined,
  };
}
