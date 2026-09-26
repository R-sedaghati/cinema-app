import type { CSSProperties } from "react";

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

/**
 * Inline font-size / color override for CMS-editable text.
 * Returns undefined when neither is set so the Tailwind classes on the element
 * still win. Sizes outside 8–120px and anything but a `#rrggbb` color are dropped — the value comes from
 * the DB straight into a style attribute.
 */
export function textStyle(
  px?: number | string | null,
  color?: string | null,
): CSSProperties | undefined {
  const size = Number(px);
  const style: CSSProperties = {};
  if (size >= 8 && size <= 120) style.fontSize = `${size}px`;
  if (color && HEX_COLOR.test(color)) style.color = color;

  return Object.keys(style).length ? style : undefined;
}

