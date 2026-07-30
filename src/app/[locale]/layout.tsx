import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Neuton, Lato, Inter } from "next/font/google";
import { Agentation } from "agentation";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import "../globals.css";

const neuton = Neuton({
  variable: "--font-neuton",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A serviço do museu",
  description:
    "Diretrizes de experiência para a instituição museo-educativa.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations("Digest");

  return (
    <html
      lang={locale}
      className={`${neuton.variable} ${lato.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <nav className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-6">
              <div
                className="h-6 w-6 rounded bg-blue-200"
                aria-hidden="true"
              />
              <div className="flex items-center gap-4 tracking-wide">
                <Link href="/glossario" className="text-sm hover:underline">
                  {t("glossaryLink")}
                </Link>
                <Link href="/panorama" className="text-sm hover:underline">
                  {t("panoramaLink")}
                </Link>
                <Link href="/colaborar" className="text-sm hover:underline">
                  {t("collaborateLink")}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LocaleSwitcher />
            </div>
          </nav>

          {children}
        </NextIntlClientProvider>
        {process.env.NODE_ENV === "development" && (
          <Agentation endpoint="http://localhost:4747" />
        )}
      </body>
    </html>
  );
}
