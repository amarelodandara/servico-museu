import { useTranslations } from "next-intl";

type Span = { from: number; to: number };

/** Theoretical research, drawn as a span rather than two separate points —
 * its own start and end already say how long it runs; the label just sits
 * at the midpoint. */
const THEORY_SPAN: Span = { from: 0, to: 4.5 / 12 };

/** The one span drawn in the accent — field research is the most
 * important thing this timeline says, everything else stays grey. */
const FIELD_SPAN: Span = { from: 6 / 12, to: 9 / 12 };

/** Unlabelled dividers at the quarter boundaries — obviously trimester
 * zones once the line is broken up, so they don't need their own text. */
const QUARTER_LINES = [0.25, 0.5, 0.75];

const DEFENSE_AT = 1;

/** Same wash the sidenote rule casts under its text — a hairline anchor at
 * top, colour bleeding out downward — reused here with `currentColor` so
 * each span's shadow matches its own label instead of the sidenote's fixed
 * blue tint. */
function SpanShadow({
  span,
  className,
}: {
  span: Span;
  className: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute -top-4 h-9 ${className}`}
      style={{
        left: `${span.from * 100}%`,
        width: `${(span.to - span.from) * 100}%`,
        backgroundImage:
          "linear-gradient(to bottom, color-mix(in oklab, currentColor 10%, transparent) 0%, transparent 100%)",
      }}
    />
  );
}

/**
 * The research schedule as a single year read left to right, rather than as
 * a list of dates.
 *
 * Drawn in one `<svg>` instead of a pile of absolutely-positioned divs: a
 * baseline, two spans and an end point are all just lines on one
 * coordinate system, without each mark needing its own
 * `-translate-x-1/2 -translate-y-1/2` to center itself. Every stroke uses
 * `vector-effect="non-scaling-stroke"` because the viewBox scales
 * horizontally with the container's width but not vertically — without it,
 * a wide aside would smear every hairline sideways. The "dots" (the
 * defense point) are zero-length round-capped lines rather than circles
 * for the same reason: a `<circle>`'s radius would distort under that same
 * non-uniform scale, a stroke's width doesn't. The baseline is dashed down
 * to dots (`strokeDasharray="0 4"`) so the stretches with no research
 * planned read as visibly empty next to the solid spans that do.
 *
 * Text stays HTML, laid over the SVG rather than in it: labels are
 * different lengths in each language, and SVG `<text>` doesn't wrap —
 * `whitespace-nowrap` here is a CSS problem, not a drawing one.
 *
 * Deliberately not the digest's `Cronograma`: that's a full Gantt of eight
 * tasks across six columns, built to be studied. This is context for a
 * decision someone is making about whether to take part, and wants to be
 * readable in about a second.
 */
export function ResearchTimeline() {
  const t = useTranslations("Cta");
  const fieldMid = ((FIELD_SPAN.from + FIELD_SPAN.to) / 2) * 100;

  return (
    // `font-lato`: sans, and self-contained rather than borrowed from a
    // `font-lato` on some ancestor — the labels shouldn't go serif just
    // because a parent's classes changed.
    <figure className="font-lato m-0">
      <figcaption className="sr-only">
        {t("timelineTitle")} — {t("timelineYearStart")}–{t("timelineYearEnd")}{" "}
        {t("timelineYear")}
      </figcaption>

      <div className="relative pb-6">
        {/* Right against the line, in the same grey as the baseline — this
            is context for reading the line, not a heading of its own.
            `leading-none` matters as much as the margin: default line
            height was most of the remaining gap. */}
        <div className="mb-0.5 flex justify-between text-[0.625rem] leading-none text-neutral-400 dark:text-neutral-600">
          <span>{t("timelineYearStart")}</span>
          <span>{t("timelineYearEnd")}</span>
        </div>

        <svg
          aria-hidden="true"
          viewBox="0 0 100 16"
          preserveAspectRatio="none"
          className="block h-4 w-full overflow-visible"
        >
          {/* The baseline: thin, grey and dashed to dots — the least
              important line here, and now visibly "nothing planned" next to
              the solid spans drawn on top of it. */}
          <line
            x1="0"
            y1="8"
            x2="100"
            y2="8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="0 4"
            vectorEffect="non-scaling-stroke"
            className="stroke-neutral-400 dark:stroke-neutral-600"
          />

          {QUARTER_LINES.map((at) => (
            <line
              key={at}
              x1={at * 100}
              y1="5"
              x2={at * 100}
              y2="11"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              className="stroke-neutral-300 dark:stroke-neutral-700"
            />
          ))}

          <line
            x1={THEORY_SPAN.from * 100}
            y1="8"
            x2={THEORY_SPAN.to * 100}
            y2="8"
            strokeWidth="4"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="stroke-neutral-400 dark:stroke-neutral-500"
          />

          <line
            x1={FIELD_SPAN.from * 100}
            y1="8"
            x2={FIELD_SPAN.to * 100}
            y2="8"
            stroke="var(--accent)"
            strokeWidth="4"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          <line
            x1={DEFENSE_AT * 100}
            y1="8"
            x2={DEFENSE_AT * 100}
            y2="8"
            strokeWidth="5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="stroke-neutral-400 dark:stroke-neutral-500"
          />
        </svg>

        <div className="relative mt-2 text-xs">
          <SpanShadow
            span={THEORY_SPAN}
            className="text-neutral-400 dark:text-neutral-500"
          />
          <SpanShadow
            span={FIELD_SPAN}
            className="text-[var(--accent)]"
          />

          <span
            className="absolute top-0 -translate-x-1/2 text-neutral-500 whitespace-nowrap dark:text-neutral-400"
            style={{ left: `${((THEORY_SPAN.from + THEORY_SPAN.to) / 2) * 100}%` }}
          >
            {t("timelineTheoryLabel")}
          </span>

          <span
            className="absolute top-0 -translate-x-1/2 font-medium whitespace-nowrap text-[var(--accent)]"
            style={{ left: `${fieldMid}%` }}
          >
            {t("timelineFieldLabel")}
          </span>

          <span
            className="absolute top-0 text-right whitespace-nowrap text-neutral-500 dark:text-neutral-400"
            style={{ right: `${(1 - DEFENSE_AT) * 100}%` }}
          >
            {t("timelineFinalDefenseLabel")}
          </span>
        </div>
      </div>
    </figure>
  );
}
