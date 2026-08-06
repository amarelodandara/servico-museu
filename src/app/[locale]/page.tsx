import { useLocale, useTranslations } from "next-intl";
import { SidenoteProvider } from "@/components/sidenote";
import { Contributors } from "@/components/contributors";
import { InstitutionCta } from "@/components/institution-cta";
import ContentPtBR from "@/content/pt-BR/index.mdx";
import ContentEn from "@/content/en/index.mdx";
import { buttonClass } from "@/components/ui/button";
import { ScrollLink } from "@/components/scroll-link";
import { DigestUnfold } from "@/components/digest-unfold";
import { HeroShader } from "@/components/hero-shader";
import { CollaborateNudge } from "@/components/collaborate-nudge";
import { ACADEMIC_WORD_COUNT, getDigestWordCount } from "@/lib/word-count";
import type { AppLocale } from "@/i18n/routing";

const CONTENT = {
  "pt-BR": ContentPtBR,
  en: ContentEn,
};

export default function DigestPage() {
  const t = useTranslations("Digest");
  const locale = useLocale();
  const Content = CONTENT[locale as keyof typeof CONTENT] ?? ContentPtBR;
  const digestWords = getDigestWordCount(locale as AppLocale);

  return (
    <div className="text-[var(--foreground)]">
      {/* `main` spans the full width and each section opts into the reading
          column itself, so the carousel can simply be 100% wide instead of
          fighting its way out of a centered container. */}
      <main className="flex flex-1 flex-col gap-6 pt-8 pb-16">
        {/* The hero takes the first screen to itself and centres in what's
            left of it — 6rem covers the nav above plus `main`'s own top
            padding. `svh` rather than `vh` so the mobile browser chrome
            doesn't push the centre off the bottom of the screen. */}
        <header className="relative mx-auto flex min-h-[calc(100svh-6rem)] w-10/12 max-w-3xl flex-col items-center justify-center gap-10 px-6 text-center">
          {/* Absolutely positioned, so it hangs in the corner of this
              section without taking a slot in the centred column. */}
          <CollaborateNudge />

          <p className="font-inter text-lg tracking-tight text-balance">
            {t("introParagraph1")}
          </p>

          {/* The 2rem taken off `main`'s top padding, spent here instead:
              margin stacks on top of the flex `gap`, so the title gets more
              air from the introduction than the rest of the column does. */}
          <h1 className="font-newsreader font-medium tracking-tight mt-8 text-4xl text-balance italic">
            {t("title")}{" "}
            <span className="lowercase text-gray-500">
              {t("titleSubtitle")}
            </span>
          </h1>

          <Contributors
            showInstitution={false}
            className="flex flex-wrap justify-center gap-6"
          />

          <div className="flex flex-wrap items-start justify-center gap-x-6 gap-y-4">
            <div className="flex flex-col items-center gap-1.5">
              <ScrollLink
                targetId="digest-content"
                className={buttonClass({
                  variant: "primary",
                  className: "w-fit",
                })}
              >
                {t("readDigest")}
              </ScrollLink>
              {/* Blue here is a live test, not a decision — the other count
                  below is still the neutral it was, for comparison. */}
              <span className="font-lato text-xs text-[var(--color-accent)]">
                {digestWords.toLocaleString(locale)} {t("wordCountShort")}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <a
                href="/academic.pdf"
                download
                className={buttonClass({
                  variant: "secondary",
                  className: "w-fit",
                })}
              >
                {t("downloadPdf")}
              </a>
              <span className="font-lato text-xs text-neutral-500 dark:text-neutral-400">
                {ACADEMIC_WORD_COUNT.toLocaleString(locale)}{" "}
                {t("wordCountShort")}
              </span>
            </div>
          </div>
        </header>

        {/* Narrower than the header on purpose, and centered rather than
            flush left: a 20-col track with the reading column at cols 4-11
            (col-start-4, col-span-8, 40% of the container) leaves 3 blank
            cols (15%) on each side, and the sidenote — see `.aside-float`
            in globals.css — occupies cols 12-17 (6 cols, 30%), three
            quarters of the reading column's width. */}

        <div className="mx-auto flex w-10/12 flex-col gap-6 px-6 mt-48">
          <SidenoteProvider>
            <div className="grid grid-cols-1 lg:grid-cols-[repeat(20,minmax(0,1fr))]">
              <DigestUnfold
                id="digest-content"
                className="col-span-1 space-y-6 outline-none lg:col-span-8 lg:col-start-4"
              >
                <div className="col-span-1 space-y-6 lg:col-span-8 text-center">
              <p className="font-newsreader font-medium tracking-tight text-3xl text-balance text-gray-700"><span className="text-black">A serviço do museu:</span> diretrizes de experiência para a instituição museo-educativa</p>

                  <p className="font-inter text-sm tracking-tight">por Letícia França e Nicoly Dandara</p>

                  <HeroShader />
                </div>
                <Content />
              </DigestUnfold>
            </div>
          </SidenoteProvider>
        </div>

        <InstitutionCta />
      </main>
    </div>
  );
}
