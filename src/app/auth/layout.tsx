import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "@/i18n";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication pages",
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = await headersList.get("x-pathname") || "";
  const locale = pathname.split("/")[1] || "en";
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
