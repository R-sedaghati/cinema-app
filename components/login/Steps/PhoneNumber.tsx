"use client";
import Input from "@dgshahr/ui-kit/Form/Input";
import { ChangeEvent, FC, KeyboardEvent, useState } from "react";
import { StepBaseProps } from "./type";
import useAuthStore from "@/lib/stores/useAuthStore";
import { formatPhoneNumber } from "@/lib/utils/formatPhoneNumber";
import { is_phone_number } from "@/lib/validation/regexValidations";
import convertFaNumberToEnNumber from "@/lib/utils/convertFaNumberToEnNumber";
import Button from "@/components/common/Button";
import { useUserLogin } from "@/lib/services/landing/hook";
import { toast } from "react-toastify";

const OTP_EXPIRATION_KEY = "otpExpirationDate";

const PhoneNumberStep: FC<StepBaseProps> = (props) => {
  const { setStep } = props;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(true);
  const { phoneNumber: storePhoneNumber, setPhoneNumber: setStorePhoneNumber } =
    useAuthStore();

  const { mutate, isPending } = useUserLogin();

  function handleSubmit() {
    if (!isValid) return;

    const cleanedPhone = phoneNumber;

    if (storePhoneNumber && phoneNumber !== storePhoneNumber)
      localStorage.removeItem(OTP_EXPIRATION_KEY);
    else {
      const otpExpirationDate = Number(
        localStorage.getItem(OTP_EXPIRATION_KEY),
      );
      if (!otpExpirationDate)
        localStorage.setItem(
          OTP_EXPIRATION_KEY,
          (Date.now() + 120 * 1000).toString(),
        );
    }
    mutate(
      { phone_number: cleanedPhone },
      {
        onSuccess: () => {
          toast.success("کد ورود ارسال شد");
          setStorePhoneNumber(cleanedPhone);
          setStep("otp");
        },
        onError: (err) => {
          console.error(err);
        },
      },
    );
  }

  function removeSpace(value: string) {
    return value.replace(/\s/g, "");
  }

  function handleChangePhoneNumber(e: ChangeEvent<HTMLInputElement>) {
    let value = formatPhoneNumber(e.currentTarget.value);
    value = removeSpace(formatPhoneNumber(value));

    setPhoneNumber(value);
    if (value.length >= 11) setIsValid(is_phone_number(value));
    else if (!isValid) setIsValid(true);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (phoneNumber.length > 0) {
        const newValue = removeSpace(
          formatPhoneNumber(phoneNumber.slice(0, -1)),
        );
        if (!isValid) setIsValid(true);
        setPhoneNumber(newValue);
      }
    }
    if (e.key === "Enter" && isValid && phoneNumber.length === 11)
      handleSubmit();
  }

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Input
        value={formatPhoneNumber(phoneNumber)}
        labelContent="شماره موبایل را وارد کنید"
        dir="ltr"
        placeholder="۰۹**  ***  ****"
        className="w-full text-left"
        wrapperClassName="w-full"
        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
        inputMode="tel"
        autoComplete="tel"
        maxLength={13}
        showMaxLength={false}
        onInput={(e) => {
          e.currentTarget.value = convertFaNumberToEnNumber(
            e.currentTarget.value,
          ).replaceAll(/\D/g, "");
        }}
        type="tel"
        autoFocus
        onKeyDown={handleKeyDown}
        onChange={handleChangePhoneNumber}
        onClear={() => setPhoneNumber("")}
        errorMessage={isValid ? "" : "شماره موبایل اشتباه است."}
      />
      <Button
        className="mt-4 rounded-full!"
        size="large"
        isFullWidth
        isLoading={isPending}
        disabled={isPending}
        onClick={handleSubmit}
      >
        دریافت کد
      </Button>
    </div>
  );
};

export default PhoneNumberStep;
