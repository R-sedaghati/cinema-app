import { toast } from "react-toastify";

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB before compression
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100MB

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

// compression target
const MAX_DIMENSION = 1920;
const QUALITY = 0.8;

const fail = (message: string): never => {
  toast.error(message);
  throw new Error(message);
};

const toMB = (bytes: number) => Math.round(bytes / 1024 / 1024);

/**
 * Validates an image (type + size) and downscales/re-encodes it to JPEG.
 * Returns the original file if compression is unavailable or not a win.
 */
export const prepareImage = async (file: File): Promise<File> => {
  if (!IMAGE_TYPES.includes(file.type))
    fail("فرمت تصویر باید JPG، PNG یا WebP باشد.");
  if (file.size > MAX_IMAGE_BYTES)
    fail(`حجم تصویر نباید بیشتر از ${toMB(MAX_IMAGE_BYTES)} مگابایت باشد.`);

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
    fail("فرمت ویدیو باید MP4، WebM یا MOV باشد.");
  if (file.size > MAX_VIDEO_BYTES)
    fail(`حجم ویدیو نباید بیشتر از ${toMB(MAX_VIDEO_BYTES)} مگابایت باشد.`);

  return file;
};
