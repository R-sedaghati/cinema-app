"use client";

import Link from "next/link";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import useLoginDrawerStore from "@/lib/stores/useLoginDrawerStore";

const TermsNotice = () => {
  const { close } = useLoginDrawerStore();
  const copy = useLandingCopy();

  return (
    <p className="mt-4 text-center font-button-small text-gray-700">
      <span style={copy.style("loginTermsPrefix")}>{copy("loginTermsPrefix")}</span>{" "}
      <Link href="/terms" onClick={close} className="text-primary-600 underline">
        <span style={copy.style("loginTermsLink")}>{copy("loginTermsLink")}</span>
      </Link>{" "}
      <span style={copy.style("loginTermsSuffix")}>{copy("loginTermsSuffix")}</span>
    </p>
  );
};

export default TermsNotice;
