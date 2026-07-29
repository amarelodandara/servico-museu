import { useLocale, useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Link } from "@/i18n/navigation";
import { SidenoteProvider } from "@/components/sidenote";
import { Outline } from "@/components/outline";
import ContentPtBR from "@/content/pt-BR/index.mdx";
import ContentEn from "@/content/en/index.mdx";

const CONTENT = {
  "pt-BR": ContentPtBR,
  en: ContentEn,
};

function DownloadPdfLink({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <a
      href="/academic.pdf"
      download
      className={`w-fit rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900 ${className}`}
    >
      {label}
    </a>
  );
}

const CONTRIBUTORS = [
  { name: "Letícia França", roleKey: "researcher" as const },
  { name: "Nicoly Dandara", roleKey: "researcher" as const },
  { name: "Simone Souza", roleKey: "advisor" as const },
];

export default function DigestPage() {
  const t = useTranslations("Digest");
  const locale = useLocale();
  const Content = CONTENT[locale as keyof typeof CONTENT] ?? ContentPtBR;

  return (
    <div className="flex flex-1 flex-col bg-[var(--background)] text-[var(--foreground)]">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div
            className="h-6 w-6 flex-shrink-0 rounded border border-neutral-300 dark:border-neutral-700"
            aria-hidden="true"
          />
          <Link href="/glossario" className="font-lato text-sm hover:underline">
            {t("glossaryLink")}
          </Link>
          <Link href="/colaborar" className="font-lato text-sm hover:underline">
            {t("collaborateLink")}
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <LocaleSwitcher />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[58rem] flex-1 flex-col gap-6 px-6 py-16">
        <section className="flex flex-col gap-8 border-b border-neutral-200 pb-10 dark:border-neutral-800">
          <div className="flex flex-col gap-2">
            <h1 className="font-inter text-5xl font-bold tracking-tight">
              {t("title")} <span className="lowercase text-gray-500">{t("titleSubtitle")}</span>
            </h1>
          </div>

          <div className="grid grid-cols-5 items-start justify-between gap-8">
            <div className="text-lg leading-tight col-span-2 flex max-w-md flex-col gap-4 text-neutral-700 dark:text-neutral-300">
              <p>{t("introParagraph1")}</p>
              <p>{t("introParagraph2")}</p>
            </div>

            <div className="col-span-3 ">
              {CONTRIBUTORS.map((person) => (
                <div
                  key={person.name}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <div
                    className="h-24 aspect-[3/4] rounded border border-neutral-300 dark:border-neutral-700"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-mediu font-inter font-bold tracking-tight">{person.name}</span>
                  <span className="text-xs text-neutral-500">
                    {t(person.roleKey)}
                  </span>
                </div>
              ))}

              <div className="flex flex-col items-center gap-2 text-center">
                <div
                  className="h-24 w-[4.5rem] rounded border border-neutral-300 dark:border-neutral-700"
                  role="img"
                  aria-label={t("institutionAlt")}
                />
                <span className="text-xs text-neutral-500">
                  {t("institution")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#digest-content"
              className="font-lato w-fit rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
            >
              {t("readDigest")}
            </a>
            <DownloadPdfLink label={t("downloadPdf")} className="font-lato" />
          </div>
        </section>

        <SidenoteProvider>
          <div
            id="digest-content"
            className="with-sidenotes flex flex-col gap-6"
          >
            <Content />
          </div>
        </SidenoteProvider>

        <DownloadPdfLink label={t("downloadPdf")} />
      </main>

      <Outline containerId="digest-content" />
    </div>
  );
}
