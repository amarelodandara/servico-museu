"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ScrollLink } from "@/components/scroll-link";
import { buttonClass } from "@/components/ui/button";

/** How long a reader stays before the invitation is offered. */
const DELAY_MS = 60_000;

/** Where the invitation sends them. Owned by `InstitutionCta`. */
const TARGET_ID = "colaborar";

/**
 * Per tab, not per browser: a reader who comes back tomorrow is a different
 * visit and can be asked again, but one who switches language mid-read has
 * not earned a second interruption.
 */
const SEEN_KEY = "nudge-seen";

/**
 * A minute in, an invitation to take part appears in the top corner of the
 * landing section; taking it up scrolls to the form at the foot of the page
 * and leaves a way back.
 *
 * The delay is the whole point. Asking on arrival asks someone who has not
 * yet read what they would be agreeing to; a minute is long enough that
 * anyone still here is reading rather than passing through, which is the
 * only population worth interrupting.
 *
 * Both pieces live in one component because they are two halves of one
 * gesture — the return button exists precisely because the invitation moved
 * the reader — and sharing plain state is simpler and more honest than
 * putting a context between them.
 */
export function CollaborateNudge() {
  const t = useTranslations("Nudge");
  const [open, setOpen] = useState(false);
  const [travelled, setTravelled] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;
    const timer = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  /* Seen is seen, however it left the screen — taken up or waved off. */
  const close = () => {
    setOpen(false);
    sessionStorage.setItem(SEEN_KEY, "1");
  };

  const accept = () => {
    close();
    setTravelled(true);
  };

  const backToTop = () => {
    setTravelled(false);
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <>
      {/*
        Anchored to the landing section's own top-right corner rather than
        fixed to the viewport: this is an aside to the opening, and pinning
        it to the screen would have it follow a reader down through the
        whole digest, which is a different and far more insistent thing.

        `role="status"` so it is announced when it arrives — it appears
        without anyone asking, so silence would leave screen-reader users
        with a focusable control that materialised unannounced.
      */}
      <aside
        aria-label={t("label")}
        role="status"
        data-open={open}
        style={{ "--popover-origin": "top right" } as React.CSSProperties}
        className="overlay-popover absolute top-4 right-0 z-20 w-72 rounded-2xl bg-[var(--background-end)] p-5 text-left shadow-[var(--shadow-float)]"
      >
        <p className="text-lg tracking-tight text-balance">{t("title")}</p>
        <p className="font-lato mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          {t("body")}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <ScrollLink
            targetId={TARGET_ID}
            onNavigate={accept}
            className={buttonClass({ variant: "primary" })}
          >
            {t("cta")}
          </ScrollLink>
          <button
            type="button"
            onClick={close}
            className={buttonClass({ variant: "tertiary" })}
          >
            {t("dismiss")}
          </button>
        </div>
      </aside>

      {/*
        The way back. Fixed, because by the time it matters the reader is at
        the other end of the document — and only ever shown to someone this
        component sent there, so it is a return ticket rather than a general
        scroll-to-top affordance.
      */}
      <button
        type="button"
        onClick={backToTop}
        data-open={travelled}
        className={buttonClass({
          variant: "secondary",
          className:
            "overlay-popover fixed right-6 bottom-6 z-40 shadow-[var(--shadow-float)]",
        })}
      >
        {t("backToTop")}
      </button>
    </>
  );
}
