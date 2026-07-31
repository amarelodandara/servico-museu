import type { ReactNode } from "react";

export function LabelSwap({ children }: { children: ReactNode }) {
  return (
    <span className="grid grid-cols-1 grid-rows-1 place-items-center">
      {children}
    </span>
  );
}

export function SwapLabel({
  visible,
  children,
}: {
  visible: boolean;
  children: ReactNode;
}) {
  return (
    <span
      aria-hidden={!visible}
      className={
        "col-start-1 row-start-1 transition-[opacity,filter] duration-200 ease-out " +
        (visible
          ? "opacity-100 blur-[0px]"
          : "pointer-events-none opacity-0 blur-[2px]")
      }
    >
      {children}
    </span>
  );
}
