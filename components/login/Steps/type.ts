import { Dispatch, SetStateAction } from "react";

export interface StepBaseProps {
  setStep: Dispatch<SetStateAction<"phoneNumber" | "otp">>;
}
