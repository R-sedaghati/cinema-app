"use client";
import { FC, useCallback, useEffect, useState } from "react";
import { StepBaseProps } from "./type";
import OtpInput from "@dgshahr/ui-kit/Form/OtpInput";
import convertFaNumberToEnNumber from "@/lib/utils/convertFaNumberToEnNumber";
import useTimer from "@/lib/hooks/useTimer";
import useWebOtp from "@/lib/hooks/useWebOtp";
import { Pencil } from "lucide-react";
import useAuthStore from "@/lib/stores/useAuthStore";
import { formatPhoneNumber } from "@/lib/utils/formatPhoneNumber";
import Button from "@/components/common/Button";
import { useUserLogin } from "@/lib/services/landing/hook";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useLoginDrawerStore from "@/lib/stores/useLoginDrawerStore";

const OTP_EXPIRATION_KEY = "otpExpirationDate";

const OtpStep: FC<StepBaseProps> = (props) => {
  const router = useRouter();
  const { setStep } = props;
  const { phoneNumber, login } = useAuthStore();
  const { close } = useLoginDrawerStore();

  const [isTimerEnded, setIsTimerEnded] = useState(false);
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { remainingTime, resetTimer, setTimer } = useTimer(120, () =>
    setIsTimerEnded(true),
  );

  const { mutate, isPending } = useUserLogin();

  const otpOnSuccess = useCallback((otp: string) => {
    setCode(otp);
  }, []);

  useWebOtp({
    onSuccess: otpOnSuccess,
  });

  function handleResetTimer() {
    resetTimer();
    const otpExpirationDate = Date.now() + 120 * 1000;
    localStorage.setItem(OTP_EXPIRATION_KEY, otpExpirationDate.toString());
  }

  useEffect(() => {
    const otpExpirationDate = Number(localStorage.getItem(OTP_EXPIRATION_KEY));
    if (Date.now() < otpExpirationDate) {
      setTimer(Math.ceil((otpExpirationDate - Date.now()) / 1000));
      setIsTimerEnded(false);
    } else {
      handleResetTimer();
    }
  }, []);

  function handleCodeChange(value: string) {
    if (value.length < 6 && errorMessage) setErrorMessage("");
    setCode(value);
  }

  function resendOtp() {
    mutate(
      {
        phone_number: phoneNumber,
      },
      {
        onSuccess: () => {
          toast.success("کد ورود ارسال شد");
        },
        onError: () => {
          setErrorMessage("کد وارد شده اشتباه است.");
        },
      },
    );
  }

  function handleSubmit(value?: string) {
    const otp = value ?? code;

    if (otp.length < 4) return;

    (document.activeElement as HTMLInputElement)?.blur();

    mutate(
      {
        phone_number: phoneNumber,
        code: otp,
      },
      {
        onSuccess: (res) => {
          toast.success("با موفقیت وارد شدید");
          const { accessToken } = res?.result ?? {};
          login(accessToken, "", true);
          close();
          router.push("/");
        },
        onError: () => {
          setErrorMessage("کد وارد شده اشتباه است.");
        },
      },
    );
  }

  return (
    <>
      <div className="flex flex-col items-start gap-2">
        <h6 className="ss02 font-h6-bold flex flex-wrap gap-1.5 text-gray-600">
          کد پیامک شده به شماره{" "}
          <span dir="ltr" className="inline-block text-left">
            {formatPhoneNumber(phoneNumber)}
          </span>{" "}
          را وارد کنید.
        </h6>
        <Button
          className="p-0!"
          variant="text"
          size="small"
          rightIcon={<Pencil />}
          onClick={() => setStep("phoneNumber")}
        >
          تغییر شماره موبایل
        </Button>
      </div>
      <OtpInput
        value={code}
        inputMode="numeric"
        type="tell"
        className="my-6 tablet:my-8"
        inputsContainerClassName="flex justify-center gap-10"
        inputsNumber={4}
        onChange={handleCodeChange}
        onInput={(e) => {
          e.currentTarget.value = convertFaNumberToEnNumber(
            e.currentTarget.value,
          ).replace(/\D/g, "");
        }}
        onEnd={handleSubmit}
        errorMessage={errorMessage}
      />
      <div className="flex items-center justify-center mb-4 space-x-1  text-center">
        {isTimerEnded ? (
          <Button
            className="p-0"
            variant="text"
            size="small"
            onClick={resendOtp}
          >
            ارسال مجدد کد
          </Button>
        ) : (
          <>
            <h6 className="text-gray-700 ss02 font-h6-bold">{remainingTime}</h6>
            <span className="font-button-small text-primary-600/40">
              تا ارسال مجدد کد
            </span>
          </>
        )}
      </div>
      <Button
        size="large"
        isFullWidth
        disabled={code.length < 4 || isPending}
        isLoading={isPending}
        onClick={() => handleSubmit()}
      >
        ورود
      </Button>
    </>
  );
};

export default OtpStep;
