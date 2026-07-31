"use client";

import { useLocale } from "next-intl";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { OverlayPortal } from "@/components/ui/overlay-portal";
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
  const [origin, setOrigin] = useState("center");
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
      const left = Math.min(
        rect.right + 16,
        window.innerWidth - PANEL_WIDTH - 16,
      );
      setPos({ top: rect.top + window.scrollY, left });
      const originX = Math.min(Math.max(rect.left - left, 0), PANEL_WIDTH);
      setOrigin(`${Math.round(originX)}px 1.25rem`);
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
        className="inline appearance-none whitespace-nowrap cursor-help underline decoration-[var(--color-accent)] decoration-dotted underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
      >
        {children}
      </button>

      <OverlayPortal>
        <button
          type="button"
          aria-label="close"
          tabIndex={-1}
          aria-hidden={!open}
          data-open={open}
          className="overlay-scrim fixed inset-0 z-40 cursor-default"
          onClick={() => setOpen(false)}
        />
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          data-open={open}
          style={
            isDesktop
              ? ({
                  top: pos.top,
                  left: pos.left,
                  width: PANEL_WIDTH,
                  "--popover-origin": origin,
                } as CSSProperties)
              : undefined
          }
          className={
            isDesktop
              ? "overlay-popover absolute z-50 rounded-md border border-neutral-300 bg-[var(--background)] p-4 text-sm shadow-lg dark:border-neutral-700"
              : "overlay-sheet fixed inset-x-0 bottom-0 z-50 rounded-t-lg border-t border-neutral-300 bg-[var(--background)] p-4 text-sm shadow-lg dark:border-neutral-700"
          }
        >
          <p className="mb-1 font-semibold">{entry.term}</p>
          <p className="text-neutral-600 dark:text-neutral-400">
            {entry.definition}
          </p>
        </div>
      </OverlayPortal>
    </span>
  );
}
