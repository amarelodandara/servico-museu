import { ImageResponse } from "next/og";
import { figurePalette } from "@/lib/figure-palette";

export const alt = "Panorama da pesquisa: museologia, design de serviços e design da informação";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  "pt-BR": {
    title: "Panorama da pesquisa",
    subtitle: "A serviço do museu",
    fields: ["Museologia", "Design de serviços", "Design da informação"],
  },
  en: {
    title: "Research panorama",
    subtitle: "In service of the museum",
    fields: ["Museology", "Service design", "Information design"],
  },
} as const;

function circleStyle(color: string, left: number, top: number) {
  return {
    position: "absolute" as const,
    left,
    top,
    width: 340,
    height: 340,
    borderRadius: "50%",
    border: `5px solid ${color}`,
    backgroundColor: `${color}47`,
  };
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = COPY[locale as keyof typeof COPY] ?? COPY["pt-BR"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: figurePalette.surface,
          color: figurePalette.ink,
          position: "relative",
        }}
      >
        <div style={circleStyle(figurePalette.pink, 620, 60)} />
        <div style={circleStyle(figurePalette.yellow, 800, 60)} />
        <div style={circleStyle(figurePalette.magenta, 710, 220)} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 80,
            maxWidth: 620,
          }}
        >
          <div style={{ fontSize: 28, opacity: 0.7 }}>{copy.subtitle}</div>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
            {copy.title}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 32,
              fontSize: 26,
              gap: 8,
            }}
          >
            {copy.fields.map((field, index) => (
              <div
                key={field}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    backgroundColor: [
                      figurePalette.pink,
                      figurePalette.yellow,
                      figurePalette.magenta,
                    ][index],
                  }}
                />
                {field}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
