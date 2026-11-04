export interface Media { url: string; alternativeText?: string | null; width?: number; height?: number }
export interface Seo { metaTitle?: string; metaDescription?: string; shareImage?: Media | null }
export interface Item { title: string; text?: string }
export interface Faq { question: string; answer: string }
export interface Metric { value: string; label: string }

export interface Service {
  title: string; slug: string; icon?: string; short: string; description?: string;
  features?: Item[]; steps?: Item[]; priceFrom?: string; duration?: string;
  faq?: Faq[]; cases?: Case[]; seo?: Seo;
}
export interface Case {
  title: string; slug: string; client?: string; summary: string;
  task?: string; solution?: string; result?: string; metrics?: Metric[];
  stack?: string[]; cover?: Media | null; link?: string; featured?: boolean;
  services?: Pick<Service, 'title' | 'slug'>[]; seo?: Seo;
}
export interface Testimonial { author: string; role?: string; text: string; photo?: Media | null }
export interface Global {
  siteName: string; tagline: string; email: string; phone?: string; telegram: string;
  socials?: { label: string; url: string }[]; seo: Seo;
}
export interface Home {
  heroTitle: string; heroText: string; heroCta: string;
  steps: Item[]; technologies: string[];
}
export interface About { title: string; text: string; photo?: Media | null; facts: Metric[] }
