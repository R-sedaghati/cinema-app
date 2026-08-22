"use client";

import Link from "next/link";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import useLoginDrawerStore from "@/lib/stores/useLoginDrawerStore";

const TermsNotice = () => {
  const { close } = useLoginDrawerStore();
  const copy = useLandingCopy();

  return (
    <p className="mt-4 text-center font-button-small text-gray-700">
      {copy("loginTermsPrefix")}{" "}
      <Link href="/terms" onClick={close} className="text-primary-600 underline">
        {copy("loginTermsLink")}
      </Link>{" "}
      {copy("loginTermsSuffix")}
    </p>
  );
};

export default TermsNotice;
