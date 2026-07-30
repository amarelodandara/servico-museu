import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PanoramaVenn } from "@/components/panorama-venn";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Panorama");
  return {
    title: t("title"),
    description: t("intro"),
  };
}

/**
 * The shareable research-panorama route from the pitch: the Venn diagram
 * with its own OG image and a PNG download, plus the bibliography mapped
 * onto the three fields, so the link stands on its own outside the digest.
 */
export default async function PanoramaPage() {
  const t = await getTranslations("Panorama");

  const fieldWorks = [
    { field: "field_museology", works: ["Lei nº 11.904/2009", "Resolução Normativa Ibram nº 40/2025 (PNEM)", "Desvallées & Mairesse — Conceitos-chave de museologia"] },
    { field: "field_serviceDesign", works: ["Downe — Good Services", "Stickdorn et al. — Isto é design de serviço na prática"] },
    { field: "field_informationDesign", works: ["Tufte — Envisioning Information"] },
    { field: "fieldIntersection", works: ["Norman — The Design of Everyday Things"] },
  ];

  return (
    <div className="flex flex-1 flex-col bg-[var(--background)] text-[var(--foreground)]">
      <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <Link href="/" className="text-sm font-medium hover:underline">
          ← {t("back")}
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <p className="text-neutral-700 dark:text-neutral-300">{t("intro")}</p>

        <PanoramaVenn />

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">{t("worksTitle")}</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {t("worksIntro")}
          </p>
          <dl className="flex flex-col gap-4">
            {fieldWorks.map(({ field, works }) => (
              <div key={field}>
                <dt className="font-semibold">{t(field)}</dt>
                <dd>
                  <ul className="mt-1 list-disc pl-5 text-sm text-neutral-600 dark:text-neutral-400">
                    {works.map((work) => (
                      <li key={work}>{work}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </div>
  );
}
