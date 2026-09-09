"use client";

/**
 * Wireframe thumbnail for a layout variant — CSS boxes, no assets. Keyed by
 * variant key, which is shared across sections on purpose: `grid` looks the
 * same whichever section draws it.
 */
export function VariantGlyph({ variant }: { variant: string }) {
  const frame =
    "h-9 w-14 shrink-0 rounded-md border border-current/25 p-1 opacity-70";
  const fill = "rounded-[2px] bg-current";

  switch (variant) {
    case "grid":
    case "cards":
    case "tiles":
      return (
        <span className={`${frame} grid grid-cols-3 grid-rows-2 gap-[3px]`}>
          {["a", "b", "c", "d", "e", "f"].map((k) => (
            <span key={k} className={fill} />
          ))}
        </span>
      );

    case "rail":
    case "posters":
    case "slider":
    case "filmstrip":
      // Last box clipped by the frame — the horizontal-scroll tell.
      return (
        <span className={`${frame} flex gap-[3px] overflow-hidden`}>
          {["a", "b", "c"].map((k) => (
            <span key={k} className={`${fill} w-3.5 shrink-0`} />
          ))}
        </span>
      );

    case "list":
    case "rows":
    case "castlist":
      return (
        <span className={`${frame} flex flex-col justify-between`}>
          {["a", "b", "c"].map((k) => (
            <span key={k} className={`${fill} h-1.5 w-full`} />
          ))}
        </span>
      );

    case "text":
    case "columns":
      return (
        <span className={`${frame} flex gap-[3px]`}>
          {["a", "b"].map((col) => (
            <span key={col} className="flex flex-1 flex-col justify-between">
              {["a", "b", "c"].map((k) => (
                <span key={k} className={`${fill} h-1 w-full`} />
              ))}
            </span>
          ))}
        </span>
      );

    case "staggered":
      // Alternating 4/3 rows — the registration grid's shipped layout.
      return (
        <span className={`${frame} flex flex-col justify-between gap-[3px]`}>
          <span className="flex gap-[3px]">
            {["a", "b", "c", "d"].map((k) => (
              <span key={k} className={`${fill} h-2 flex-1`} />
            ))}
          </span>
          <span className="flex justify-center gap-[3px]">
            {["a", "b", "c"].map((k) => (
              <span key={k} className={`${fill} h-2 w-2.5`} />
            ))}
          </span>
        </span>
      );

    case "chips":
      return (
        <span className={`${frame} flex flex-wrap content-start gap-[3px]`}>
          {["w-4", "w-5", "w-3", "w-5", "w-3.5"].map((w) => (
            <span key={w} className={`${fill} h-1.5 rounded-full ${w}`} />
          ))}
        </span>
      );

    case "stacked":
      return (
        <span className={`${frame} flex flex-col justify-center gap-[3px]`}>
          <span className={`${fill} h-1.5 w-2/3`} />
          <span className={`${fill} h-2.5 w-full opacity-50`} />
        </span>
      );

    case "marquee":
      return (
        <span className={`${frame} flex items-center justify-center`}>
          <span className="h-5 w-10 rounded-[2px] border-2 border-current" />
        </span>
      );

    case "framed":
      return (
        <span className={`${frame} flex items-center justify-center`}>
          <span className={`${fill} h-5 w-9`} />
        </span>
      );

    default:
      // still, bleed, panel and anything new: one full block.
      return (
        <span className={`${frame} flex`}>
          <span className={`${fill} h-full w-full`} />
        </span>
      );
  }
}
