import clsx from "clsx";

export const chevronCn = (
  isOpen: boolean,
  disableTransform?: boolean,
): string =>
  clsx(
    !disableTransform && (isOpen ? "rotate-180 text-primary-500" : "rotate-0"),
    !disableTransform && "transition-transform",
  );
