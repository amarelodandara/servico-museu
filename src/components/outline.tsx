"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type Heading = { id: string; text: string; level: 2 | 3 };

/**
 * Corner-anchored table of contents, replacing the removed academic
 * "Sumário." Scans `h2`/`h3` elements (ids come from rehype-slug) inside
 * the given container after mount, then uses IntersectionObserver to track
 * which section is current as the reader scrolls.
 */
export function Outline({ containerId }: { containerId: string }) {
  const t = useTranslations("Outline");
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const elements = Array.from(
      container.querySelectorAll<HTMLElement>("h2, h3"),
    ).filter((el) => el.id);

    if (elements.length === 0) return;

    const headingList: Heading[] = elements.map((el) => ({
      id: el.id,
      text: el.textContent ?? "",
      level: el.tagName === "H2" ? 2 : 3,
    }));

    // Both setState calls live inside the observer callback (which
    // IntersectionObserver invokes asynchronously, including its initial
    // firing for each newly-observed element) rather than the effect body
    // itself. `headingList` is a stable closure reference, so repeat calls
    // as observed elements settle are no-ops for React.
    const observer = new IntersectionObserver(
      (entries) => {
        setHeadings(headingList);

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-10% 0px -70% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [containerId]);

  if (headings.length === 0) return null;

  return (
    <div className="fixed right-6 bottom-6 z-40">
      {open && (
        <nav
          aria-label={t("label")}
          className="mb-2 max-h-[60vh] w-64 overflow-y-auto rounded-md border border-neutral-300 bg-[var(--background)] p-3 text-sm shadow-lg dark:border-neutral-700"
        >
          <ul className="flex flex-col gap-1">
            {headings.map((heading) => (
              <li key={heading.id} className={heading.level === 3 ? "pl-3" : undefined}>
                <a
                  href={`#${heading.id}`}
                  onClick={() => setOpen(false)}
                  className={
                    "block rounded px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 " +
                    (activeId === heading.id
                      ? "font-medium text-[var(--color-accent)]"
                      : "text-neutral-600 dark:text-neutral-400")
                  }
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="rounded-full border border-neutral-300 bg-[var(--background)] px-4 py-2 text-sm font-medium shadow-lg hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
      >
        {t("toggle")}
      </button>
    </div>
  );
}
