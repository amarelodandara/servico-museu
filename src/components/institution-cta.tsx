"use client";

import { useTranslations } from "next-intl";
import { useId, useMemo, useRef, useState } from "react";
import { ContactForm, FIELD_CLASS } from "@/components/contact-form";
import { buttonClass } from "@/components/ui/button";
import { INSTITUTIONS, type Institution } from "@/content/institutions";
import { fuzzySearch, normalize } from "@/lib/fuzzy";

/**
 * The closing ask, sitting between the digest and the footer. The digest
 * ends by telling museum workers that the way to help is to take part —
 * this is where that becomes an action.
 *
 * Search first, form second, and on purpose: the study covers a specific
 * set of institutions, so the search doubles as the filter. Someone whose
 * museum is in scope gets a form already knowing which museum they mean;
 * someone whose isn't gets told so plainly instead of writing a message
 * that goes nowhere.
 *
 * The institution list is a placeholder (`content/institutions.ts`) until
 * the real one arrives; nothing here reads anything but names and aliases,
 * so swapping the file is the whole migration.
 */
export function InstitutionCta() {
  const t = useTranslations("Cta");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Institution | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(
    () =>
      fuzzySearch(query, INSTITUTIONS, (institution) => [
        institution.name,
        ...(institution.aliases ?? []),
      ]),
    [query],
  );

  /* Only treat a query as "no match" once it's substantial enough to mean
     something — one or two characters matching nothing is just typing. */
  const searched = normalize(query).length >= 3;
  const showNoMatch = searched && matches.length === 0 && !selected;
  const showList = !selected && matches.length > 0;

  const choose = (institution: Institution) => {
    setSelected(institution);
    setQuery(institution.name);
  };

  const reset = () => {
    setSelected(null);
    setQuery("");
    setActiveIndex(0);
    inputRef.current?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      reset();
      return;
    }
    if (!showList) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % matches.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + matches.length) % matches.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const match = matches[Math.min(activeIndex, matches.length - 1)];
      if (match) choose(match.item);
    }
  };

  return (
    <section
      aria-labelledby={`${listId}-title`}
      className="mx-auto w-10/12 px-6 py-24"
    >
      <div className="mx-auto grid max-w-3xl gap-6 text-center">
        <h2 id={`${listId}-title`} className="text-3xl tracking-tight text-balance">
          {t("title")}
        </h2>
        <p className="mx-auto max-w-xl text-balance text-neutral-600 dark:text-neutral-400">
          {t("intro")}
        </p>

        <div className="mx-auto w-full max-w-md text-left">
          <label htmlFor={`${listId}-input`} className="font-lato text-sm">
            {t("searchLabel")}
          </label>

          <div className="relative mt-1">
            <input
              id={`${listId}-input`}
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={showList}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={
                showList ? `${listId}-option-${activeIndex}` : undefined
              }
              autoComplete="off"
              value={query}
              placeholder={t("searchPlaceholder")}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelected(null);
                setActiveIndex(0);
              }}
              onKeyDown={onKeyDown}
              className={FIELD_CLASS}
            />

            {showList && (
              <ul
                id={listId}
                role="listbox"
                className="combobox-list absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-neutral-300 bg-white shadow-[var(--shadow-float)] dark:border-neutral-700 dark:bg-neutral-900"
              >
                {matches.map((match, index) => (
                  <li key={match.item.name}>
                    <button
                      type="button"
                      id={`${listId}-option-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => choose(match.item)}
                      className={`font-lato block w-full px-3 py-2 text-left text-sm transition-colors duration-100 ease-out ${
                        index === activeIndex
                          ? "bg-neutral-100 dark:bg-neutral-800"
                          : ""
                      }`}
                    >
                      {match.item.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p aria-live="polite" className="mt-2 text-sm">
            {showNoMatch && (
              <span className="text-neutral-600 dark:text-neutral-400">
                {t("noMatch")}
              </span>
            )}
          </p>
        </div>
      </div>

      {selected && (
        <div className="mx-auto mt-10 max-w-2xl">
          {/* Theme-aware card rather than the footer's white paper mat: the
              form's own fields and buttons carry dark: variants, and a
              surface that stayed white in dark mode would fight them. */}
          <div
            className="rounded-sm border border-neutral-200 bg-white px-8 py-8 dark:border-neutral-800 dark:bg-neutral-900"
            style={{ boxShadow: "var(--shadow-mat)" }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="text-lg tracking-tight text-balance">
                {t("matchTitle", { institution: selected.name })}
              </p>
              <button
                type="button"
                onClick={reset}
                className={buttonClass({
                  variant: "quiet",
                  size: "sm",
                  className: "-mr-3",
                })}
              >
                {t("searchAgain")}
              </button>
            </div>

            <p className="font-lato mt-1 mb-6 text-sm text-neutral-600 dark:text-neutral-400">
              {t("matchIntro")}
            </p>

            <ContactForm institution={selected.name} />
          </div>
        </div>
      )}
    </section>
  );
}
