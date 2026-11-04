// Клиент Strapi 5 (REST). Если CMS недоступна или пуста, отдаёт демо-контент,
// чтобы сайт собирался и в разработке, и до наполнения админки.
import * as fb from './fallback';
import type { About, Case, Global, Home, Service, Testimonial } from './types';

const BASE = (import.meta.env.STRAPI_URL ?? '').replace(/\/$/, '');
const TOKEN = import.meta.env.STRAPI_TOKEN;

async function get<T>(path: string): Promise<T | null> {
  if (!BASE) return null;
  try {
    const res = await fetch(`${BASE}/api/${path}`, {
      headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data: T };
    return json.data ?? null;
  } catch {
    console.warn(`[strapi] ${path} недоступен, использую демо-контент`);
    return null;
  }
}

const nonEmpty = <T>(list: T[] | null): list is T[] => Array.isArray(list) && list.length > 0;

/** Абсолютный URL медиафайла из Strapi */
export const mediaUrl = (url?: string) => (!url ? undefined : url.startsWith('http') ? url : `${BASE}${url}`);

export async function getGlobal(): Promise<Global> {
  return (await get<Global>('global?populate=*')) ?? fb.global;
}
export async function getHome(): Promise<Home> {
  return (await get<Home>('home?populate=*')) ?? fb.home;
}
export async function getAbout(): Promise<About> {
  return (await get<About>('about?populate=*')) ?? fb.about;
}
export async function getServices(): Promise<Service[]> {
  const list = await get<Service[]>('services?populate=*&sort=order:asc');
  return nonEmpty(list) ? list : fb.services;
}
export async function getCases(): Promise<Case[]> {
  const list = await get<Case[]>('cases?populate=*&sort=publishedAt:desc');
  return nonEmpty(list) ? list : fb.cases;
}
export async function getTestimonials(): Promise<Testimonial[]> {
  return (await get<Testimonial[]>('testimonials?populate=*')) ?? fb.testimonials;
}
