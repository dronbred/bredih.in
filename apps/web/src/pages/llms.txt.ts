// llms.txt: краткое описание сайта для языковых моделей (https://llmstxt.org).
import type { APIRoute } from 'astro';
import { getAbout, getCases, getGlobal, getN8nPage, getN8nServices, getServices } from '../lib/strapi';
import { N8N_PATH, formatDuration, formatPrice, groupByCategory } from '../lib/n8n';

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.href ?? '').replace(/\/$/, '');
  const [g, services, cases, about, n8nPage, n8n] = await Promise.all([getGlobal(), getServices(), getCases(), getAbout(), getN8nPage(), getN8nServices()]);
  const out: string[] = [
    `# ${g.siteName}`,
    '',
    `> ${g.seo.metaDescription ?? g.tagline}`,
    '',
    about.text.split('\n').filter(Boolean)[0] ?? '',
    '',
    'Работает удалённо с клиентами по всей России. Язык общения: русский.',
    `Связаться: Telegram ${g.telegram}${g.email ? `, почта ${g.email}` : ''}${g.phone ? `, телефон ${g.phone}` : ''}.`,
    '',
    '## Услуги',
    '',
    ...services.map((s) => `- [${s.title}](${base}/services/${s.slug}/): ${s.short}${s.priceFrom ? ` Стоимость ${s.priceFrom}` : ''}${s.duration ? `, срок ${s.duration}` : ''}.`),
    '',
    `## ${n8nPage.title}`,
    '',
    `Каталог: ${base}${N8N_PATH}`,
    '',
    ...groupByCategory(n8n).flatMap((grp) => [
      `### ${grp.label}`,
      '',
      ...grp.items.map((s) => `- [${s.title}](${base}${N8N_PATH}${s.slug}/): ${s.short}${formatPrice(s) ? ` Стоимость ${formatPrice(s)}` : ''}${formatDuration(s.duration) ? `, срок ${formatDuration(s.duration)}` : ''}.`),
      '',
    ]),
    '## Кейсы',
    '',
    ...cases.map((c) => `- [${c.title}](${base}/cases/${c.slug}/): ${c.summary}${c.metrics?.length ? ` Результат: ${c.metrics.map((m) => `${m.value} ${m.label}`).join(', ')}.` : ''}`),
    '',
    '## Частые вопросы',
    '',
    ...services.flatMap((s) => (s.faq ?? []).map((q) => `- ${q.question} ${q.answer}`)),
    '',
    '## Страницы',
    '',
    `- [Обо мне](${base}/about/): опыт, подход и инструменты`,
    `- [Контакты](${base}/contacts/): Telegram, почта и форма заявки`,
    '',
  ];
  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
