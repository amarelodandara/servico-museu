"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/button";
import { LabelSwap, SwapLabel } from "@/components/ui/label-swap";

type Status = "idle" | "sending" | "sent" | "not_configured" | "error";

/*
 * Fields, matched to the button tiers rather than to a generic input style.
 * The buttons sit *on* the page surface (`.button-raised`); a field is the
 * opposite gesture, so it takes the recessed treatment the page already
 * uses for artwork — `--shadow-inset-frame`, no border — and the two read
 * as one depth language instead of two unrelated component kits.
 *
 * Radius, face and horizontal padding come from the buttons: `rounded-full`
 * and `px-5` on single-line fields, matching a `lg` button exactly, so a
 * field and the button under it line up on both edges. `FIELD_AREA_CLASS`
 * takes the same treatment at a radius that survives multiple lines — a
 * pill-shaped textarea would bow its corners away from the text.
 */
const FIELD_BASE =
  "font-lato w-full bg-white px-5 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 " +
  "shadow-[var(--shadow-inset-frame)] " +
  "transition-[box-shadow,background-color] duration-150 ease-out " +
  "focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-accent)] " +
  "dark:bg-neutral-900 dark:text-neutral-100";

export const FIELD_CLASS = `${FIELD_BASE} rounded-full`;
export const FIELD_AREA_CLASS = `${FIELD_BASE} rounded-2xl py-3`;

/**
 * `institution` pre-fills the field and takes it out of the form: the CTA
 * search already established which museum the person is writing about, so
 * asking again would be asking twice. It still travels to the API in a
 * hidden input, so the route handler sees the same payload either way.
 */
export function ContactForm({ institution }: { institution?: string } = {}) {
  const t = useTranslations("Contact");
  const [status, setStatus] = useState<Status>("idle");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        form.reset();
        setStatus("sent");
      } else {
        const payload = await response.json().catch(() => ({}));
        setStatus(
          payload.error === "not_configured" ? "not_configured" : "error",
        );
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      {/* Stacked rather than side by side: the CTA's own column is narrow
          enough (max-w-md) that a two-up row left each field too tight to
          hold what people actually type into it — a real name or email
          address, not a two-word placeholder. */}
      <label className="flex flex-col gap-1 text-sm">
        {t("name")}
        <input name="name" required className={FIELD_CLASS} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        {t("email")}
        <input name="email" type="email" required className={FIELD_CLASS} />
      </label>
      {institution ? (
        <input type="hidden" name="institution" value={institution} />
      ) : (
        <label className="flex flex-col gap-1 text-sm">
          {t("institution")}
          <input name="institution" className={FIELD_CLASS} />
        </label>
      )}
      <label className="flex flex-col gap-1 text-sm">
        {t("message")}
        <textarea
          name="message"
          required
          rows={5}
          className={FIELD_AREA_CLASS}
        />
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className={buttonClass({
            variant: "primary",
            size: "lg",
            className: "w-fit disabled:opacity-50",
          })}
        >
          <LabelSwap>
            <SwapLabel visible={status !== "sending"}>{t("send")}</SwapLabel>
            <SwapLabel visible={status === "sending"}>{t("sending")}</SwapLabel>
          </LabelSwap>
        </button>

        <p aria-live="polite" className="text-sm">
          {status === "sent" && (
            <span className="text-green-700 dark:text-green-400">
              {t("sent")}
            </span>
          )}
          {status === "not_configured" && (
            <span className="text-neutral-600 dark:text-neutral-400">
              {t("notConfigured")}{" "}
              <a
                href="mailto:nicolysantos51@gmail.com"
                className="text-[var(--color-accent)] underline"
              >
                nicolysantos51@gmail.com
              </a>
            </span>
          )}
          {status === "error" && (
            <span className="text-red-700 dark:text-red-400">{t("error")}</span>
          )}
        </p>
      </div>
    </form>
  );
}
