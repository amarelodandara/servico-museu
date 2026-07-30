import { useTranslations } from "next-intl";

/**
 * Coded rebuild of TCC Figura 4 — the work schedule for Jul–Dez 2026.
 * Six month columns; task cards positioned by month fractions (0 = start
 * of July, 6 = end of December) with a top border in their phase's color,
 * mirroring the source's card-with-colored-edge treatment. Milestones are
 * dotted verticals. Direct labels everywhere; the legend restates phases.
 */
const MONTH_KEYS = ["jul", "aug", "sep", "oct", "nov", "dec"] as const;

const PHASES = [
  { key: "discovery", color: "var(--fig-pink)" },
  { key: "ideation", color: "var(--fig-yellow)" },
  { key: "prototyping", color: "var(--fig-ink)" },
  { key: "delivery", color: "var(--fig-magenta)" },
] as const;

type PhaseKey = (typeof PHASES)[number]["key"];

const TASKS: { key: string; phase: PhaseKey; start: number; end: number; row: number }[] = [
  { key: "deskResearch", phase: "discovery", start: 0.1, end: 1.3, row: 0 },
  { key: "fieldPlanning", phase: "discovery", start: 0.5, end: 1.7, row: 1 },
  { key: "fieldExecution", phase: "discovery", start: 1.0, end: 2.6, row: 2 },
  { key: "dataAnalysis", phase: "discovery", start: 1.7, end: 2.8, row: 3 },
  { key: "alternatives", phase: "ideation", start: 2.2, end: 3.4, row: 4 },
  { key: "prototype", phase: "prototyping", start: 3.4, end: 4.6, row: 5 },
  { key: "dossierReview", phase: "prototyping", start: 4.6, end: 5.6, row: 6 },
  { key: "presentation", phase: "delivery", start: 4.4, end: 5.7, row: 7 },
];

const MILESTONES: { key: string; at: number; color?: string }[] = [
  { key: "vacation", at: 0.35 },
  { key: "alternativeSelection", at: 3.4 },
  { key: "finalDelivery", at: 5.75, color: "var(--fig-magenta)" },
];

const ROW_HEIGHT = 3.25; // rem per task row
const HEADER_REM = 2.25;

export function Cronograma() {
  const t = useTranslations("Cronograma");
  const phaseColor = Object.fromEntries(PHASES.map((p) => [p.key, p.color]));
  const bodyHeight = TASKS.length * ROW_HEIGHT + 1;

  return (
    <figure className="my-8">
      {/* Legend restating the phase → color mapping. */}
      <ul className="font-lato mb-3 flex flex-wrap gap-x-5 gap-y-1 text-xs">
        {PHASES.map((phase) => (
          <li key={phase.key} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-xs"
              style={{ backgroundColor: phase.color }}
            />
            {t(`phase_${phase.key}`)}
          </li>
        ))}
      </ul>

      <div className="overflow-x-auto">
        <div
          className="relative min-w-[640px] border border-[var(--fig-grid)]"
          style={{ height: `${HEADER_REM + bodyHeight}rem` }}
        >
          {/* Month columns */}
          {MONTH_KEYS.map((month, index) => (
            <div
              key={month}
              className="absolute top-0 bottom-0 border-l border-[var(--fig-grid)] first:border-l-0"
              style={{ left: `${(index / 6) * 100}%`, width: `${100 / 6}%` }}
            >
              <span className="font-lato block px-2 pt-1.5 text-xs tracking-wide text-neutral-500 uppercase">
                {t(`month_${month}`)}
              </span>
            </div>
          ))}

          {/* Milestones: dotted verticals with a label at the bottom. */}
          {MILESTONES.map((milestone) => (
            <div
              key={milestone.key}
              className="absolute bottom-1"
              style={{
                left: `${(milestone.at / 6) * 100}%`,
                top: `${HEADER_REM}rem`,
              }}
            >
              <span
                aria-hidden="true"
                className="absolute top-0 bottom-5 border-l border-dotted"
                style={{ borderColor: milestone.color ?? "var(--fig-ink)" }}
              />
              <span
                className="font-lato absolute bottom-0 -translate-x-1/2 text-[0.65rem] font-semibold whitespace-nowrap"
                style={{ color: milestone.color ?? "inherit" }}
              >
                {t(`milestone_${milestone.key}`)}
              </span>
            </div>
          ))}

          {/* Task cards */}
          {TASKS.map((task) => (
            <div
              key={task.key}
              className="absolute rounded-sm border border-[var(--fig-grid)] bg-[var(--fig-card)] px-2 py-1 shadow-xs"
              style={{
                left: `${(task.start / 6) * 100}%`,
                width: `${((task.end - task.start) / 6) * 100}%`,
                top: `${HEADER_REM + task.row * ROW_HEIGHT}rem`,
                borderTop: `3px solid ${phaseColor[task.phase]}`,
              }}
            >
              <span className="font-lato block text-[0.7rem] leading-tight">
                {t(`task_${task.key}`)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <figcaption className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
        {t("caption")} <span className="text-neutral-400">{t("source")}</span>
      </figcaption>
    </figure>
  );
}
