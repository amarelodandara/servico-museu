"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Dev-only palette bench. Every colour the site actually reads comes from a
 * custom property on `:root` (globals.css), so the panel can drive the live
 * page by writing those same properties as inline styles on the root
 * element — inline wins over both the base `:root` block and the
 * `prefers-color-scheme` one, so it works in either scheme without the
 * component knowing which is active.
 *
 * Nothing here writes to the stylesheet. Tweak, then hit Copy and hand the
 * block over to be set in stone in globals.css.
 */

type Token = { name: string; label: string; note?: string };
type Group = { title: string; blurb: string; tokens: Token[] };

const GROUPS: Group[] = [
  {
    title: "Surface",
    blurb:
      "The page wash runs from --background at the top to --background-light over the opening band.",
    tokens: [
      { name: "--background", label: "Background (top of the wash)" },
      { name: "--background-light", label: "Background light (rest of page)" },
      { name: "--foreground", label: "Foreground (body text)" },
    ],
  },
  {
    title: "Accent",
    blurb:
      "The “added content” blue, its tint, and the hairline blue the sidenote rules are drawn in.",
    tokens: [
      { name: "--color-accent", label: "Accent" },
      { name: "--color-added-tint", label: "Added tint" },
      { name: "--rule-blue", label: "Rule blue (sidenote lines)" },
    ],
  },
  {
    title: "Dataviz series",
    blurb:
      "Categorical slots 1/2. Keep these distinguishable under colour-vision deficiency — they carry chart meaning.",
    tokens: [
      { name: "--series-1", label: "Series 1 (blue)" },
      { name: "--series-2", label: "Series 2 (orange)" },
    ],
  },
  {
    title: "IBRAM figures",
    blurb:
      "Palette for the figures redrawn from the TCC. Ink is a deliberate neutral; card and grid are the chart's own surface.",
    tokens: [
      { name: "--fig-pink", label: "Pink" },
      { name: "--fig-yellow", label: "Yellow" },
      { name: "--fig-magenta", label: "Magenta" },
      { name: "--fig-ink", label: "Ink" },
      { name: "--fig-card", label: "Card" },
      { name: "--fig-grid", label: "Grid" },
    ],
  },
];

const ALL_TOKENS = GROUPS.flatMap((group) => group.tokens);
const STORAGE_KEY = "color-panel-overrides";

/** `#abc` → `#aabbcc`, `rgb(1 2 3)` → `#010203`; `<input type="color">` only speaks 6-digit hex. */
function toHex(value: string): string {
  const raw = value.trim();

  if (/^#[0-9a-f]{6}$/i.test(raw)) return raw.toLowerCase();

  if (/^#[0-9a-f]{3}$/i.test(raw)) {
    const [r, g, b] = raw.slice(1);
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  const channels = raw.match(/\d+(\.\d+)?/g);
  if (channels && channels.length >= 3) {
    return `#${channels
      .slice(0, 3)
      .map((n) => Math.round(Number(n)).toString(16).padStart(2, "0"))
      .join("")}`;
  }

  return "#000000";
}

export function ColorPanel() {
  const [open, setOpen] = useState(false);
  /** Stylesheet values, read once per scheme before any override is applied. */
  const [defaults, setDefaults] = useState<Record<string, string>>({});
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [scheme, setScheme] = useState<"light" | "dark">("light");

  /*
   * Read the defaults *before* replaying stored overrides, otherwise last
   * session's edits get recorded as this session's originals and Reset
   * stops meaning anything. Re-reads when the OS scheme flips, since each
   * scheme has its own stylesheet values.
   */
  const readDefaults = useCallback(() => {
    const root = document.documentElement;
    const previous = root.getAttribute("style");
    root.removeAttribute("style");

    const computed = getComputedStyle(root);
    const next: Record<string, string> = {};
    for (const token of ALL_TOKENS) {
      next[token.name] = toHex(computed.getPropertyValue(token.name));
    }

    if (previous) root.setAttribute("style", previous);
    setDefaults(next);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const currentScheme = () =>
      root.dataset.theme === "dark" ? "dark" : "light";

    /* Deferred a frame: this reads computed styles off the live document,
       which only makes sense once the page has actually painted — and after
       the layout's pre-paint script has settled `data-theme`. */
    const frame = requestAnimationFrame(() => {
      setScheme(currentScheme());
      readDefaults();

      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      try {
        const parsed = JSON.parse(stored) as Record<string, string>;
        setOverrides(parsed);
        for (const [name, value] of Object.entries(parsed)) {
          root.style.setProperty(name, value);
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    });

    /* Each scheme has its own stylesheet values, so flipping the lamp
       toggle invalidates the defaults this panel is diffing against. */
    const observer = new MutationObserver(() => {
      setScheme(currentScheme());
      readDefaults();
    });
    observer.observe(root, { attributeFilter: ["data-theme"] });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [readDefaults]);

  const persist = (next: Record<string, string>) => {
    setOverrides(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const setToken = (name: string, value: string) => {
    document.documentElement.style.setProperty(name, value);
    persist({ ...overrides, [name]: value });
  };

  const resetToken = (name: string) => {
    document.documentElement.style.removeProperty(name);
    const next = { ...overrides };
    delete next[name];
    persist(next);
  };

  const resetAll = () => {
    for (const token of ALL_TOKENS) {
      document.documentElement.style.removeProperty(token.name);
    }
    persist({});
  };

  const valueOf = (name: string) => overrides[name] ?? defaults[name] ?? "#000000";

  const snippet = () => {
    const changed = ALL_TOKENS.filter(
      (token) => overrides[token.name] && overrides[token.name] !== defaults[token.name],
    );
    const lines = ALL_TOKENS.map(
      (token) =>
        `  ${token.name}: ${valueOf(token.name)};${
          overrides[token.name] && overrides[token.name] !== defaults[token.name]
            ? ` /* was ${defaults[token.name]} */`
            : ""
        }`,
    );

    return [
      `/* palette bench — ${scheme} scheme, ${changed.length} of ${ALL_TOKENS.length} tokens changed */`,
      ":root {",
      ...lines,
      "}",
    ].join("\n");
  };

  const copy = async () => {
    await navigator.clipboard.writeText(snippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const changedCount = ALL_TOKENS.filter(
    (token) => overrides[token.name] && overrides[token.name] !== defaults[token.name],
  ).length;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-[60] rounded-full border border-neutral-400 bg-white px-4 py-2 font-mono text-xs text-neutral-900 shadow-lg"
      >
        Colors{changedCount > 0 ? ` (${changedCount})` : ""}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-[60] flex max-h-[85vh] w-80 flex-col overflow-hidden rounded-lg border border-neutral-300 bg-white text-neutral-900 shadow-2xl">
      <header className="flex items-center justify-between gap-2 border-b border-neutral-200 px-3 py-2">
        <div>
          <p className="font-mono text-xs font-semibold">Palette bench</p>
          <p className="font-mono text-[10px] text-neutral-500">
            {scheme} scheme · {changedCount} changed
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close palette bench"
          className="rounded px-2 py-1 font-mono text-xs text-neutral-500 hover:bg-neutral-100"
        >
          ✕
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        {GROUPS.map((group) => (
          <section key={group.title} className="mb-4">
            <h2 className="font-mono text-[11px] font-semibold tracking-wide uppercase">
              {group.title}
            </h2>
            <p className="mt-0.5 mb-2 font-mono text-[10px] leading-snug text-neutral-500">
              {group.blurb}
            </p>

            <ul className="space-y-2">
              {group.tokens.map((token) => {
                const value = valueOf(token.name);
                const dirty =
                  Boolean(overrides[token.name]) &&
                  overrides[token.name] !== defaults[token.name];

                return (
                  <li key={token.name} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(event) => setToken(token.name, event.target.value)}
                      aria-label={token.label}
                      className="h-8 w-8 shrink-0 cursor-pointer rounded border border-neutral-300 bg-transparent p-0.5"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-[11px]" title={token.label}>
                        {token.name}
                      </p>
                      <input
                        type="text"
                        value={value}
                        spellCheck={false}
                        onChange={(event) => {
                          const next = event.target.value;
                          if (/^#[0-9a-f]{6}$/i.test(next)) {
                            setToken(token.name, next.toLowerCase());
                          }
                        }}
                        className="w-20 rounded border border-neutral-200 px-1 font-mono text-[10px] text-neutral-600"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => resetToken(token.name)}
                      disabled={!dirty}
                      title={`Reset to ${defaults[token.name] ?? "—"}`}
                      className="shrink-0 rounded px-1.5 py-1 font-mono text-[10px] text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      ↺
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <footer className="flex gap-2 border-t border-neutral-200 px-3 py-2">
        <button
          type="button"
          onClick={copy}
          className="flex-1 rounded bg-neutral-900 px-3 py-1.5 font-mono text-xs text-white hover:bg-neutral-700"
        >
          {copied ? "Copied" : "Copy CSS"}
        </button>
        <button
          type="button"
          onClick={resetAll}
          disabled={changedCount === 0}
          className="rounded border border-neutral-300 px-3 py-1.5 font-mono text-xs hover:bg-neutral-100 disabled:opacity-40"
        >
          Reset all
        </button>
      </footer>
    </div>
  );
}
