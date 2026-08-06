import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Neuton, Lato, Inter } from "next/font/google";
import { Agentation } from "agentation";
import { routing } from "@/i18n/routing";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Footer } from "@/components/footer";
import { ColorPanel } from "@/components/color-panel";
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
  // TODO(user): swap for the real production domain once it exists —
  // OG/twitter image URLs resolve against this base.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
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

  return (
    <html
      lang={locale}
      /* Light is what the server has to guess at — it can't read
         localStorage or the OS preference. The script below corrects it
         before first paint, which is a change React would otherwise flag as
         a hydration mismatch on this element; `suppressHydrationWarning`
         covers `html`'s own attributes only, not its children. */
      data-theme="light"
      suppressHydrationWarning
      className={`${neuton.variable} ${lato.variable} ${inter.variable} h-full antialiased`}
    >
      {/*
       * Resolves the theme before first paint, so a dark-mode reader never
       * gets a white flash. Stays a raw inline script on purpose: anything
       * deferred (including next/script) runs after the first paint, which
       * is exactly the flash we're avoiding — and it needs an explicit
       * `head`, since React can't order a synchronous script rendered
       * loose in the document.
       */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("theme");document.documentElement.dataset.theme=(s==="light"||s==="dark")?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          {/* Carries the page wash (see `.page-gradient` in globals.css); it
              has to span the whole document, so it takes over the body's
              flex column rather than sitting inside it. */}
          <div className="page-gradient flex min-h-full flex-1 flex-col">
            <nav className="flex items-center justify-end px-6 py-4">

              {/* Hairline between the two, at the same weight as the rest of
                  the page's rules. It's doing real work here: the language
                  switch lies flat on the surface and the lamp has no frame
                  of its own, so without it the pair reads as one control. */}
              <div className="flex items-center gap-3">
                <LocaleSwitcher />
                <span
                  aria-hidden
                  className="h-4 w-px bg-black/10 dark:bg-white/15"
                />
                <ThemeToggle variant="bare" />
              </div>
            </nav>

            {children}
            <Footer />
          </div>
        </NextIntlClientProvider>
        {process.env.NODE_ENV === "development" && (
          <>
            <Agentation endpoint="http://localhost:4747" />
            <ColorPanel />
          </>
        )}
      </body>
    </html>
  );
}
