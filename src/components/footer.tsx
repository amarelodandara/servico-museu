import { getTranslations } from "next-intl/server";
import { AboutSiteDialog } from "@/components/about-site-dialog";
import { Contributors } from "@/components/contributors";
import { ShareLink } from "@/components/share-link";
import { buttonClass } from "@/components/ui/button";

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
 *
 * The credit block sits on that grain as a paper mat — the same recessed
 * `paspateur` treatment the bibliography shelf uses, flat white and framed
 * by `--shadow-mat`. It stays clean by construction rather than by opting
 * out: the grain layer paints first, so an opaque surface over it takes no
 * tint from the multiply blend at all. That contrast is the point — the
 * closing band gets grittier towards the bottom of the page while the
 * credits sit on untouched paper.
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

      <div
        className="paspateur-bg relative mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-sm px-8 py-10 text-center text-balance text-neutral-900 lg:max-w-4xl lg:px-16 xl:max-w-6xl"
        style={{ boxShadow: "var(--shadow-mat)" }}
      >
        <p className="text-3xl tracking-tight">{t("title")}</p>

        {/* Extra air around the portrait row: at this size the frames need
            to read as a band of their own, not as another line of type. */}
        <Contributors className="my-6 flex flex-wrap justify-center gap-6" />

        <div className="flex flex-wrap items-center justify-center gap-3">
          <ShareLink label={t("share")} surface="light" />
          <a
            href="/academic.pdf"
            download
            className={buttonClass({
              size: "lg",
              surface: "light",
              className: "w-fit",
            })}
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
