"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "not_configured" | "error";

const FIELD_CLASS =
  "font-lato w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[var(--color-accent)] focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100";

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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          {t("name")}
          <input name="name" required className={FIELD_CLASS} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {t("email")}
          <input name="email" type="email" required className={FIELD_CLASS} />
        </label>
      </div>
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
        <textarea name="message" required rows={5} className={FIELD_CLASS} />
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="font-lato w-fit rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          {status === "sending" ? t("sending") : t("send")}
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
