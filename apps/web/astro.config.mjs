// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Служебные страницы не попадают в sitemap
const EXCLUDE = ['/privacy/', '/404'];

export default defineConfig({
  site: process.env.SITE_URL || 'https://bredih.in',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !EXCLUDE.some((p) => page.endsWith(p) || page.endsWith(`${p}/`)),
      changefreq: 'monthly',
      lastmod: new Date(),
      serialize: (item) => {
        const path = new URL(item.url).pathname;
        item.priority = path === '/' ? 1 : path.split('/').filter(Boolean).length === 1 ? 0.8 : 0.6;
        return item;
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  image: {
    remotePatterns: [{ protocol: 'https' }, { protocol: 'http', hostname: 'localhost' }],
  },
});
