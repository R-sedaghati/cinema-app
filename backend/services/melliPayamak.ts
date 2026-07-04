import { createRequire } from "module";
import { configs } from "../config/configs.js";

const require = createRequire(import.meta.url);
const MelipayamakApi = require("melipayamak");

export const sendMelliSms = async (
  receptor: string,
  sender: string,
  message: string
): Promise<{ success: boolean; response?: any; error?: any }> => {
  try {
    const username = configs.melliPayamakUsername;
    const password = configs.melliPayamakPassword;

    const api = new MelipayamakApi(username, password);
    const sms = api.sms();

    const res = await sms.send(receptor, sender, message);

    return { success: true, response: res };
  } catch (err) {
    return { success: false, error: err };
  }
};


export const sendMelliPatternSMS = async (
  receptor: string,
  bodyId: string,
  inputs: string
): Promise<{ success: boolean; response?: any; error?: any }> => {
  try {
    const username = configs.melliPayamakUsername;
    const password = configs.melliPayamakPassword;

    const api = new MelipayamakApi(username, password);
    const sms = api.sms();

    const res = await sms.sendByBaseNumber(inputs, receptor, bodyId);

    return { success: true, response: res };
  } catch (err) {
    return { success: false, error: err };
  }
};