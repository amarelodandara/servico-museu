"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/routing";
import { Link, usePathname } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/button";

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
      className={buttonClass({ variant: "tertiary", size: "sm" })}
    >
      {otherLocale === "en" ? t("switchToEn") : t("switchToPtBR")}
    </Link>
  );
}
