"use client";

import Link from "next/link";
import clsx from "clsx";
import { MoveRight } from "lucide-react";
import { isDesktop } from "react-device-detect";
import type { CopyFn } from "@/lib/utils/formCopy";

const BackLinkSection: React.FC<{ copy: CopyFn }> = ({ copy }) => (
  <div className={clsx("mx-auto mb-3 w-[90%]", isDesktop && "w-4/5")}>
    <Link
      href="/"
      className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200"
    >
      <MoveRight size={18} />
      {copy("backHome")}
    </Link>
  </div>
);

export default BackLinkSection;
