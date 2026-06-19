// regex patterns
const pattern_phone_number = /^09[01239]\d{8}$/;
const pattern_only_digit = /^\d*$/;
const pattern_persian_word = /^[\u0600-\u06FF\s]+$/;
const pattern_web_protocol = /https?:\/\//g;
const pattern_images_type = /\.(jpg|jpeg|png|gif)$/;
const pattern_videos_type =
  /\.(mp4|avi|wmv|mov|flv|mkv|webm|vob|ogv|m4v|3gp|3g2|mpeg|mpg|m2v|m4v)$/;

// validations
export const is_phone_number = (value: string) =>
  pattern_phone_number.test(value) && value.length < 12;
export const is_number = (value: string) => pattern_only_digit.test(value);
export const is_persian = (value: string) => pattern_persian_word.test(value);
export const has_web_protocol = (value: string) =>
  pattern_web_protocol.test(value);
export const is_image = (file_type: string) =>
  pattern_images_type.test(file_type.toLocaleLowerCase());
export const is_video = (file_type: string) =>
  pattern_videos_type.test(file_type.toLocaleLowerCase());
