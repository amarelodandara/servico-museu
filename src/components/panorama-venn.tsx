"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import { figurePalette } from "@/lib/figure-palette";
import { downloadSvgAsPng } from "@/lib/svg-png";
import { ShareLink } from "@/components/share-link";

/**
 * The research-panorama Venn: museology ∩ service design ∩ information
 * design, with this research at the center. Drawn with literal hexes from
 * figure-palette.ts (not CSS vars) so the SVG serializes cleanly into the
 * PNG download the pitch specs for email attachments.
 */
const VIEW = { w: 640, h: 540 };
const CIRCLES = [
  { key: "museology", cx: 248, cy: 210, color: figurePalette.pink, labelX: 130, labelY: 66, anchor: "start" },
  { key: "serviceDesign", cx: 392, cy: 210, color: figurePalette.yellow, labelX: 510, labelY: 66, anchor: "end" },
  { key: "informationDesign", cx: 320, cy: 336, color: figurePalette.magenta, labelX: 320, labelY: 512, anchor: "middle" },
] as const;
const RADIUS = 148;

export function PanoramaVenn() {
  const t = useTranslations("Panorama");
  const svgRef = useRef<SVGSVGElement>(null);

  const downloadPng = () => {
    if (!svgRef.current) return;
    downloadSvgAsPng(
      svgRef.current,
      "panorama-a-servico-do-museu.png",
      VIEW.w,
      VIEW.h,
    );
  };

  return (
    <figure className="my-8">
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        role="img"
        aria-label={t("vennAlt")}
        className="w-full max-w-xl"
        style={{
          fontFamily: "var(--font-lato), sans-serif",
        }}
      >
        {CIRCLES.map((circle) => (
          <circle
            key={circle.key}
            cx={circle.cx}
            cy={circle.cy}
            r={RADIUS}
            fill={circle.color}
            fillOpacity="0.28"
            stroke={circle.color}
            strokeWidth="2.5"
          />
        ))}
        {CIRCLES.map((circle) => (
          <text
            key={`${circle.key}-label`}
            x={circle.labelX}
            y={circle.labelY}
            textAnchor={circle.anchor}
            fontSize="20"
            fontWeight="700"
            fill={figurePalette.ink}
          >
            {t(`field_${circle.key}`)}
          </text>
        ))}
        <text
          x="320"
          y="248"
          textAnchor="middle"
          fontSize="17"
          fontWeight="700"
          fill={figurePalette.ink}
        >
          <tspan x="320" dy="0">
            {t("centerLine1")}
          </tspan>
          <tspan x="320" dy="22">
            {t("centerLine2")}
          </tspan>
        </text>
      </svg>

      <figcaption className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        {t("vennCaption")}
      </figcaption>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={downloadPng}
          className="font-lato w-fit rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          {t("downloadPng")}
        </button>
        <ShareLink />
      </div>
    </figure>
  );
}
