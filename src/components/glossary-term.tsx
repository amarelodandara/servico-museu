"use client";

import { useLocale } from "next-intl";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import ptBR from "@/content/glossary.pt-BR.json";
import en from "@/content/glossary.en.json";

type GlossaryEntry = { term: string; definition: string };
type GlossaryData = Record<string, GlossaryEntry>;

const DATA: Record<string, GlossaryData> = {
  "pt-BR": ptBR,
  en,
};

const PANEL_WIDTH = 256;

/**
 * Wraps a term in the running text. Click opens a definition panel
 * positioned at the term's own vertical offset on desktop; a bottom sheet
 * on mobile — same lookup data (`content/glossary.{locale}.json`), same
 * component, matchMedia decides the presentation.
 */
export function GlossaryTerm({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const locale = useLocale();
  const entry = DATA[locale]?.[id];
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  if (!entry) return <>{children}</>;

  const handleOpen = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setPos({
        top: rect.top + window.scrollY,
        left: Math.min(rect.right + 16, window.innerWidth - PANEL_WIDTH - 16),
      });
    }
    setOpen(true);
  };

  return (
    <span className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={handleOpen}
        className="inline appearance-none whitespace-nowrap cursor-help underline decoration-[var(--color-accent)] decoration-dotted underline-offset-2"
      >
        {children}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="close"
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            id={panelId}
            role="dialog"
            aria-modal="true"
            style={
              isDesktop
                ? { top: pos.top, left: pos.left, width: PANEL_WIDTH }
                : undefined
            }
            className={
              isDesktop
                ? "fixed z-50 rounded-md border border-neutral-300 bg-[var(--background)] p-4 text-sm shadow-lg dark:border-neutral-700"
                : "fixed inset-x-0 bottom-0 z-50 rounded-t-lg border-t border-neutral-300 bg-[var(--background)] p-4 text-sm shadow-lg dark:border-neutral-700"
            }
          >
            <p className="mb-1 font-semibold">{entry.term}</p>
            <p className="text-neutral-600 dark:text-neutral-400">
              {entry.definition}
            </p>
          </div>
        </>
      )}
    </span>
  );
}
