import { EArtistRequestStatus } from "../services/admin/type.ts";

// Whole-word «فرم» only — leaves فرمت / کارفرما alone; ZWNJ isn't a Persian letter, so «فرم‌ها» → «رزومه‌ها».
const FORM_WORD = /(?<![؀-ۿ])فرم(?![؀-ۿ])/g;

/**
 * An approved request is a resume, so category names saying «فرم» read «رزومه» on resume displays.
 * Pass `status` where requests of any status render; omit it where only approved ones do.
 */
export const toResumeName = (name = "", status?: EArtistRequestStatus) =>
  status && status !== EArtistRequestStatus.APPROVED ? name : name.replace(FORM_WORD, "رزومه");
