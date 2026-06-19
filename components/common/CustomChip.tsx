import { isMobile } from "react-device-detect";
import { Chip as OriginalChip } from "@dgshahr/ui-kit";
import { ChipProps } from "@dgshahr/ui-kit/Chip";

const CustomChip = ({ size, ...rest }: ChipProps) => {
  const responsiveSize = size ?? (isMobile ? "small" : "large");
  return <OriginalChip size={responsiveSize} {...rest} />;
};

export default CustomChip;
