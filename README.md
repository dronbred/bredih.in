# Сайт Андрея Бредихина

Персональный сайт с услугами: автоматизация процессов, сайты, Telegram-боты, приложения.

- `apps/web` — фронтенд на Astro 5 + Tailwind CSS 4, статическая сборка.
- `apps/cms` — Strapi 5 + PostgreSQL, весь контент и заявки с сайта.
- `docker-compose.yml`, `deploy/` — развёртывание на одном VPS.

## Локальный запуск

Нужны Node.js 22 и PostgreSQL (или `docker compose up db`).

```bash
# CMS
cd apps/cms
cp .env.example .env        # заполнить секреты: openssl rand -base64 32
npm install
npm run develop             # http://localhost:1337/admin — создать администратора
npm run seed                # загрузить демо-контент (один раз, в пустую базу)

# Сайт
cd ../web
cp .env.example .env
npm install
npm run dev                 # http://localhost:4321
```

Если Strapi не запущен, сайт собирается на демо-контенте из `apps/web/src/lib/fallback.ts` и `apps/cms/scripts/seed-n8n.json` (раздел n8n).

## Контент в Strapi

| Тип | Что хранит |
|---|---|
| Global | Название, контакты, соцсети, SEO по умолчанию |
| Главная | Первый экран, этапы работы, технологии |
| Обо мне | Текст, фото, факты в цифрах |
| Услуга | Описание, что входит, цена, сроки, FAQ, связанные кейсы |
| Услуга n8n | Раздел `/services/n8n/`: категория, цена «от», срок в днях, что входит, результат, что нужно от клиента, что не входит, этапы, FAQ, SEO |
| Страница «Автоматизация на n8n» | Заголовок и вступление каталога, преимущества n8n, этапы работы, FAQ, SEO |
| Кейс | Задача, решение, результат, метрики, стек, обложка, галерея |
| Отзыв | Автор, должность, текст, фото |
| Статья | Блог (страницы появятся позже) |
| Заявка | Сообщения с формы сайта, статус обработки |

Публичные права (чтение контента и только создание заявок) выставляются автоматически при старте Strapi (`apps/cms/src/index.ts`).

Заявки дублируются в Telegram, если в `apps/cms/.env` заданы `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`.

## Продакшн

```bash
cd apps/web && STRAPI_URL=https://домен PUBLIC_STRAPI_URL=https://домен SITE_URL=https://домен npm run build
cd ../.. && DATABASE_PASSWORD=... docker compose up -d --build
```

Nginx отдаёт статику сайта и проксирует `/api`, `/admin`, `/uploads` в Strapi. HTTPS настраивается отдельно (certbot или Caddy). После публикации контента сайт пересобирается через `SITE_REBUILD_HOOK` (вебхук CI).
