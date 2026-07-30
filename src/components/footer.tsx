import { getTranslations } from "next-intl/server";
import { AboutSiteDialog } from "@/components/about-site-dialog";
import { Contributors } from "@/components/contributors";
import { ShareLink } from "@/components/share-link";

/**
 * Site-wide footer, full-bleed like the `nav` in the locale layout (no
 * max-width wrapper — just the same `px-6` gutter) rather than boxed
 * inside the digest's reading column.
 *
 * Two bands: the centered credit block with its actions, then a
 * left-aligned authorship line under a hairline rule.
 *
 * No top rule: the footer reads as its own surface through the grain layer
 * (`.footer-grain`), which ramps from nothing at this top edge to full
 * strength at the bottom of the page.
 */
export async function Footer() {
  const t = await getTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="relative px-6 py-12 text-sm">
      <div
        className="footer-grain pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 text-center text-balance">
        <p className="text-3xl">{t("title")}</p>

        <Contributors className="flex flex-wrap justify-center gap-6" />

        <div className="flex flex-wrap items-center justify-center gap-3">
          <ShareLink label={t("share")} />
          <a
            href="/academic.pdf"
            download
            className="font-lato w-fit rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            {t("download")}
          </a>
        </div>

        <AboutSiteDialog />
      </div>

      <p className="font-lato relative mt-12 border-t border-neutral-200 pt-6 text-xs text-neutral-500 dark:border-neutral-800">
        {t("developedBy")} — {year}
      </p>
    </footer>
  );
}
