import { isMobile } from 'react-device-detect';

export default function getDrawerPosition() {
  return isMobile ? 'bottom' : 'center';
}
