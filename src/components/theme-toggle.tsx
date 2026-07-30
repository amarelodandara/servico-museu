"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export const THEME_STORAGE_KEY = "theme";

/**
 * A little painting that happens to be a switch: a pendant lamp hung inside
 * a landscape 3:2 wooden frame, its light contained by the frame's own
 * edges (the canvas clips, so the cone can spill as far as it likes and
 * still stop at the moulding). Light mode lights the lamp; dark mode leaves
 * the gallery closed. The canvas has no fill of its own — the page shows
 * through it, so the only colour inside the frame is the lamp's own #ffcc00.
 *
 * Writes `data-theme` on <html>, which every colour token and every `dark:`
 * utility reads (see the `@custom-variant dark` block in globals.css), and
 * remembers the choice. Until someone picks a side the toggle keeps
 * following the OS, so a system scheme change still moves the page.
 */
export function ThemeToggle() {
  const t = useTranslations("Theme");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    /* Deferred a frame: the pre-paint script in the layout owns the initial
       attribute, so read it rather than racing it. */
    const frame = requestAnimationFrame(() => {
      const current = document.documentElement.dataset.theme;
      setTheme(current === "dark" ? "dark" : "light");
    });

    const follow = () => {
      if (window.localStorage.getItem(THEME_STORAGE_KEY)) return;
      const next = mql.matches ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      setTheme(next);
    };
    mql.addEventListener("change", follow);

    return () => {
      cancelAnimationFrame(frame);
      mql.removeEventListener("change", follow);
    };
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    setTheme(next);
  };

  const lit = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={lit ? t("switchToDark") : t("switchToLight")}
      title={lit ? t("switchToDark") : t("switchToLight")}
      className="group rounded-[2px] border border-[#a9835a] p-px transition-colors hover:border-[#8d6a45] dark:border-[#6d543a] dark:hover:border-[#8d6a45]"
      style={{
        /* Wood, not paint: a two-stop grain across the moulding, plus the
           soft pair of shadows — a wide, low-alpha drop outside so the
           frame lifts off the nav, and the recess inside the rebate. */
        backgroundImage:
          "linear-gradient(115deg, #c69c6d 0%, #a97c4f 38%, #c9a274 62%, #a97c4f 100%)",
        boxShadow: "0 2px 10px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)",
      }}
    >
      {/* The moulding is the button's border and its own wood fill; this
          inner box is the canvas. `overflow-hidden` is what keeps the light
          inside the frame however far the cone is drawn, and the inset
          shadow is the rebate the canvas sits down into. */}
      <span
        className="block h-6 w-9 overflow-hidden rounded-[1px]"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgb(0 0 0 / 0.06), inset 0 1px 5px rgb(0 0 0 / 0.14)",
        }}
      >
        <svg
          viewBox="0 0 36 24"
          className="h-full w-full"
          role="presentation"
          focusable="false"
        >
          <defs>
            <linearGradient id="lamp-ray" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffcc00" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#ffcc00" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ffcc00" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="lamp-glow">
              <stop offset="0%" stopColor="#ffcc00" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffcc00" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* No canvas fill — the page shows through, so the only colour in
              the frame is the light itself. */}
          <g className="opacity-100 transition-opacity duration-500 dark:opacity-0">
            <polygon points="14,11 22,11 33,24 3,24" fill="url(#lamp-ray)" />
            <circle cx="18" cy="11" r="8" fill="url(#lamp-glow)" />
          </g>

          <line
            x1="18"
            y1="0"
            x2="18"
            y2="5"
            strokeWidth="1"
            className="stroke-neutral-700 transition-colors duration-500 dark:stroke-neutral-500"
          />
          <path
            d="M13 10.5 L15.5 5 L20.5 5 L23 10.5 Z"
            className="fill-neutral-800 transition-colors duration-500 dark:fill-neutral-600"
          />
          <circle
            cx="18"
            cy="11.6"
            r="1.5"
            className="fill-[#ffcc00] transition-colors duration-500 dark:fill-neutral-700"
          />
        </svg>
      </span>
    </button>
  );
}
