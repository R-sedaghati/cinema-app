/**
 * The page-builder preview runs the real home page in an iframe (so media queries
 * see the chosen device width) and gets the unsaved draft over postMessage.
 */
export const PREVIEW_PATH = "/page-builder-preview";
export const PREVIEW_READY = "page-builder-preview:ready";
export const PREVIEW_DRAFT = "page-builder-preview:draft";
