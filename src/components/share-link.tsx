"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { LabelSwap, SwapLabel } from "@/components/ui/label-swap";

/**
 * Share action for a page or a specific figure: uses the native share sheet
 * where available, falling back to copying the URL. `hash` targets a
 * heading/figure id so individual viz pieces get their own shareable link.
 * One copy everywhere it appears — no `label` override — so it reads as
 * the same action wherever it shows up.
 *
 * `surface` says what the button is sitting on. The default follows the
 * page into dark mode; `"light"` drops the dark variants for the footer's
 * paper mat, which stays white in either scheme — there, dark-mode styling
 * would put a dark hover fill under dark text.
 */
export function ShareLink({
  hash,
  surface = "page",
}: {
  hash?: string;
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

  const idle = t("share");

  return (
    <button
      type="button"
      onClick={share}
      className={buttonClass({
        variant: "primary",
        surface,
        className: "w-fit",
      })}
    >
      <LabelSwap>
        <SwapLabel visible={!copied}>{idle}</SwapLabel>
        <SwapLabel visible={copied}>{t("copied")}</SwapLabel>
      </LabelSwap>
    </button>
  );
}
