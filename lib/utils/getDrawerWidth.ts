import { isMobile } from 'react-device-detect';

export default function getDrawerWidth(desktopSize = 980) {
  return isMobile ? undefined : desktopSize;
}
