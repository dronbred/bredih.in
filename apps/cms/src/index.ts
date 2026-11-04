import type { Core } from '@strapi/strapi';

// Публичный доступ: чтение контента и только создание заявок.
const PUBLIC_PERMISSIONS: Record<string, string[]> = {
  'api::global.global': ['find'],
  'api::home.home': ['find'],
  'api::about.about': ['find'],
  'api::service.service': ['find', 'findOne'],
  'api::case.case': ['find', 'findOne'],
  'api::testimonial.testimonial': ['find', 'findOne'],
  'api::article.article': ['find', 'findOne'],
  'api::lead.lead': ['create'],
};

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    if (!role) return;
    for (const [uid, actions] of Object.entries(PUBLIC_PERMISSIONS)) {
      for (const a of actions) {
        const action = `${uid}.${a}`;
        const exists = await strapi.db.query('plugin::users-permissions.permission').findOne({ where: { action, role: role.id } });
        if (!exists) {
          await strapi.db.query('plugin::users-permissions.permission').create({ data: { action, role: role.id } });
        }
      }
    }

    // Пересборка сайта после публикации контента
    const hook = process.env.SITE_REBUILD_HOOK;
    if (hook) {
      strapi.db.lifecycles.subscribe({
        models: Object.keys(PUBLIC_PERMISSIONS).filter((m) => m !== 'api::lead.lead'),
        async afterUpdate() { await fetch(hook, { method: 'POST' }).catch(() => {}); },
        async afterCreate() { await fetch(hook, { method: 'POST' }).catch(() => {}); },
      });
    }
  },
};
