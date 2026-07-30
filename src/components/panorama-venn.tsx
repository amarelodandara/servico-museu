"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import { figurePalette } from "@/lib/figure-palette";

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
    const svg = svgRef.current;
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const url = URL.createObjectURL(
      new Blob([xml], { type: "image/svg+xml;charset=utf-8" }),
    );
    const image = new Image();
    image.onload = () => {
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = VIEW.w * scale;
      canvas.height = VIEW.h * scale;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.fillStyle = figurePalette.surface;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "panorama-a-servico-do-museu.png";
        link.click();
        URL.revokeObjectURL(link.href);
      }, "image/png");
    };
    image.src = url;
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

      <button
        type="button"
        onClick={downloadPng}
        className="font-lato mt-4 w-fit rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
      >
        {t("downloadPng")}
      </button>
    </figure>
  );
}
