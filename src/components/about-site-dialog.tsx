"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/**
 * Footer action: opens a two-column panel — the site's development note on
 * the left, the colophon on the right. Stacks to one column below `sm`,
 * where two columns of body text would each be too narrow to read.
 *
 * The trigger sits in the closing credit bar, unstyled — plain inline text
 * next to the "developed by" line, not a button in its own right.
 */
/** Shared underline treatment for every link inside the panel. */
const LINK_CLASS =
  "underline decoration-neutral-400 underline-offset-2 transition-colors duration-150 ease-out hover:text-neutral-900 hover:decoration-neutral-600 dark:hover:text-neutral-100";

// TODO: placeholder hrefs — swap in the real project write-up, GitHub repo
// and Paper Shaders URLs once they exist.
const WRITEUP_HREF = "#";
const GITHUB_HREF = "#";
const PAPER_SHADERS_HREF = "#";

export function AboutSiteDialog() {
  const t = useTranslations("Footer");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  /*
   * Colophon rows: a label and a linked value, dotted-leader between them.
   * Values are proper nouns (Next.js, Vercel…) and identical in every
   * locale, so only the label comes from `t` — the values live here.
   */
  const colophon = [
    {
      label: t("colophonFrameworkLabel"),
      value: (
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noreferrer"
          className={LINK_CLASS}
        >
          Next.js
        </a>
      ),
    },
    {
      label: t("colophonHostingLabel"),
      value: (
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noreferrer"
          className={LINK_CLASS}
        >
          Vercel
        </a>
      ),
    },
    {
      label: t("colophonTypefaceLabel"),
      value: (
        <>
          <a
            href="https://fonts.google.com/specimen/Neuton"
            target="_blank"
            rel="noreferrer"
            className={LINK_CLASS}
          >
            Neuton
          </a>
          {", "}
          <a
            href="https://fonts.google.com/specimen/Lato"
            target="_blank"
            rel="noreferrer"
            className={LINK_CLASS}
          >
            Lato
          </a>
          {", "}
          <a
            href="https://fonts.google.com/specimen/Inter"
            target="_blank"
            rel="noreferrer"
            className={LINK_CLASS}
          >
            Inter
          </a>
        </>
      ),
    },
    {
      label: t("colophonShadersLabel"),
      value: (
        <a
          href={PAPER_SHADERS_HREF}
          target="_blank"
          rel="noreferrer"
          className={LINK_CLASS}
        >
          Paper Shaders
        </a>
      ),
    },
    {
      label: t("colophonStylingLabel"),
      value: (
        <a
          href="https://tailwindcss.com"
          target="_blank"
          rel="noreferrer"
          className={LINK_CLASS}
        >
          Tailwind
        </a>
      ),
    },
  ];

  return (
    <>
      <button type="button" aria-expanded={open} onClick={() => setOpen(true)}>
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
        aria-label={t("aboutTitle")}
        data-open={open}
        className="overlay-panel fixed inset-x-4 top-1/2 z-50 max-h-[80vh] -translate-y-1/2 overflow-y-auto rounded-lg border border-neutral-300 bg-[var(--background)] p-8 text-left shadow-[var(--shadow-float)] sm:inset-x-auto sm:left-1/2 sm:w-[min(48rem,calc(100vw-3rem))] sm:-translate-x-1/2 sm:p-10 dark:border-neutral-700"
      >
        <div className="flex justify-end">
          <button
            type="button"
            aria-label={t("aboutClose")}
            onClick={() => setOpen(false)}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] -mr-1 -mt-1 rounded-full p-2 text-neutral-500 transition-colors duration-150 ease-out hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M2 2l12 12M14 2L2 14" />
            </svg>
          </button>
        </div>

        <div className="mt-2 grid gap-8 sm:grid-cols-2 sm:gap-14">
          <section>
            <p className="text-sm leading-relaxed">{t("aboutBody")}</p>
            <p className="mt-5 text-sm leading-relaxed">
              {t.rich("aboutCredit", {
                name: (chunks) => (
                  <a
                    href="https://adandara.com"
                    target="_blank"
                    rel="noreferrer"
                    className={LINK_CLASS}
                  >
                    {chunks}
                  </a>
                ),
                writeup: (chunks) => (
                  <a
                    href={WRITEUP_HREF}
                    target="_blank"
                    rel="noreferrer"
                    className={LINK_CLASS}
                  >
                    {chunks}
                  </a>
                ),
                github: (chunks) => (
                  <a
                    href={GITHUB_HREF}
                    target="_blank"
                    rel="noreferrer"
                    className={LINK_CLASS}
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </section>

          <section>
            <div className="flex flex-col divide-y divide-neutral-200 rounded-lg border border-neutral-200 text-sm dark:divide-neutral-800 dark:border-neutral-800">
              {colophon.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-3 p-4"
                >
                  <span className="font-lato shrink-0 text-neutral-500">
                    {row.label}
                  </span>
                  <span className="shrink-0 text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
