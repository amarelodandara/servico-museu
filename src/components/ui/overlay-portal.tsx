"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

const noSubscription = () => () => {};
const onClient = () => true;
const onServer = () => false;

export function OverlayPortal({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(noSubscription, onClient, onServer);
  if (!mounted) return null;
  return createPortal(children, document.body);
}
