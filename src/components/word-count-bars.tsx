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

  const stats = [
    {
      key: "academic",
      label: t("wordCountAcademic"),
      value: ACADEMIC_WORD_COUNT,
      valueClassName: "text-neutral-900 dark:text-neutral-100",
    },
    {
      key: "digest",
      label: t("wordCountDigest"),
      value: digestWords,
      valueClassName: "text-[var(--color-accent)]",
    }

  ];

  return (
    <div className="flex flex-col gap-1 text-lg">
      {stats.map((stat) => (
        <div key={stat.key} className="flex flex-row gap-2">
          <span
            className={` ${stat.valueClassName}`}
          >
            {stat.value.toLocaleString(locale)}
          </span>
          <span className="">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
