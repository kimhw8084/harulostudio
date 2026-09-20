import type { ComponentProps } from "react";

/**
 * Publisher pages use native document navigation. The pinned Vinext build's
 * client Link prefetch/navigation throws in production; native links preserve
 * working URLs, browser history, no-JS use and route-level loading without it.
 */
export default function Link(props: ComponentProps<"a">) {
  return <a {...props} />;
}
