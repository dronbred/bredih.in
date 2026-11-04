// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.SITE_URL || 'https://example.ru',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  image: {
    // Картинки из Strapi оптимизируются при сборке
    remotePatterns: [{ protocol: 'https' }, { protocol: 'http', hostname: 'localhost' }],
  },
});
