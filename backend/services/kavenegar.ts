import { KavenegarApi } from "kavenegar";
import { configs } from "../config/configs.js";


if (!configs.kavenegarApiKey) {
  throw new Error("Kavenegar API key is not defined");
}

const api = KavenegarApi({ apikey: configs.kavenegarApiKey });

export const sendSms = async (
  message: string,
  sender: string,
  receptor: string
): Promise<{ success: boolean; response?: any; error?: any }> => {
  return new Promise((resolve) => {
    api.Send(
      { message, sender, receptor },
      (response: any, status: number) => {
        if (status === 200) {
          resolve({ success: true, response });
        } else {
          resolve({ success: false, error: response });
        }
      }
    );
  });
};

export const verifyLookup = async (
  receptor: string,
  token: string,
  template: string
): Promise<{ success: boolean; response?: any; error?: any }> => {
  return new Promise((resolve) => {
    api.VerifyLookup(
      { receptor, token, template },
      (response: any, status: number) => {
        if (status === 200) {
          resolve({ success: true, response });
        } else {
          resolve({ success: false, error: response });
        }
      }
    );
  });
};

