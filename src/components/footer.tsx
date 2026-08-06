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
        className="paspateur-bg relative mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-sm px-8 py-16 text-center text-balance text-neutral-900 lg:max-w-4xl lg:px-16 lg:py-20 xl:max-w-6xl"
        style={{ boxShadow: "var(--shadow-mat)" }}
      >
        {/* Capped by measure, not by viewport: the mat grows to 6xl on wide
            screens, and without a limit here the title would straighten out
            into one very long line. ~44ch breaks both the Portuguese and the
            English title across two, and `text-balance` evens them out. */}
        <p className="max-w-[44ch] text-3xl tracking-tight text-balance">
          {t("title")}
        </p>

        {/* Extra air around the portrait row: at this size the frames need
            to read as a band of their own, not as another line of type. */}
        <Contributors className="my-6 flex flex-wrap justify-center gap-6" />

        <div className="flex flex-wrap items-center justify-center gap-3">
          <ShareLink label={t("share")} surface="light" />
          <a
            href="/academic.pdf"
            download
            /* Same variant and same (default) size as the hero's pair, so
               the two rows are the one design doing two jobs. */
            className={buttonClass({
              variant: "primary",
              className: "w-fit",
            })}
          >
            {t("download")}
          </a>
        </div>

        <AboutSiteDialog />
      </div>

      <p className="font-lato relative mt-12 border-t border-neutral-200 pt-6 text-xs text-neutral-500 dark:border-neutral-800">
        {t.rich("developedBy", {
          link: (chunks) => (
            <a
              href="https://adandara.com"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-neutral-400 underline-offset-2 transition-colors duration-150 ease-out hover:text-neutral-900 hover:decoration-neutral-600 dark:hover:text-neutral-100"
            >
              {chunks}
            </a>
          ),
        })}{" "}
        — {year}
      </p>
    </footer>
  );
}
