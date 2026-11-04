// Раздел «Автоматизация на n8n»: категории и форматирование цены и срока.
import type { N8nCategory, N8nService } from './types';

export const N8N_PATH = '/services/n8n/';
/** Общая услуга, на странице которой показываем ссылку на раздел n8n */
export const N8N_PARENT_SLUG = 'avtomatizaciya';

export const categories: { id: N8nCategory; label: string }[] = [
  { id: 'setup', label: 'Установка и аудит' },
  { id: 'integrations', label: 'Интеграции и сценарии' },
  { id: 'ai', label: 'Автоматизация с AI' },
  { id: 'messaging', label: 'Боты и рассылки' },
  { id: 'support', label: 'Перенос и поддержка' },
];
export const categoryLabel = (id: N8nCategory) => categories.find((c) => c.id === id)?.label ?? id;

/** Категории в заданном порядке, только непустые */
export const groupByCategory = (list: N8nService[]) =>
  categories.map((c) => ({ ...c, items: list.filter((s) => s.category === c.id) })).filter((g) => g.items.length > 0);

const rub = new Intl.NumberFormat('ru-RU');
export const formatPrice = (s: Pick<N8nService, 'price' | 'priceNote'>) =>
  s.price == null ? undefined : `от ${rub.format(s.price)} ₽${s.priceNote ? ` ${s.priceNote}` : ''}`;

const plural = (n: number, forms: [string, string, string]) => {
  const m10 = n % 10, m100 = n % 100;
  return forms[m10 === 1 && m100 !== 11 ? 0 : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? 1 : 2];
};
export const formatDuration = (days?: number) =>
  days ? `${days} ${plural(days, ['рабочий день', 'рабочих дня', 'рабочих дней'])}` : undefined;
