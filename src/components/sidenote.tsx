"use client";

import { useTranslations } from "next-intl";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { OverlayPortal } from "@/components/ui/overlay-portal";

type SidenoteRegistry = {
  register: (id: string) => void;
  unregister: (id: string) => void;
};

const SidenoteCounterContext = createContext<SidenoteRegistry | null>(null);
const SidenoteOrderContext = createContext<string[]>([]);

/**
 * Resets the sidenote numbering for whatever tree it wraps. Wrap once per
 * digest page so note numbers restart at 1 instead of accumulating across
 * client-side navigations.
 *
 * Numbers come from registration order (a plain array in state, populated
 * by each Sidenote's effect), not a counter incremented during render.
 * A render-time counter looks simpler but isn't idempotent: React Strict
 * Mode replays render (and lazy `useState` initializers) twice on purpose
 * to surface exactly this kind of bug, and Fast Refresh can replay it
 * again without a true remount, so the shared counter drifts upward every
 * reload instead of resetting. Effects don't have that problem — React
 * runs mount → cleanup → mount for them in Strict Mode, so a symmetric
 * register/unregister nets out to the same, correct position every time.
 *
 * The register/unregister API and the order array are split into two
 * contexts on purpose. `registry` must stay referentially stable (empty
 * `useMemo` deps) — if it were rebuilt every time `order` changed, every
 * Sidenote's registration effect (which depends on it) would re-fire,
 * unregistering and re-registering itself, changing `order` again, and
 * looping forever ("Maximum update depth exceeded").
 */
export function SidenoteProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<string[]>([]);

  const registry = useMemo<SidenoteRegistry>(
    () => ({
      register: (id) =>
        setOrder((prev) => (prev.includes(id) ? prev : [...prev, id])),
      unregister: (id) =>
        setOrder((prev) => prev.filter((existing) => existing !== id)),
    }),
    [],
  );

  return (
    <SidenoteCounterContext.Provider value={registry}>
      <SidenoteOrderContext.Provider value={order}>
        {children}
      </SidenoteOrderContext.Provider>
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
  const order = useContext(SidenoteOrderContext);
  const id = useId();

  useLayoutEffect(() => {
    ctx?.register(id);
    return () => ctx?.unregister(id);
  }, [ctx, id]);

  const number = order.indexOf(id) + 1;
  const [isDesktop, setIsDesktop] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const panelId = useId();

  /* Gold in place of the default blue, on both the marker and its note at
     once — the one CSS custom property swap `.sidenote-rule` needs to
     follow along, since its border and wash are both keyed off these. */
  const highlightVars = highlighted
    ? ({
        "--rule-blue": "var(--sidenote-highlight)",
        "--sidenote-tint":
          "color-mix(in oklab, var(--sidenote-highlight) 35%, transparent)",
      } as React.CSSProperties)
    : undefined;
  const markerColor = highlighted
    ? "text-[var(--sidenote-highlight)]"
    : "text-[var(--accent)]";

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
        {/* `p-1.5 -m-1.5` grows the tap target well past the glyph's own
            box without shifting surrounding text — padding expands the
            hit area, the matching negative margin cancels it back out of
            the layout. */}
        <button
          type="button"
          aria-expanded={isDesktop ? undefined : open}
          aria-controls={isDesktop ? undefined : panelId}
          aria-pressed={highlighted}
          onClick={() => {
            setHighlighted((value) => !value);
            if (!isDesktop) setOpen(true);
          }}
          className={
            "-m-1.5 inline cursor-pointer appearance-none rounded p-1.5 text-[0.7em] font-medium " +
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] " +
            markerColor +
            (isDesktop ? "" : " underline decoration-dotted underline-offset-2")
          }
        >
          {number}
        </button>
      </sup>

      {isDesktop ? (
        <span
          className="aside-float sidenote-desktop"
          role="note"
          style={highlightVars}
        >
          {/* The rule rides on this inner box, not on the floated one: the
              float has to keep its percentage width for the margin-column
              geometry, while the line is supposed to measure the note's own
              text. See `.sidenote-rule` in globals.css. */}
          <span className="sidenote-rule">
            <span className={`mr-1 font-medium ${markerColor}`}>{number}.</span>
            {children}
          </span>
        </span>
      ) : (
        <OverlayPortal>
          <div
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-hidden={!open}
            data-open={open}
            className="overlay-sheet fixed inset-x-0 bottom-0 z-50 max-h-[60vh] overflow-y-auto border-t border-neutral-300 bg-[var(--background-start)] p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.15)] dark:border-neutral-700"
          >
            <div className="mx-auto flex max-w-2xl flex-col gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={
                  "w-fit text-sm font-medium text-[var(--accent)] " +
                  "transition-transform duration-150 ease-out active:scale-[0.97] motion-reduce:active:scale-100 " +
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                }
              >
                ← {t("back")}
              </button>
              {/* Same tint and same sans face as the desktop margin note —
                  one presentation switch, not two different notes. */}
              <p
                className="font-lato rounded-sm p-3 text-sm text-neutral-700 dark:text-neutral-300"
                style={{
                  backgroundColor: highlighted
                    ? "color-mix(in oklab, var(--sidenote-highlight) 35%, transparent)"
                    : "var(--sidenote-tint)",
                }}
              >
                <span className={`mr-1 font-medium ${markerColor}`}>
                  {number}.
                </span>
                {children}
              </p>
            </div>
          </div>
        </OverlayPortal>
      )}
    </>
  );
}
