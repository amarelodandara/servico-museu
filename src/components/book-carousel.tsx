"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export type BookEntry = {
  title: string;
  author: string;
  year: string;
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

  if (books.length === 0) return null;
  const book = books[current];

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

      {/* The one line that changes with the plate. Title and field live in
          the list below, so repeating them here would say everything
          twice. */}
      <p
        aria-live="polite"
        className="font-lato text-sm text-neutral-500 dark:text-neutral-400"
      >
        {book.author} · {book.year}
      </p>

      <ul className="flex w-full flex-col">
        {books.map((entry, index) => {
          const active = index === current;

          return (
            <li key={entry.title}>
              <button
                type="button"
                aria-current={active}
                onClick={() => setCurrent(index)}
                className={`flex w-full items-baseline justify-between gap-4 border-l-2 py-2.5 pl-4 text-left transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
                  active
                    ? "border-[var(--color-accent)]"
                    : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
                }`}
              >
                <span
                  className={
                    active ? "font-medium text-[var(--color-accent)]" : ""
                  }
                >
                  {entry.title}
                </span>

                {/* Direct-labelled, with the field's colour as a second,
                    redundant cue rather than the only one. */}
                <span className="font-lato flex shrink-0 items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: FIELD_COLOR[entry.field] }}
                  />
                  {t(`field_${entry.field}`)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
