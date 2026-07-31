"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  animate,
  type MotionValue,
} from "motion/react";

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

/** Shared height every cover sits at — width follows each cover's own
 * aspect ratio, like books of different thickness on one shelf. */
const SLOT_HEIGHT = 288;
/** Drag distance (px) worth one full step to the next/previous book. */
const STEP = 220;
/**
 * How far a recessed neighbor peeks out from behind the front cover (px).
 * Covers aren't a uniform width (real photographed jackets range from
 * ~190px to ~420px wide at SLOT_HEIGHT) — this has to clear roughly half
 * the widest cover's width, or a wide book in front fully hides its
 * neighbors instead of overlapping them.
 */
const PEEK = 150;
/** Momentum: release velocity feeds into the spring's starting velocity,
 * so a flick keeps carrying rather than the settle starting from rest. */
const SPRING = { type: "spring" as const, duration: 0.35, bounce: 0.15 };
/** Pointer travel (px) past which a gesture counts as a drag, not a tap. */
const DRAG_THRESHOLD = 6;

function BookCover({
  entry,
  index,
  current,
  count,
  x,
  onSelect,
}: {
  entry: BookEntry;
  index: number;
  current: number;
  count: number;
  x: MotionValue<number>;
  onSelect: (index: number) => void;
}) {
  // Continuous, signed distance from the front slot — in whole-book units,
  // not px — combining the settled `current` with the live drag value so
  // it updates every drag frame without a React re-render.
  const offset = useTransform(x, (v) => {
    let raw = index - current + v / STEP;
    // Shortest way around the (circular) shelf, so a book never has to
    // travel the long way past the others to reach the front.
    raw = ((raw + count / 2) % count) - count / 2;
    return raw;
  });
  const absOffset = useTransform(offset, (o) => Math.abs(o));
  // Composed into one `transform` string rather than Framer's `x`/`scale`
  // shorthand style props, which run their writes via requestAnimationFrame
  // on the main thread instead of a GPU-composited `transform`.
  const transform = useTransform([offset, absOffset], (latest) => {
    const [o, abs] = latest as [number, number];
    const scale = Math.max(0.82, 1 - abs * 0.12);
    return `translateX(${o * PEEK}px) scale(${scale})`;
  });
  const opacity = useTransform(absOffset, [2, 2.4], [1, 0], { clamp: true });
  const dim = useTransform(absOffset, (o) => Math.min(0.5, o * 0.32));
  const zIndex = useTransform(absOffset, (o) => Math.round(100 - o * 10));

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.button
        type="button"
        aria-label={entry.title}
        aria-current={index === current}
        onClick={() => onSelect(index)}
        className="cursor-pointer overflow-hidden rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        style={{
          height: SLOT_HEIGHT,
          width: entry.cover ? "auto" : SLOT_HEIGHT * (2 / 3),
          transform,
          opacity,
          zIndex,
        }}
      >
        {entry.cover ? (
          // Natural width, no crop: each cover keeps its own printed
          // proportions and orientation instead of being forced into a
          // uniform 2:3 frame.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={entry.cover}
            alt={`${entry.title} — ${entry.author}`}
            className="h-full w-auto"
            loading="lazy"
            draggable={false}
          />
        ) : (
          <div className="flex h-full flex-col bg-[var(--fig-card)] text-neutral-900">
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

        {/* Recessed books sit a little in the front cover's shadow — a
            dark scrim that deepens with distance is the one depth cue
            here. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ opacity: dim }}
        />
        {/* A faint top sheen on the front cover only, confined to its
            upper third. */}
        {index === current && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/12 to-transparent"
          />
        )}
      </motion.button>
    </div>
  );
}

/**
 * A physical shelf, not a slideshow: the front cover sits centered, and its
 * neighbors are always rendered right behind it, peeking out from either
 * edge — `BookCover`'s scale/scrim/z-index all derive from one shared
 * `offset`, so the stack reads as one continuous depth relationship.
 *
 * Dragging is tracked with plain pointer events (`onPointerDown/Move/Up`),
 * the same pattern `DocumentPile` already uses, rather than `motion/react`'s
 * `drag` gesture: `drag` insists on visually moving whatever DOM node it's
 * attached to, which meant either the whole stack sliding as one rigid
 * block, or — once that was fixed with an invisible capture layer — that
 * layer sitting on top and swallowing clicks meant for the books
 * underneath. Plain pointer events don't have that conflict: each book is
 * a normal `<button>`, native click semantics already tell a tap from a
 * drag apart (no click fires if the pointer moved between down and up), so
 * clicking any visible book brings it to the front, and dragging the shelf
 * still carries momentum into the settle spring the same way.
 */
export function BookCarousel({ books }: { books: BookEntry[] }) {
  const t = useTranslations("BookCarousel");
  const [current, setCurrent] = useState(0);
  const x = useMotionValue(0);
  const count = books.length;
  const reduceMotion = useReducedMotion();
  const drag = useRef<{
    pointerId: number;
    startX: number;
    lastX: number;
    lastT: number;
    velocity: number;
    captured: boolean;
  } | null>(null);

  const settle = (targetIndex: number, velocity = 0) => {
    const next = ((targetIndex % count) + count) % count;
    const delta = next - current;
    // Keep dragging in whichever direction is already shorter, same
    // shortest-path rule `BookCover` uses for its own offset.
    const shortest = ((delta + count / 2) % count) - count / 2;
    const transition = reduceMotion
      ? { type: "tween" as const, duration: 0 }
      : { ...SPRING, velocity };
    animate(x, x.get() - shortest * STEP, transition).then(() => {
      setCurrent(next);
      x.set(0);
    });
  };

  if (count === 0) return null;
  const book = books[current];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={t("label")}
      className="my-8 flex flex-col items-center"
    >
      <div
        className="relative w-full max-w-sm touch-pan-y select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
        style={{ height: SLOT_HEIGHT }}
        tabIndex={0}
        onPointerDown={(event) => {
          if (drag.current) return;
          drag.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            lastX: event.clientX,
            lastT: performance.now(),
            velocity: 0,
            captured: false,
          };
        }}
        onPointerMove={(event) => {
          if (!drag.current || event.pointerId !== drag.current.pointerId)
            return;
          const now = performance.now();
          const dt = Math.max(1, now - drag.current.lastT);
          drag.current.velocity =
            ((event.clientX - drag.current.lastX) / dt) * 1000;
          x.set(x.get() + (event.clientX - drag.current.lastX));
          drag.current.lastX = event.clientX;
          drag.current.lastT = now;

          if (
            !drag.current.captured &&
            Math.abs(event.clientX - drag.current.startX) > DRAG_THRESHOLD
          ) {
            event.currentTarget.setPointerCapture(event.pointerId);
            drag.current.captured = true;
          }
        }}
        onPointerUp={(event) => {
          if (!drag.current || event.pointerId !== drag.current.pointerId)
            return;
          const { velocity, captured } = drag.current;
          drag.current = null;
          if (captured)
            event.currentTarget.releasePointerCapture(event.pointerId);
          // Project a little further in the flick's direction so a fast,
          // short drag can still carry past the next book, not just the
          // one under the pointer when it was released.
          const projected = x.get() + velocity * 0.15;
          const steps = Math.round(-projected / STEP);
          settle(current + steps, velocity);
        }}
        onPointerCancel={(event) => {
          if (!drag.current || event.pointerId !== drag.current.pointerId)
            return;
          drag.current = null;
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") settle(current + 1);
          if (event.key === "ArrowLeft") settle(current - 1);
        }}
      >
        {books.map((entry, index) => (
          <BookCover
            key={entry.title}
            entry={entry}
            index={index}
            current={current}
            count={count}
            x={x}
            onSelect={settle}
          />
        ))}
      </div>

      {/* Metadata sits below the shelf — the digest's reading column is
          too slim for a side-by-side annotation panel. */}
      <div className="mt-4 flex flex-col items-center gap-1 text-center">
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
          {book.title}
        </span>
        <span className="font-lato text-sm text-neutral-500 dark:text-neutral-400">
          {book.author} · {book.year}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        {books.map((entry, index) => (
          <button
            key={entry.title}
            type="button"
            aria-label={entry.title}
            aria-current={index === current}
            onClick={() => settle(index)}
            className={
              "h-1.5 w-1.5 rounded-full transition-colors duration-150 ease-out " +
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] " +
              (index === current
                ? "bg-[var(--color-accent)]"
                : "bg-neutral-300 dark:bg-neutral-700")
            }
          />
        ))}
      </div>
    </div>
  );
}
