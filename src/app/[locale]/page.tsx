import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/locale-switcher";
import PipelineCheck from "@/content/pipeline-check.mdx";

export default function DigestPage() {
  const t = useTranslations("Digest");

  return (
    <div className="flex flex-1 flex-col bg-[var(--background)] text-[var(--foreground)]">
      <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <span className="text-sm uppercase tracking-wide text-neutral-500">
          {t("kicker")}
        </span>
        <LocaleSwitcher />
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">{t("intro")}</p>

        <div className="rounded-md border border-dashed border-neutral-300 p-4 text-sm dark:border-neutral-700">
          <PipelineCheck />
        </div>

        <a
          href="/academic.pdf"
          download
          className="w-fit rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          {t("downloadPdf")}
        </a>
      </main>
    </div>
  );
}
