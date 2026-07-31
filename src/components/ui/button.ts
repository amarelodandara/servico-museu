export type ButtonVariant = "solid" | "outline" | "quiet";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonSurface = "page" | "light";

const BASE =
  "font-lato inline-block rounded-full text-sm " +
  "transition-[background-color,border-color,color,text-decoration-color,transform] duration-150 ease-out " +
  "active:scale-[0.97] motion-reduce:active:scale-100 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]";

export const INTERACTION = BASE;

const SIZE: Record<ButtonSize, string> = {
  sm: "px-3 py-1",
  md: "px-4 py-2",
  lg: "px-5 py-2",
};

function variantClass(variant: ButtonVariant, surface: ButtonSurface): string {
  const dark = surface === "page";

  switch (variant) {
    case "solid":
      return (
        "bg-neutral-900 font-medium text-white hover:bg-neutral-700" +
        (dark
          ? " dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          : "")
      );
    case "outline":
      return (
        "border border-neutral-300 hover:bg-neutral-100" +
        (dark ? " dark:border-neutral-700 dark:hover:bg-neutral-800" : "")
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
  return [BASE, SIZE[size], variantClass(variant, surface), className]
    .filter(Boolean)
    .join(" ");
}
