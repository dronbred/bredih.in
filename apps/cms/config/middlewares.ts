export default ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  { name: 'strapi::cors', config: { origin: env.array('CORS_ORIGINS', ['http://localhost:4321']) } },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
