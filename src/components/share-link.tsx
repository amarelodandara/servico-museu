"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

/**
 * Share action for a page or a specific figure: uses the native share sheet
 * where available, falling back to copying the URL. `hash` targets a
 * heading/figure id so individual viz pieces get their own shareable link.
 * `label` overrides the default verb where the surrounding text needs a
 * fuller call to action (the footer's "share this research").
 *
 * `surface` says what the button is sitting on. The default follows the
 * page into dark mode; `"light"` drops the dark variants for the footer's
 * paper mat, which stays white in either scheme — there, dark-mode styling
 * would put a dark hover fill under dark text.
 */
export function ShareLink({
  hash,
  label,
  surface = "page",
}: {
  hash?: string;
  label?: string;
  surface?: "page" | "light";
}) {
  const t = useTranslations("Share");
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url =
      window.location.origin +
      window.location.pathname +
      (hash ? `#${hash}` : "");
    if (navigator.share) {
      try {
        await navigator.share({ url });
        return;
      } catch {
        // dismissed the sheet — fall through to copy
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={share}
      className={`font-lato w-fit rounded-full border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100 ${
        surface === "page"
          ? "dark:border-neutral-700 dark:hover:bg-neutral-800"
          : ""
      }`}
    >
      {copied ? t("copied") : (label ?? t("share"))}
    </button>
  );
}
