"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/routing";
import { Link, usePathname } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const activeLocale = useLocale() as AppLocale;
  const pathname = usePathname();
  const otherLocale =
    routing.locales.find((locale) => locale !== activeLocale) ??
    routing.defaultLocale;

  return (
    <Link
      href={pathname}
      locale={otherLocale}
      aria-label={t("label")}
      className="font-lato rounded-full border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
    >
      {otherLocale === "en" ? t("switchToEn") : t("switchToPtBR")}
    </Link>
  );
}
