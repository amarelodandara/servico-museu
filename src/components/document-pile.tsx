"use client";

import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { buttonClass, INTERACTION } from "@/components/ui/button";
import { OverlayPortal } from "@/components/ui/overlay-portal";

export type PileDocument = {
  src: string;
  alt: string;
  /** Shown in the annotation column while the pile is at rest. */
  meta?: ReactNode;
};

const MOTION_MS = 300;

const FLICK_VELOCITY = 0.11;
const SWIPE_DISTANCE = 40;
const FLICK_MIN_DISTANCE = 12;

/**
 * Depth-stacked cyclical carousel of document snapshots, per the pitch: the
 * pile behaves like a carousel but reads as physical sheets with a depth
 * relationship. The slimmer left column annotates the current document's
 * metadata and only appears once pile motion has gone idle, disappearing
 * while the sheets flip. Cards can be expanded to a full-screen view.
 */
export function DocumentPile({ documents }: { documents: PileDocument[] }) {
  const t = useTranslations("DocumentPile");
  const [current, setCurrent] = useState(0);
  const [moving, setMoving] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [everExpanded, setEverExpanded] = useState(false);
  const motionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerStart = useRef<{ x: number; t: number } | null>(null);
  const count = documents.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % count) + count) % count);
      setMoving(true);
      if (motionTimer.current) clearTimeout(motionTimer.current);
      motionTimer.current = setTimeout(() => setMoving(false), MOTION_MS);
    },
    [count],
  );

  useEffect(() => {
    return () => {
      if (motionTimer.current) clearTimeout(motionTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  if (count === 0) return null;
  const doc = documents[current];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={t("label")}
      className="my-8 grid grid-cols-1 gap-4 lg:grid-cols-3"
    >
      {/* Annotation column: metadata only at rest, hidden while flipping. */}
      <div
        aria-hidden={moving}
        className={
          "order-2 flex flex-col justify-end gap-2 text-sm text-neutral-600 transition-opacity duration-300 lg:order-1 dark:text-neutral-400 " +
          (moving ? "opacity-0" : "opacity-100")
        }
      >
        <span className="font-lato text-xs tracking-wide text-neutral-400 uppercase dark:text-neutral-500">
          {t("counter", { current: current + 1, total: count })}
        </span>
        {doc.meta && <div aria-live="polite">{doc.meta}</div>}
      </div>

      <div className="order-1 lg:order-2 lg:col-span-2">
        <div
          className="relative mx-auto w-full max-w-sm touch-pan-y"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") goTo(current + 1);
            if (event.key === "ArrowLeft") goTo(current - 1);
          }}
          onPointerDown={(event) => {
            pointerStart.current = { x: event.clientX, t: performance.now() };
          }}
          onPointerUp={(event) => {
            if (pointerStart.current === null) return;
            const dx = event.clientX - pointerStart.current.x;
            const dt = Math.max(1, performance.now() - pointerStart.current.t);
            pointerStart.current = null;
            const committed =
              Math.abs(dx) >= SWIPE_DISTANCE ||
              (Math.abs(dx) >= FLICK_MIN_DISTANCE &&
                Math.abs(dx) / dt > FLICK_VELOCITY);
            if (!committed) return;
            goTo(dx > 0 ? current - 1 : current + 1);
          }}
        >
          <div className="relative aspect-[1448/2048] w-full">
            {documents.map((item, index) => {
              const offset = (index - current + count) % count;
              const style =
                offset === 0
                  ? "z-30 translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100"
                  : offset === 1
                    ? "z-20 translate-x-3 translate-y-3 rotate-[1.2deg] scale-[0.97] opacity-100"
                    : offset === 2
                      ? "z-10 translate-x-6 translate-y-6 rotate-[-1deg] scale-[0.94] opacity-100"
                      : "z-0 translate-x-6 translate-y-6 scale-[0.94] opacity-0";
              return (
                <button
                  key={item.src}
                  type="button"
                  tabIndex={offset === 0 ? 0 : -1}
                  aria-hidden={offset !== 0}
                  aria-label={t("expand")}
                  onClick={() => {
                    if (offset === 0) {
                      setEverExpanded(true);
                      setExpanded(true);
                    } else goTo(index);
                  }}
                  style={{ transitionDuration: `${MOTION_MS}ms` }}
                  className={
                    "absolute inset-0 cursor-pointer overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-md " +
                    "transition-[transform,opacity] ease-out " +
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] " +
                    "motion-reduce:transition-[opacity] " +
                    "dark:border-neutral-700 " +
                    style
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={offset === 0 ? item.alt : ""}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              aria-label={t("previous")}
              className={buttonClass({ variant: "outline" })}
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              aria-label={t("next")}
              className={buttonClass({ variant: "outline" })}
            >
              →
            </button>
          </div>
        </div>
      </div>

      <OverlayPortal>
        <div
          role="dialog"
          aria-modal="true"
          aria-label={doc.alt}
          data-open={expanded}
          className="overlay-scrim fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black/80 p-4"
          onClick={() => setExpanded(false)}
        >
          {everExpanded && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={doc.src}
              alt={doc.alt}
              data-open={expanded}
              className="overlay-panel max-h-[85vh] w-auto max-w-full rounded-sm bg-white object-contain"
              onClick={(event) => event.stopPropagation()}
            />
          )}
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className={`${INTERACTION} bg-white/90 px-4 py-1.5 font-medium text-neutral-900 hover:bg-white`}
          >
            {t("close")}
          </button>
        </div>
      </OverlayPortal>
    </div>
  );
}
