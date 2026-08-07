"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { LabelSwap, SwapLabel } from "@/components/ui/label-swap";

export type BookEntry = {
  title: string;
  author: string;
  year: string;
  /** Printing/translation, e.g. "3rd ed." — shown under the cover instead
   * of the year when known. Omit rather than guess; the year alone is a
   * true citation, a guessed edition isn't. */
  edition?: string;
  /** Publishing house. Omit rather than guess — several entries only have
   * a verified publisher for their original-language edition. */
  publisher?: string;
  /** Which panorama field the work belongs to; picks the cover's accent. */
  field: "museology" | "serviceDesign" | "informationDesign" | "intersection";
  /** Path to a real cover image under public/, once gathered. */
  cover?: string;
};

const FIELD_COLOR: Record<BookEntry["field"], string> = {
  museology: "var(--fig-pink)",
  serviceDesign: "var(--fig-yellow)",
  informationDesign: "var(--fig-magenta)",
  intersection: "var(--fig-ink)",
};

/** Shared height every cover is shown at — width follows each cover's own
 * aspect ratio, like books of different thickness on one shelf. */
const SLOT_HEIGHT = 288;

/** Fixed row height in the list below, so the sliding indicator can move by
 * simple arithmetic instead of measuring the DOM. Titles are truncated to
 * hold to it. */
const ROW_HEIGHT = 44;

/** Same strong ease-in-out as `EASE_IN_OUT` in `lib/ease.ts`, as a CSS
 * value: the indicator is on-screen movement, not an enter/exit. */
const SLIDE_EASE = "cubic-bezier(0.77,0,0.175,1)";

/** Edition, publisher and year, in whatever subset is known — the caption
 * under the cover and the copied citation both build off this. */
function printingDetails(entry: BookEntry): string {
  return [entry.edition, entry.publisher, entry.year]
    .filter(Boolean)
    .join(" · ");
}

function citation(entry: BookEntry): string {
  return `${entry.title} — ${entry.author} (${printingDetails(entry)})`;
}

/**
 * The bibliography as a plate above a list, after the pattern designex.app
 * uses for its feature carousel on narrow screens.
 *
 * It replaces a peek-through stack of covers that had to be dragged. The
 * stack was the more physical object, but it only ever showed one title at
 * a time and hid the shape of the bibliography behind a gesture — you
 * couldn't see how many works there were, what fields they came from, or
 * get to the fifth one without passing the other four. The list puts the
 * whole set on the page and makes the covers the reward for choosing, which
 * is the right way round for something whose job is "here is what we read".
 *
 * Every cover stays mounted and crossfades on opacity, so switching is
 * interruptible — clicking through the list quickly retargets mid-fade
 * instead of restarting. Inactive covers are hidden from assistive tech and
 * from the pointer, so only the one on show is ever reachable.
 */
export function BookCarousel({ books }: { books: BookEntry[] }) {
  const t = useTranslations("BookCarousel");
  const [current, setCurrent] = useState(0);
  const [copiedAll, setCopiedAll] = useState(false);

  if (books.length === 0) return null;
  const book = books[current];

  const copyAll = async () => {
    await navigator.clipboard.writeText(books.map(citation).join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={t("label")}
      className="my-8 flex flex-col items-center gap-6"
    >
      {/* Fixed height so choosing a taller or wider book doesn't reflow the
          list underneath it — the covers are genuinely different shapes. */}
      <div
        className="relative flex w-full items-center justify-center"
        style={{ height: SLOT_HEIGHT }}
      >
        {books.map((entry, index) => {
          const active = index === current;

          return (
            <div
              key={entry.title}
              aria-hidden={!active}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-out ${
                active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {entry.cover ? (
                // Natural width, no crop: each cover keeps its own printed
                // proportions and orientation instead of being forced into
                // a uniform 2:3 frame.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={entry.cover}
                  alt={`${entry.title} — ${entry.author}`}
                  className="h-full w-auto rounded-md"
                  style={{ boxShadow: "var(--shadow-float)" }}
                  loading="lazy"
                  draggable={false}
                />
              ) : (
                <div
                  className="flex h-full flex-col overflow-hidden rounded-md bg-[var(--fig-card)] text-neutral-900"
                  style={{
                    width: SLOT_HEIGHT * (2 / 3),
                    boxShadow: "var(--shadow-float)",
                  }}
                >
                  <div
                    aria-hidden="true"
                    className="h-8 shrink-0"
                    style={{ backgroundColor: FIELD_COLOR[entry.field] }}
                  />
                  <div className="flex flex-1 flex-col justify-between p-3">
                    <span className="text-sm leading-snug font-bold text-balance">
                      {entry.title}
                    </span>
                    <span className="font-lato text-xs text-neutral-500">
                      {entry.author}
                      <br />
                      {entry.year}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* The one line that changes with the plate. Author now lives on the
          row below (see the list), so this carries whatever else is known
          about the printing instead — edition and publisher where they've
          been verified, falling back to the year alone rather than guess
          at the rest. */}
      <p
        aria-live="polite"
        className="font-lato text-sm text-neutral-500 dark:text-neutral-400"
      >
        {printingDetails(book)}
      </p>

      {/* `relative` roots the sliding indicator below; each row holds to
          `ROW_HEIGHT` so the indicator's offset is index * ROW_HEIGHT,
          no measuring required. */}
      <ul className="relative flex w-full flex-col">
        {/* The one moving piece — an ease-in-out slide between rows rather
            than each row snapping its own border colour on and off. Sits
            above the static neutral tracks painted by every row's own
            border-l. */}
        <div
          aria-hidden="true"
          className="absolute left-0 z-10 w-0.5 bg-[var(--accent)] transition-transform duration-200"
          style={{
            height: ROW_HEIGHT,
            transform: `translateY(${current * ROW_HEIGHT}px)`,
            transitionTimingFunction: SLIDE_EASE,
          }}
        />

        {books.map((entry, index) => {
          const active = index === current;

          return (
            <li key={entry.title}>
              <button
                type="button"
                aria-current={active}
                onClick={() => setCurrent(index)}
                style={{ height: ROW_HEIGHT }}
                className="flex w-full items-center justify-between gap-4 border-l-2 border-neutral-200 pl-4 text-left hover:border-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] dark:border-neutral-800 dark:hover:border-neutral-600"
              >
                <span
                  className={`min-w-0 flex-1 truncate ${
                    active ? "font-medium text-[var(--accent)]" : ""
                  }`}
                >
                  {entry.title}
                  {/* Field stays available to assistive tech even though
                      the visual chip was dropped — the cover's coloured
                      top bar is the sighted equivalent, and only carries
                      that cue when there's no photographed cover to show
                      instead. */}
                  <span className="sr-only">
                    {" "}
                    — {t(`field_${entry.field}`)}
                  </span>
                </span>

                <span className="font-lato shrink-0 truncate text-xs text-neutral-500 dark:text-neutral-400">
                  {entry.author}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* `quiet` — text only, no raised plate or shadow; this is a small
          utility action, not a call to action. `self-end` breaks it out of
          the plate's centred column so it sits at the list's own edge.
          `whitespace-nowrap` plus a fixed-width icon slot keep it one line
          across both idle and copied labels. */}
      <button
        type="button"
        onClick={copyAll}
        className={buttonClass({
          variant: "tertiary",
          className: "flex items-center gap-1.5 self-end whitespace-nowrap",
        })}
      >
        <LabelSwap>
          <SwapLabel visible={!copiedAll}>
            <svg
              viewBox="0 0 16 16"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
              <path d="M3.5 10.5V4.5a1 1 0 0 1 1-1h6" />
            </svg>
          </SwapLabel>
          <SwapLabel visible={copiedAll}>
            <svg
              viewBox="0 0 16 16"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3.5 8.5l3 3 6-7" />
            </svg>
          </SwapLabel>
        </LabelSwap>

        <LabelSwap>
          <SwapLabel visible={!copiedAll}>{t("copyAll")}</SwapLabel>
          <SwapLabel visible={copiedAll}>{t("listCopied")}</SwapLabel>
        </LabelSwap>
      </button>
    </div>
  );
}
