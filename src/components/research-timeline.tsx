import { useTranslations } from "next-intl";

type Phase = { key: string; label: string; span: string };

/**
 * Where each phase sits on the year, as fractions of it. One source of
 * truth for the bar, the tick and the label, so a phase can't be drawn in
 * one place and described in another.
 */
const EXTENT: Record<string, { from: number; to: number }> = {
  theory: { from: 0, to: 6 / 12 },
  field: { from: 6 / 12, to: 9 / 12 },
  publication: { from: 11 / 12, to: 1 },
};

/** The one phase drawn in the accent; the rest are hairline neutrals. */
const HIGHLIGHT = "field";

/**
 * The research schedule as a single year read left to right, rather than as
 * a list of dates.
 *
 * A list makes the reader assemble the shape themselves — four rows of
 * month ranges that have to be held in the head to see that field work is
 * the short, dense part in the middle. Drawn on one line, that shape is the
 * first thing visible and the dates become the detail underneath it.
 *
 * Deliberately not the digest's `Cronograma`: that's a full Gantt of eight
 * tasks across six columns, built to be studied. This is context for a
 * decision someone is making about whether to take part, and wants to be
 * readable in about a second.
 */
export function ResearchTimeline() {
  const t = useTranslations("Cta");
  const phases = t.raw("timelinePhases") as Phase[];

  return (
    <figure className="m-0 flex flex-col gap-3">
      <figcaption className="sr-only">
        {t("timelineTitle")} — {t("timelineYear")}
      </figcaption>

      {/* The line itself. `h-1.5` on the track with the segments filling it
          means the highlighted phase reads as a thicker passage of the same
          line rather than as a separate object sitting on top of it. */}
      <div
        className="relative h-1.5 w-full rounded-full bg-[var(--rule-blue)]/25"
        aria-hidden="true"
      >
        {phases.map((phase) => {
          const extent = EXTENT[phase.key];
          if (!extent) return null;
          const highlighted = phase.key === HIGHLIGHT;

          return (
            <span
              key={phase.key}
              className={`absolute inset-y-0 rounded-full ${
                highlighted
                  ? "bg-[var(--color-accent)]"
                  : "bg-[var(--rule-blue)]"
              }`}
              style={{
                left: `${extent.from * 100}%`,
                width: `${(extent.to - extent.from) * 100}%`,
              }}
            />
          );
        })}
      </div>

      {/*
        Labels sit under the span they describe, anchored by the same
        fractions the bar uses. The last one is right-aligned against the
        end of the year rather than left-aligned at its own start, so a
        phase that finishes the line doesn't push its label off the edge.
      */}
      <ol className="relative h-10 w-full list-none p-0 text-xs">
        {phases.map((phase, index) => {
          const extent = EXTENT[phase.key];
          if (!extent) return null;
          const last = index === phases.length - 1;

          return (
            <li
              key={phase.key}
              className={`absolute top-0 flex flex-col ${
                last ? "items-end text-right" : "items-start text-left"
              }`}
              style={
                last
                  ? { right: `${(1 - extent.to) * 100}%` }
                  : { left: `${extent.from * 100}%` }
              }
            >
              <span
                className={
                  phase.key === HIGHLIGHT
                    ? "font-medium text-[var(--color-accent)]"
                    : ""
                }
              >
                {phase.label}
              </span>
              <span className="font-inter text-neutral-500 dark:text-neutral-400">
                {phase.span}
              </span>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
