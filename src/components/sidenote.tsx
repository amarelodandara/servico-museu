"use client";

import { useTranslations } from "next-intl";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const SidenoteCounterContext = createContext<{ next: () => number } | null>(
  null,
);

/**
 * Resets the sidenote counter for whatever tree it wraps. Wrap once per
 * digest page so note numbers restart at 1 instead of accumulating across
 * client-side navigations.
 */
export function SidenoteProvider({ children }: { children: ReactNode }) {
  const counter = useRef(0);
  const value = useMemo(() => ({ next: () => ++counter.current }), []);
  return (
    <SidenoteCounterContext.Provider value={value}>
      {children}
    </SidenoteCounterContext.Provider>
  );
}

/**
 * Single authored note, rendered two ways depending on viewport: floated
 * into the margin column next to its marker on desktop, or collapsed into a
 * tap-to-jump fixed panel with a back button on mobile. Same content either
 * way — matchMedia picks the presentation, no separate authoring path.
 */
export function Sidenote({ children }: { children: ReactNode }) {
  const t = useTranslations("Sidenote");
  const ctx = useContext(SidenoteCounterContext);
  const [number] = useState(() => ctx?.next() ?? 0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return (
    <>
      <sup className="select-none">
        <button
          type="button"
          aria-expanded={isDesktop ? undefined : open}
          aria-controls={isDesktop ? undefined : panelId}
          onClick={() => {
            if (!isDesktop) setOpen(true);
          }}
          className={
            "inline appearance-none ml-0.5 rounded px-0.5 text-[0.7em] font-medium text-[var(--color-accent)] " +
            (isDesktop
              ? "cursor-default"
              : "cursor-pointer underline decoration-dotted underline-offset-2")
          }
        >
          {number}
        </button>
      </sup>

      {isDesktop ? (
        <span className="aside-float sidenote-desktop" role="note">
          <span className="mr-1 font-medium text-[var(--color-accent)]">
            {number}.
          </span>
          {children}
        </span>
      ) : (
        open && (
          <div
            id={panelId}
            role="dialog"
            aria-modal="true"
            className="fixed inset-x-0 bottom-0 z-50 max-h-[60vh] overflow-y-auto border-t border-neutral-300 bg-[var(--background)] p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.15)] dark:border-neutral-700"
          >
            <div className="mx-auto flex max-w-2xl flex-col gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-fit text-sm font-medium text-[var(--color-accent)]"
              >
                ← {t("back")}
              </button>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                <span className="mr-1 font-medium text-[var(--color-accent)]">
                  {number}.
                </span>
                {children}
              </p>
            </div>
          </div>
        )
      )}
    </>
  );
}
