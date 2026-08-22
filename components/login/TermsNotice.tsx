"use client";

import Link from "next/link";
import useLoginDrawerStore from "@/lib/stores/useLoginDrawerStore";

const TermsNotice = () => {
  const { close } = useLoginDrawerStore();

  return (
    <p className="mt-4 text-center font-button-small text-gray-700">
      ورود شما به منزله پذیرش{" "}
      <Link href="/terms" onClick={close} className="text-primary-600 underline">
        قوانین و مقررات
      </Link>{" "}
      می‌باشد
    </p>
  );
};

export default TermsNotice;
