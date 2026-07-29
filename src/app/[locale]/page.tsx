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

function DownloadPdfLink({ label }: { label: string }) {
  return (
    <a
      href="/academic.pdf"
      download
      className="w-fit rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
    >
      {label}
    </a>
  );
}

export default function DigestPage() {
  const t = useTranslations("Digest");
  const locale = useLocale();
  const Content = CONTENT[locale as keyof typeof CONTENT] ?? ContentPtBR;

  return (
    <div className="flex flex-1 flex-col bg-[var(--background)] text-[var(--foreground)]">
      <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <span className="text-sm uppercase tracking-wide text-neutral-500">
          {t("kicker")}
        </span>
        <div className="flex items-center gap-4">
          <Link href="/glossario" className="text-sm hover:underline">
            {t("glossaryLink")}
          </Link>
          <LocaleSwitcher />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[58rem] flex-1 flex-col gap-6 px-6 py-16">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>

        <DownloadPdfLink label={t("downloadPdf")} />

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
