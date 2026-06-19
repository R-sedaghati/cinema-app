import getDrawerPosition from "@/lib/utils/getDrawerPosition";
import getDrawerWidth from "@/lib/utils/getDrawerWidth";
import { Drawer } from "@dgshahr/ui-kit";
import Success from "./drawer/Success";

const SuccessDrawer = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <Drawer
      header={{
        haveCloseIcon: true,
      }}
      width={getDrawerWidth(420)}
      position={getDrawerPosition()}
      open={open}
      onClose={() => setOpen(false)}
      containerClassName="min-h-96"
    >
      <Success />
    </Drawer>
  );
};

export default SuccessDrawer;
