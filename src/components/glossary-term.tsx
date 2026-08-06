"use client";

import { useLocale } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Drawer } from "vaul";
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
 *
 * This is the only glossary surface on the site: the standalone
 * `/glossario` page was dropped, since eight terms read better in place,
 * next to the sentence that raised them, than as a list nobody navigates
 * to. That makes both presentations load-bearing.
 *
 * Mobile is Vaul (vaul.emilkowal.ski), not a hand-rolled sheet. A drawer
 * the thumb can drag, that follows the finger and dismisses on velocity
 * rather than only on a tap, is a body of work — and Vaul brings scroll
 * lock, focus trap, focus return and Escape with it, on top of Radix
 * Dialog. Its motion curve is cubic-bezier(0.32, 0.72, 0, 1), which is
 * already this project's `--ease-drawer`, so nothing has to be talked into
 * matching.
 *
 * Desktop stays the hand-built popover: it isn't a drawer, it's anchored
 * to the term's own vertical offset, and nothing about a pointer wants
 * drag physics. It keeps its own Escape handler and returns focus to the
 * term it came from — the two things Vaul is giving the mobile branch.
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

  /** Desktop only — Vaul owns closing on the mobile branch. */
  const close = useCallback(() => {
    setOpen(false);
    // Focus goes back to the term rather than the top of the document, so
    // a keyboard reader resumes at the word they asked about.
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open || !isDesktop) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, isDesktop, close]);

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

      {isDesktop ? (
        <OverlayPortal>
          <button
            type="button"
            aria-label="close"
            tabIndex={-1}
            aria-hidden={!open}
            data-open={open}
            className="overlay-scrim fixed inset-0 z-40 cursor-default"
            onClick={close}
          />
          <div
            id={panelId}
            role="dialog"
            aria-modal={open}
            data-open={open}
            style={
              {
                top: pos.top,
                left: pos.left,
                width: PANEL_WIDTH,
                "--popover-origin": origin,
              } as CSSProperties
            }
            className="overlay-popover absolute z-50 rounded-md border border-neutral-300 bg-[var(--background)] p-4 text-sm shadow-lg dark:border-neutral-700"
          >
            <p className="mb-1 font-semibold">{entry.term}</p>
            <p className="text-neutral-600 dark:text-neutral-400">
              {entry.definition}
            </p>
          </div>
        </OverlayPortal>
      ) : (
        <Drawer.Root open={open} onOpenChange={setOpen}>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-40 bg-neutral-900/40" />
            <Drawer.Content
              id={panelId}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-lg border-t border-neutral-300 bg-[var(--background)] p-4 pb-8 text-sm outline-none dark:border-neutral-700"
            >
              {/* Vaul draws the handle itself; the override is only to take
                  it off its own hardcoded grey and onto ours. Its injected
                  styles are unlayered, so they beat a plain utility — hence
                  the important flag. */}
              <Drawer.Handle className="mb-4 bg-neutral-300! dark:bg-neutral-700!" />
              <Drawer.Title className="mb-1 font-semibold">
                {entry.term}
              </Drawer.Title>
              <Drawer.Description className="text-neutral-600 dark:text-neutral-400">
                {entry.definition}
              </Drawer.Description>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}
    </span>
  );
}
