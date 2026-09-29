import { toast } from "react-toastify";
import { landingCopy } from "./landingCopy";

export interface IUploadLimits {
  imageMb: number;
  videoMb: number;
}

// Mirrors the backend defaults until site-content lands; the server enforces the real cap.
let limits: IUploadLimits = { imageMb: 10, videoMb: 100 };

/** `useLandingCopy` publishes the admin-set limits here with the copy overrides. */
export const setUploadLimits = (next?: IUploadLimits | null) => {
  if (next) limits = next;
};

const MB = 1024 * 1024;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

// compression target
const MAX_DIMENSION = 1920;
const QUALITY = 0.8;

const fail = (message: string): never => {
  toast.error(message);
  throw new Error(message);
};

/**
 * Validates an image (type + size) and downscales/re-encodes it to JPEG.
 * Returns the original file if compression is unavailable or not a win.
 */
export const prepareImage = async (file: File): Promise<File> => {
  if (!IMAGE_TYPES.includes(file.type))
    fail(landingCopy("uploadImageTypeError"));
  if (file.size > limits.imageMb * MB)
    fail(landingCopy("uploadImageSizeError", { mb: limits.imageMb }));

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", QUALITY),
    );
    if (!blob || blob.size >= file.size) return file;

    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", {
      type: "image/jpeg",
    });
  } catch {
    // ponytail: canvas compression is best-effort, size cap above is the real guard
    return file;
  }
};

/** Validates a video (type + size). No client-side transcoding. */
export const prepareVideo = (file: File): File => {
  if (!VIDEO_TYPES.includes(file.type))
    fail(landingCopy("uploadVideoTypeError"));
  if (file.size > limits.videoMb * MB)
    fail(landingCopy("uploadVideoSizeError", { mb: limits.videoMb }));

  return file;
};
