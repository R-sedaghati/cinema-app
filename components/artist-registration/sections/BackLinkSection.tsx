"use client";

import Link from "next/link";
import clsx from "clsx";
import { MoveRight } from "lucide-react";
import { isDesktop } from "react-device-detect";
import type { CopyFn } from "@/lib/utils/formCopy";
import { useFormCopy } from "@/lib/hooks/useFormCopy";

/** `copy` optional so server pages can render it without their own form copy. */
const BackLinkSection: React.FC<{ copy?: CopyFn }> = (props) => {
  const formCopy = useFormCopy();
  const copy = props.copy ?? formCopy;
  return (
    <div className={clsx("mx-auto mb-3 w-[90%]", isDesktop && "w-4/5")}>
      <Link
        href="/"
        data-el="link"
        className="inline-flex items-center gap-1 py-2 text-base text-zinc-400 sm:py-0 sm:text-sm hover:text-zinc-200"
      >
        <MoveRight className="size-6 sm:size-[18px]" />
        <span style={copy.style("backHome")}>{copy("backHome")}</span>
      </Link>
    </div>
  );
};

export default BackLinkSection;
