// После создания заявки отправляем уведомление в Telegram.
export default {
  async afterCreate(event: { result: Record<string, string> }) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return;
    const r = event.result;
    const text = [
      '🆕 Новая заявка с сайта',
      `Имя: ${r.name}`,
      `Контакт: ${r.contact}`,
      r.service && `Услуга: ${r.service}`,
      r.message && `Сообщение: ${r.message}`,
      r.page && `Страница: ${r.page}`,
    ].filter(Boolean).join('\n');
    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
    } catch (e) {
      strapi.log.error(`Telegram notify failed: ${e}`);
    }
  },
};
