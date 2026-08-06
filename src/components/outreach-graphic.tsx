"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import { figurePalette } from "@/lib/figure-palette";
import { downloadSvgAsPng } from "@/lib/svg-png";
import { ShareLink } from "@/components/share-link";
import { buttonClass } from "@/components/ui/button";

/**
 * The cold-outreach artifact from the pitch: one static visual carrying the
 * four strongest Belo Horizonte numbers, inside the site's picture-frame
 * motif, meant to be attached to a first-contact email and forwarded
 * internally at a museum. Not a dashboard — a single self-standing image,
 * downloadable as PNG.
 */
const VIEW = { w: 1200, h: 900 };

const STATS = [
  { key: "museums", value: "223", color: figurePalette.magenta },
  {
    key: "educational",
    value: "61,5%",
    valueEn: "61.5%",
    color: figurePalette.pink,
  },
  {
    key: "freeEntry",
    value: "87%",
    valueEn: "87%",
    color: figurePalette.yellow,
  },
  {
    key: "guidedVisits",
    value: "68,3%",
    valueEn: "68.3%",
    color: figurePalette.ink,
  },
] as const;

export function OutreachGraphic({ locale }: { locale: string }) {
  const t = useTranslations("Outreach");
  const svgRef = useRef<SVGSVGElement>(null);
  const isEn = locale === "en";

  return (
    <figure className="my-8">
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        role="img"
        aria-label={t("alt")}
        className="w-full max-w-2xl"
        style={{ fontFamily: "var(--font-lato), sans-serif" }}
      >
        {/* Picture-frame motif: outer frame, mat, inner sheet. */}
        <rect
          x="0"
          y="0"
          width={VIEW.w}
          height={VIEW.h}
          fill={figurePalette.surface}
        />
        <rect
          x="24"
          y="24"
          width={VIEW.w - 48}
          height={VIEW.h - 48}
          fill="none"
          stroke={figurePalette.ink}
          strokeWidth="10"
        />
        <rect
          x="52"
          y="52"
          width={VIEW.w - 104}
          height={VIEW.h - 104}
          fill={figurePalette.card}
        />
        <rect
          x="88"
          y="88"
          width={VIEW.w - 176}
          height={VIEW.h - 176}
          fill="none"
          stroke={figurePalette.ink}
          strokeWidth="1.5"
        />

        <text
          x="600"
          y="180"
          textAnchor="middle"
          fontSize="44"
          fontWeight="700"
          fill={figurePalette.ink}
        >
          {t("title")}
        </text>

        {STATS.map((stat, index) => {
          const col = index % 2;
          const row = Math.floor(index / 2);
          const x = 340 + col * 520;
          const y = 350 + row * 220;
          const value = isEn && "valueEn" in stat ? stat.valueEn : stat.value;
          return (
            <g key={stat.key}>
              <text
                x={x}
                y={y}
                textAnchor="middle"
                fontSize="84"
                fontWeight="700"
                fill={stat.color}
              >
                {value}
              </text>
              <text
                x={x}
                y={y + 46}
                textAnchor="middle"
                fontSize="26"
                fill={figurePalette.ink}
              >
                {t(`stat_${stat.key}`)}
              </text>
            </g>
          );
        })}

        <text
          x="600"
          y="770"
          textAnchor="middle"
          fontSize="24"
          fill={figurePalette.ink}
          opacity="0.75"
        >
          {t("footer")}
        </text>
      </svg>

      <figcaption className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        {t("caption")}
      </figcaption>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            if (!svgRef.current) return;
            downloadSvgAsPng(
              svgRef.current,
              "museus-de-bh-em-numeros.png",
              VIEW.w,
              VIEW.h,
            );
          }}
          className={buttonClass({ variant: "secondary", className: "w-fit" })}
        >
          {t("downloadPng")}
        </button>
        <ShareLink />
      </div>
    </figure>
  );
}
