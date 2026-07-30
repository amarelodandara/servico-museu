import { figurePalette } from "@/lib/figure-palette";

/**
 * Client-side SVG → PNG download, shared by every viz piece that offers the
 * pitch's "export as image" action. Serializes the live SVG node, paints it
 * onto a 2x canvas over the site surface color, and triggers a download.
 */
export function downloadSvgAsPng(
  svg: SVGSVGElement,
  filename: string,
  width: number,
  height: number,
) {
  const xml = new XMLSerializer().serializeToString(svg);
  const url = URL.createObjectURL(
    new Blob([xml], { type: "image/svg+xml;charset=utf-8" }),
  );
  const image = new Image();
  image.onload = () => {
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
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
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    }, "image/png");
  };
  image.src = url;
}
