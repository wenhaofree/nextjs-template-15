export async function getLandingPage(locale: string) {
  try {
    const messages = (await import(`../../messages/${locale}.json`)).default;
    return {
      header: messages.header,
      footer: messages.footer,
      hero: messages.hero,
      features: messages.features,
      showcase: messages.showcase,
      pricing: messages.pricing
    };
  } catch (error) {
    console.error('Error loading landing page data:', error);
    return {};
  }
}
