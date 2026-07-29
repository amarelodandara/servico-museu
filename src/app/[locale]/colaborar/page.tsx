import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function CollaboratePage() {
  const t = await getTranslations("Collaborate");

  return (
    <div className="flex flex-1 flex-col bg-[var(--background)] text-[var(--foreground)]">
      <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <Link href="/" className="text-sm font-medium hover:underline">
          ← {t("back")}
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">{t("body")}</p>
      </main>
    </div>
  );
}
