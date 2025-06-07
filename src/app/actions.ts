export async function getLandingPage(locale: string) {
  try {
    let messages;
    try {
      messages = (await import(`../../messages/${locale}.json`)).default;
    } catch {
      // If the requested locale file doesn't exist, fallback to English
      messages = (await import(`../../messages/en.json`)).default;
    }
    return {
      header: messages.header,
      footer: messages.footer,
      hero: messages.hero,
      benefit: messages.benefit,
      stats: messages.stats,
      pricing: messages.pricing,
      testimonial: messages.testimonial,
      faq: messages.faq,
      cta: messages.cta
    };
  } catch (error) {
    console.error('Error loading landing page data:', error);
    throw error;
  }
}
