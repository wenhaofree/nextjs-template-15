export async function getLandingPage(locale: string) {
  try {
    const messages = (await import(`../../messages/${locale}.json`)).default;
    return {
      header: messages.header,
      footer: messages.footer,
      hero: messages.hero,
      branding: messages.branding,
      introduce: messages.introduce,
      benefit: messages.benefit,
      usage: messages.usage,
      feature: messages.feature,
      showcase: messages.showcase,
      stats: messages.stats,
      pricing: messages.pricing,
      testimonial: messages.testimonial,
      faq: messages.faq,
      cta: messages.cta
    };
  } catch (error) {
    console.error('Error loading landing page data:', error);
    return {};
  }
}
