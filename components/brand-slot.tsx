"use client";

import { createContext, useContext, type ReactNode } from "react";

/** A small opt-in bridge. No lab code or synthetic data enters the live bundle. */
export const BrandContext = createContext<
  ((product?: string) => ReactNode) | null
>(null);
export function BrandSlot({
  children,
  product,
}: {
  children: ReactNode;
  product?: string;
}) {
  const render = useContext(BrandContext);
  return render ? render(product) : children;
}
