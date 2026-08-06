import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/button";

/**
 * Locale-aware 404 catch-all. Rendered as a page (not not-found.tsx) so it
 * can read the attempted path and put it inside the pitch's required copy:
 * "oops, {x} is not the theme of our research".
 */
export default async function NotFoundCatchAll({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>;
}) {
  const { rest } = await params;
  const t = await getTranslations("NotFound");
  const attempted = decodeURIComponent(rest.join("/")).replaceAll("-", " ");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center text-[var(--foreground)]">
      <p className="font-lato text-sm tracking-wide text-neutral-500 uppercase">
        404
      </p>
      <h1 className="max-w-xl text-3xl text-balance">
        {t.rich("message", {
          x: () => <em className="text-[var(--color-accent)]">{attempted}</em>,
        })}
      </h1>
      <Link href="/" className={buttonClass({ variant: "secondary" })}>
        {t("backHome")}
      </Link>
    </div>
  );
}
