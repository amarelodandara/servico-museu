/*
 * `primary` and `secondary` are the raised tier — controls that sit on top
 * of the page surface rather than flush with it (`.button-raised` in
 * globals.css). Reach for those. The appearance-named three below them are
 * the flat originals, kept for the places where a control genuinely is part
 * of the surface: inline links, list rows, chrome inside a card.
 */
export type ButtonVariant =
  "primary" | "secondary" | "tertiary" | "solid" | "outline" | "quiet";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonSurface = "page" | "light";

const BASE =
  "font-lato inline-block rounded-lg text-sm " +
  "transition-[background-color,border-color,color,text-decoration-color,transform] duration-150 ease-out " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";

/*
 * Press recoil for the flat variants. Held apart from BASE because the
 * raised ones drive `transform` themselves — they translate as well as
 * scale — and two sources writing the same property would leave the winner
 * to stylesheet order rather than intent.
 */
const PRESS = "active:scale-[0.97] motion-reduce:active:scale-100";

export const INTERACTION = `${BASE} ${PRESS}`;

const SIZE: Record<ButtonSize, string> = {
  sm: "px-3 py-1",
  md: "px-4 py-2",
  lg: "px-5 py-2",
};

/** The raised variants own their own press transform; the flat ones take PRESS. */
const RAISED: ReadonlySet<ButtonVariant> = new Set([
  "primary",
  "secondary",
  "tertiary",
]);

function variantClass(variant: ButtonVariant, surface: ButtonSurface): string {
  const dark = surface === "page";

  switch (variant) {
    case "primary":
      return "button-raised button-grain font-medium";
    case "secondary":
      return "button-raised button-plate";
    case "tertiary":
      /* Flat text until hovered, then it comes up to the resting step —
         `.button-flush` overrides the raised tier's rest state. */
      return "button-raised button-plate button-flush";
    case "solid":
      return (
        "bg-neutral-900 font-medium text-white hover:bg-neutral-700" +
        (dark
          ? " dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          : "")
      );
    case "outline":
      return (
        "border border-black/8 hover:bg-neutral-100" +
        (dark ? " dark:border-white/10 dark:hover:bg-neutral-800" : "")
      );
    case "quiet":
      return (
        "text-neutral-500 underline decoration-neutral-400 underline-offset-4 " +
        "hover:text-neutral-900 hover:decoration-neutral-600" +
        (dark ? " dark:hover:text-neutral-100" : "")
      );
  }
}

export function buttonClass({
  variant = "solid",
  size = "md",
  surface = "page",
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  surface?: ButtonSurface;
  className?: string;
} = {}): string {
  return [
    BASE,
    RAISED.has(variant) ? "" : PRESS,
    SIZE[size],
    variantClass(variant, surface),
    className,
  ]
    .filter(Boolean)
    .join(" ");
}
