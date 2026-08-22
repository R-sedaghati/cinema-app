"use client";
import { FC, useEffect, useState } from "react";

import { useLandingCopy } from "@/lib/hooks/useLandingCopy";
import useAuthStore from "@/lib/stores/useAuthStore";
import PhoneNumberStep from "./Steps/PhoneNumber";
import { StepBaseProps } from "./Steps/type";
import OtpStep from "./Steps/Otp";
import { useRouter } from "next/navigation";

const LoginForm: FC = () => {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const copy = useLandingCopy();
  const [step, setStep] = useState<"phoneNumber" | "otp">("phoneNumber");

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/");
    }
  }, []);

  const StepsProps: StepBaseProps = {
    setStep,
  };

  return (
    <div className="w-full z-10">
      <h3 className="w-full text-center font-h1-regular text-error-500 mb-2">
        {copy("brandName")}
      </h3>
      {step === "phoneNumber" && <PhoneNumberStep {...StepsProps} />}
      {step === "otp" && <OtpStep {...StepsProps} />}
    </div>
  );
};

export default LoginForm;
