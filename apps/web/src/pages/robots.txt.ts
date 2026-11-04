// robots.txt: открываем сайт обычным поисковикам и AI-поиску, закрываем служебные разделы Strapi.
import type { APIRoute } from 'astro';

const AI_BOTS = [
  'OAI-SearchBot', 'ChatGPT-User', 'GPTBot',
  'Claude-SearchBot', 'Claude-User', 'ClaudeBot',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot', 'Applebot-Extended',
  'YandexBot', 'YandexAdditional', 'YandexAdditionalBot',
];

export const GET: APIRoute = ({ site }) => {
  const base = (site?.href ?? '').replace(/\/$/, '');
  const disallow = ['/admin', '/api/', '/content-manager', '/upload'];
  const lines = [
    'User-agent: *',
    ...disallow.map((p) => `Disallow: ${p}`),
    'Allow: /',
    '',
    // Явно разрешаем AI-поиск и ассистентов, чтобы сайт цитировали в ответах
    ...AI_BOTS.flatMap((bot) => [`User-agent: ${bot}`, ...disallow.map((p) => `Disallow: ${p}`), 'Allow: /', '']),
    `Sitemap: ${base}/sitemap-index.xml`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
