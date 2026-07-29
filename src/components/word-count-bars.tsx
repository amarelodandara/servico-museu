import { getLocale, getTranslations } from "next-intl/server";
import { getDigestWordCount } from "@/lib/word-count";
import type { AppLocale } from "@/i18n/routing";

// The TCC pre-project is a fixed, already-submitted PDF — its word count
// doesn't move the way the digest's does, so it isn't computed dynamically.
const ACADEMIC_WORD_COUNT = 7000;

export async function WordCountBars() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Digest");
  const digestWords = getDigestWordCount(locale);
  const max = Math.max(digestWords, ACADEMIC_WORD_COUNT);

  const bars = [
    {
      key: "digest",
      label: t("wordCountDigest"),
      value: digestWords,
      color: "var(--series-1)",
    },
    {
      key: "academic",
      label: t("wordCountAcademic"),
      value: ACADEMIC_WORD_COUNT,
      color: "var(--series-2)",
    },
  ];

  return (
    <figure className="not-prose flex flex-col gap-2 py-2">
      <div className="flex flex-col gap-2.5">
        {bars.map((bar) => (
          <div key={bar.key} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-sm text-neutral-600 dark:text-neutral-400">
              {bar.label}
            </span>
            <div
              className="h-2.5 flex-1 bg-neutral-100 dark:bg-neutral-900"
              title={`${bar.label}: ${bar.value.toLocaleString(locale)}`}
            >
              <div
                className="h-full"
                style={{
                  width: `${(bar.value / max) * 100}%`,
                  backgroundColor: bar.color,
                  borderRadius: "0 4px 4px 0",
                }}
              />
            </div>
            <span className="w-16 shrink-0 text-right text-sm font-medium tabular-nums">
              {bar.value.toLocaleString(locale)}
            </span>
          </div>
        ))}
      </div>
      <figcaption className="text-xs text-neutral-500">
        {t("wordCountCaption")}
      </figcaption>
    </figure>
  );
}
