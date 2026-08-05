import getDrawerPosition from "@/lib/utils/getDrawerPosition";
import getDrawerWidth from "@/lib/utils/getDrawerWidth";
import { Drawer } from "@dgshahr/ui-kit";
import CallDetail from "./drawer/CallDetail";

const CallDetailDrawer = ({
  open,
  setOpen,
  artistId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  artistId: number;
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
      <CallDetail artistId={artistId} setOpen={setOpen} />
    </Drawer>
  );
};

export default CallDetailDrawer;
