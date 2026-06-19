import { Badge as UiKitBadge } from "@dgshahr/ui-kit";
import { BadgeProps } from "@dgshahr/ui-kit/Badge";
import clsx from "clsx";

const Badge = ({ className, color, ...rest }: BadgeProps) => {
  return (
    <UiKitBadge
      className={clsx(
        className,
        color === "warning" ? "text-black!" : "text-white!",
      )}
      color={color}
      {...rest}
    />
  );
};

export default Badge;
