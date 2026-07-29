import fs from "node:fs";
import path from "node:path";
import type { AppLocale } from "@/i18n/routing";

/**
 * Rough word count of an MDX source file: strips JSX/MDX tags, expression
 * braces, and markdown emphasis/heading/list markers before splitting on
 * whitespace. Not exact, but tracks the prose as it's edited instead of
 * being hand-maintained.
 */
export function getDigestWordCount(locale: AppLocale): number {
  const filePath = path.join(
    process.cwd(),
    "src/content",
    locale,
    "index.mdx",
  );
  const raw = fs.readFileSync(filePath, "utf8");

  const text = raw
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/^#+\s*/gm, "")
    .replace(/[*_>`-]/g, " ");

  return text.trim().split(/\s+/).filter(Boolean).length;
}
