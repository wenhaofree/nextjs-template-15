import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Showcase } from "@/components/sections/Showcase";
import { Pricing } from "@/components/sections/Pricing";
import { getLandingPage } from "@/app/actions";
import { unstable_setRequestLocale } from 'next-intl/server';

export default async function LandingPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await Promise.resolve(params);
  
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const t = await getTranslations();
  const page = await getLandingPage(locale);

  return (
    <>
      {page.hero && <Hero hero={page.hero} />}
      {page.features && <Features features={page.features} />}
      {page.showcase && <Showcase section={page.showcase} />}
      {page.pricing && <Pricing pricing={page.pricing} />}
    </>
  );
}
