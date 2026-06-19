import getDrawerPosition from "@/lib/utils/getDrawerPosition";
import getDrawerWidth from "@/lib/utils/getDrawerWidth";
import { Drawer } from "@dgshahr/ui-kit";
import CallDetail from "./drawer/CallDetail";

const CallDetailDrawer = ({
  open,
  setOpen,
  setOpenSuccess,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  setOpenSuccess: (open: boolean) => void;
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
      <CallDetail setOpenSuccess={setOpenSuccess} setOpen={setOpen} />
    </Drawer>
  );
};

export default CallDetailDrawer;
