"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";
import { buttonClass } from "@/components/ui/button";

/**
 * Tertiary footer action: opens a two-column panel — the site's development
 * note on the left, the colophon on the right. Stacks to one column below
 * `sm`, where two columns of body text would each be too narrow to read.
 */
export function AboutSiteDialog() {
  const t = useTranslations("Footer");
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const colophon = [
    ["colophonTypefacesLabel", "colophonTypefaces"],
    ["colophonStackLabel", "colophonStack"],
    ["colophonImagesLabel", "colophonImages"],
    ["colophonLicenseLabel", "colophonLicense"],
  ] as const;

  return (
    <>
      {/* No dark variants on the trigger: it lives on the footer's paper
          mat, which stays white in either scheme. The dialog it opens
          floats over the page, so that one does follow the theme. */}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={buttonClass({
          variant: "quiet",
          size: "sm",
          surface: "light",
          className: "w-fit text-neutral-600",
        })}
      >
        {t("about")}
      </button>

      <button
        type="button"
        aria-label={t("aboutClose")}
        tabIndex={-1}
        aria-hidden={!open}
        data-open={open}
        onClick={() => setOpen(false)}
        className="overlay-scrim fixed inset-0 z-40 cursor-default bg-neutral-900/20"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-open={open}
        className="overlay-panel fixed inset-x-4 top-1/2 z-50 max-h-[80vh] -translate-y-1/2 overflow-y-auto rounded-lg border border-neutral-300 bg-[var(--background)] p-6 text-left shadow-[var(--shadow-float)] sm:inset-x-auto sm:left-1/2 sm:w-[min(48rem,calc(100vw-3rem))] sm:-translate-x-1/2 sm:p-8 dark:border-neutral-700"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-2xl">
            {t("aboutTitle")}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={buttonClass({
              variant: "quiet",
              size: "sm",
              className: "-mr-3",
            })}
          >
            {t("aboutClose")}
          </button>
        </div>

        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          <section>
            <h3 className="font-lato text-xs tracking-wide text-neutral-500 uppercase">
              {t("aboutHeading")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed">{t("aboutBody")}</p>
          </section>

          <section>
            <h3 className="font-lato text-xs tracking-wide text-neutral-500 uppercase">
              {t("colophonHeading")}
            </h3>
            <dl className="mt-2 space-y-3 text-sm">
              {colophon.map(([label, value]) => (
                <div key={label}>
                  <dt className="font-lato text-neutral-500">{t(label)}</dt>
                  <dd className="leading-relaxed">{t(value)}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </>
  );
}
