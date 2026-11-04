// Наполняет пустую базу демо-контентом: npm run seed
const { createStrapi, compileStrapi } = require('@strapi/strapi');
const data = require('./seed-data.json');
const n8n = require('./seed-n8n.json');
const flows = require('./seed-flows.json');

async function main() {
  const app = await createStrapi(await compileStrapi()).load();
  const docs = (uid) => app.documents(uid);
  const pub = { status: 'published' };

  // Раздел «Автоматизация на n8n» заполняется отдельно, чтобы его можно было
  // добавить и в уже наполненную базу.
  if ((await docs('api::n8n-service.n8n-service').count()) === 0) {
    await docs('api::n8n-page.n8n-page').create({ data: n8n.page });
    for (const [i, s] of n8n.services.entries()) {
      await docs('api::n8n-service.n8n-service').create({ data: { ...s, order: i }, ...pub });
    }
    console.log(`Услуги n8n загружены: ${n8n.services.length}.`);
  }

  // Сценарии для схемы на первом экране главной: показывается случайный.
  if ((await docs('api::flow-scenario.flow-scenario').count()) === 0) {
    for (const [i, f] of flows.entries()) {
      await docs('api::flow-scenario.flow-scenario').create({ data: { ...f, order: i }, ...pub });
    }
    console.log(`Сценарии автоматизации загружены: ${flows.length}.`);
  }

  if ((await docs('api::service.service').count()) > 0) {
    console.log('Основной контент уже есть, пропускаю.');
    return app.destroy();
  }
  await docs('api::global.global').create({ data: data.global });
  await docs('api::home.home').create({ data: data.home });
  await docs('api::about.about').create({ data: data.about });

  const serviceIds = {};
  for (const [i, s] of data.services.entries()) {
    const doc = await docs('api::service.service').create({ data: { ...s, order: i }, ...pub });
    serviceIds[s.slug] = doc.documentId;
  }
  for (const c of data.cases) {
    const services = (c.services ?? []).map((s) => serviceIds[s.slug]).filter(Boolean);
    await docs('api::case.case').create({ data: { ...c, services }, ...pub });
  }
  for (const t of data.testimonials) await docs('api::testimonial.testimonial').create({ data: t, ...pub });

  console.log('Демо-контент загружен.');
  await app.destroy();
}
main().catch((e) => { console.error(e); process.exit(1); });
