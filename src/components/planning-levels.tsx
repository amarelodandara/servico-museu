import { useTranslations } from "next-intl";

/**
 * Coded rebuild of TCC Figura 2 — "Esquematização dos três níveis de
 * planejamento". Reproduces the source's structure: a colored label chip
 * connected by a line-and-dot to an outlined description box, one row per
 * level, keeping the IBRAM black/yellow/pink coding (via --fig-* tokens).
 */
const LEVELS = [
  { key: "strategic", color: "var(--fig-ink)" },
  { key: "tactical", color: "var(--fig-yellow)" },
  { key: "operational", color: "var(--fig-magenta)" },
] as const;

export function PlanningLevels() {
  const t = useTranslations("PlanningLevels");

  return (
    <figure className="my-8">
      <div className="flex flex-col gap-4" role="list">
        {LEVELS.map((level) => (
          <div
            key={level.key}
            role="listitem"
            className="flex items-center gap-0"
          >
            <span
              className="font-lato w-36 shrink-0 px-3 py-2 text-center text-sm font-bold tracking-wide uppercase"
              style={{
                backgroundColor: level.color,
                color: "var(--fig-card)",
              }}
            >
              {t(`${level.key}Label`)}
            </span>
            <span
              aria-hidden="true"
              className="relative h-0.5 min-w-6 flex-1"
              style={{ backgroundColor: level.color }}
            >
              <span
                className="absolute top-1/2 right-0 h-2.5 w-2.5 -translate-y-1/2 rounded-full"
                style={{ backgroundColor: level.color }}
              />
            </span>
            <span
              className="w-1/2 shrink-0 border-2 px-3 py-2 text-center text-sm"
              style={{
                borderColor: level.color,
                backgroundColor: "var(--fig-card)",
              }}
            >
              {t(`${level.key}Description`)}
            </span>
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
        {t("caption")} <span className="text-neutral-400">{t("source")}</span>
      </figcaption>
    </figure>
  );
}
