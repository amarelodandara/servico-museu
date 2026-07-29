import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ptBR from "@/content/glossary.pt-BR.json";
import en from "@/content/glossary.en.json";

const DATA = { "pt-BR": ptBR, en };

export default async function GlossaryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Glossary");
  const data = DATA[locale as keyof typeof DATA] ?? ptBR;
  const entries = Object.values(data).sort((a, b) =>
    a.term.localeCompare(b.term, locale),
  );

  return (
    <div className="flex flex-1 flex-col bg-[var(--background)] text-[var(--foreground)]">
      <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <Link href="/" className="text-sm font-medium hover:underline">
          ← {t("back")}
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <dl className="flex flex-col gap-6">
          {entries.map((entry) => (
            <div key={entry.term}>
              <dt className="font-semibold">{entry.term}</dt>
              <dd className="text-neutral-600 dark:text-neutral-400">
                {entry.definition}
              </dd>
            </div>
          ))}
        </dl>
      </main>
    </div>
  );
}
