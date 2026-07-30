import { useLocale, useTranslations } from "next-intl";
import { SidenoteProvider } from "@/components/sidenote";
import { WordCountBars } from "@/components/word-count-bars";
import { Contributors } from "@/components/contributors";
import ContentPtBR from "@/content/pt-BR/index.mdx";
import ContentEn from "@/content/en/index.mdx";

const CONTENT = {
  "pt-BR": ContentPtBR,
  en: ContentEn,
};

function DownloadPdfLink({
  label,
  note,
  className = "",
}: {
  label: string;
  note?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <a
        href="/academic.pdf"
        download
        className="w-fit text-sm font-medium text-neutral-700 hover:underline dark:text-neutral-300"
      >
        {label}
      </a>
      {note && (
        <span className="text-xs text-neutral-500 dark:text-neutral-500">
          {note}
        </span>
      )}
    </div>
  );
}

export default function DigestPage() {
  const t = useTranslations("Digest");
  const locale = useLocale();
  const Content = CONTENT[locale as keyof typeof CONTENT] ?? ContentPtBR;

  return (
    <div className="text-[var(--foreground)]">
      {/* `main` spans the full width and each section opts into the reading
          column itself, so the carousel can simply be 100% wide instead of
          fighting its way out of a centered container. */}
      <main className="flex flex-1 flex-col gap-6 py-16">
        <header className="mx-auto grid w-10/12 grid-cols-5 px-6">
          <div className="flex flex-col gap-2 col-span-3 justify-end">
            <div className="space-y-6">


              <p className="font-inter">{t("introParagraph1")}</p>

              <div className="space-y-2 text-3xl text-balance">

            <h1 className="">
              {t("title")} <span className="lowercase text-gray-500">{t("titleSubtitle")}</span>
            </h1>
            <p className="">{t("introParagraph2")}</p>
              </div>
            </div>

            <div className="">
              <div className="col-span-3 flex flex-col space-y-8 text-balance">
                <div className="space-y-4">



                </div>

                <WordCountBars />

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="#digest-content"
                    className="font-lato w-fit rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
                  >
                    {t("readDigest")}
                  </a>
                  <DownloadPdfLink
                    label={t("downloadPdf")}
                    note={t("downloadPdfNote")}
                    className="font-lato"
                  />
                </div>
              </div>


            </div>


          </div>

          <Contributors className="col-span-2 flex justify-end gap-6 flex-wrap-reverse" />
        </header>

        {/* Narrower than the header on purpose, and centered rather than
            flush left: a 20-col track with the reading column at cols 4-11
            (col-start-4, col-span-8, 40% of the container) leaves 3 blank
            cols (15%) on each side, and the sidenote — see `.aside-float`
            in globals.css — occupies cols 12-17 (6 cols, 30%), three
            quarters of the reading column's width. */}

        <div className="mx-auto flex w-10/12 flex-col gap-6 px-6">
          <SidenoteProvider>
            <div className="grid grid-cols-1 lg:grid-cols-[repeat(20,minmax(0,1fr))]">
              <div
                id="digest-content"
                className="col-span-1 space-y-6 lg:col-span-8 lg:col-start-4"
              >
                <div className="col-span-1 space-y-6 lg:col-span-8 text-center">
              <p className="text-3xl text-balance text-gray-700"><span className="text-black">A serviço do museu:</span> diretrizes de experiência para a instituição museo-educativa</p>

                  <p className="font-inter tracking-tight">por Letícia França & Nicoly Dandara</p>

                  <div className="aspect-[3/2] h-60 bg-gray-300 mx-auto"></div>
                </div>
                <Content />
              </div>
            </div>
          </SidenoteProvider>

          <DownloadPdfLink
            label={t("downloadPdf")}
            note={t("downloadPdfNote")}
          />
        </div>
      </main>
    </div>
  );
}
