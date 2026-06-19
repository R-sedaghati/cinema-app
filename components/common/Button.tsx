import { Button as UiKitButton } from "@dgshahr/ui-kit";
import { ButtonProps } from "@dgshahr/ui-kit/Button";
import clsx from "clsx";

const Button = ({
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonProps) => {
  const isPrimary = variant === "primary" || !variant;

  return (
    <UiKitButton
      variant={variant}
      className={clsx(isPrimary && "text-white!", className)}
      {...rest}
    >
      {children}
    </UiKitButton>
  );
};

export default Button;
