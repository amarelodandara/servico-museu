"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export const THEME_STORAGE_KEY = "theme";

/**
 * `wood` is the lamp in its gilt moulding: a grained frame, a rebate, the
 * canvas sunk into it. `bare` is the same lamp with the picture-frame
 * conceit dropped entirely — square, no frame, no fill, nothing but the
 * light. A white hairline was tried in between and read as a stray box on
 * the light page, which is what sent this the rest of the way to nothing.
 */
export type ThemeToggleVariant = "wood" | "bare";

export function ThemeToggle({
  variant = "wood",
}: { variant?: ThemeToggleVariant } = {}) {
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
  const bare = variant === "bare";

  const shell = bare
    ? ""
    : "border border-[#a9835a] p-px hover:border-[#8d6a45] dark:border-[#6d543a] dark:hover:border-[#8d6a45]";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={lit ? t("switchToDark") : t("switchToLight")}
      title={lit ? t("switchToDark") : t("switchToLight")}
      className={`group rounded-[2px] transition-[border-color,transform] duration-150 ease-out active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${shell}`}
      style={
        bare
          ? undefined
          : {
              /* Wood, not paint: a two-stop grain across the moulding, plus
                 the soft pair of shadows — a wide, low-alpha drop outside so
                 the frame lifts off the nav, and the recess inside the
                 rebate. */
              backgroundImage:
                "linear-gradient(115deg, #c69c6d 0%, #a97c4f 38%, #c9a274 62%, #a97c4f 100%)",
              boxShadow:
                "0 2px 10px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)",
            }
      }
    >
      {/* The moulding is the button's border and its own wood fill; this
          inner box is the canvas. `overflow-hidden` is what keeps the light
          inside the frame however far the cone is drawn, and the inset
          shadow is the rebate the canvas sits down into — neither of which
          the bare variant has any use for, having no moulding at all.

          Square there, and the 36x24 viewBox letterboxes itself: SVG's
          default `xMidYMid meet` fits the drawing to the width and centres
          it, so the lamp keeps its proportions instead of stretching. */}
      <span
        className={`block overflow-hidden rounded-[1px] ${
          bare ? "h-7 w-7" : "h-6 w-9"
        }`}
        style={
          bare
            ? undefined
            : {
                boxShadow:
                  "inset 0 0 0 1px rgb(0 0 0 / 0.06), inset 0 1px 5px rgb(0 0 0 / 0.14)",
              }
        }
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
          </defs>

          {/* No canvas fill — the page shows through, so the only colour in
              the frame is the light itself. */}
          {/* The cone only. A radial glow around the bulb sat here too and
              read as a second, competing light source rather than as spill
              from this one. */}
          <g className="opacity-100 transition-opacity duration-300 ease-out dark:opacity-0">
            <polygon points="14,11 22,11 33,24 3,24" fill="url(#lamp-ray)" />
          </g>

          <line
            x1="18"
            y1="0"
            x2="18"
            y2="5"
            strokeWidth="1"
            className="stroke-neutral-700 transition-colors duration-300 ease-out dark:stroke-neutral-500"
          />
          <path
            d="M13 10.5 L15.5 5 L20.5 5 L23 10.5 Z"
            className="fill-neutral-800 transition-colors duration-300 ease-out dark:fill-neutral-600"
          />
          <circle
            cx="18"
            cy="11.6"
            r="1.5"
            className="fill-[#ffcc00] transition-colors duration-300 ease-out dark:fill-neutral-700"
          />
        </svg>
      </span>
    </button>
  );
}
