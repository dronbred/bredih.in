// Наполняет пустую базу демо-контентом: npm run seed
const { createStrapi, compileStrapi } = require('@strapi/strapi');
const data = require('./seed-data.json');

async function main() {
  const app = await createStrapi(await compileStrapi()).load();
  const docs = (uid) => app.documents(uid);
  const pub = { status: 'published' };

  if ((await docs('api::service.service').count()) > 0) {
    console.log('Контент уже есть, пропускаю.');
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
