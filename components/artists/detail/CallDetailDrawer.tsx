import getDrawerPosition from "@/lib/utils/getDrawerPosition";
import getDrawerWidth from "@/lib/utils/getDrawerWidth";
import { Drawer } from "@dgshahr/ui-kit";
import CallDetail from "./drawer/CallDetail";

const CallDetailDrawer = ({
  open,
  setOpen,
  artistId,
  onSubmitted,
  guest,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  artistId: number;
  onSubmitted: (trackingCode: string) => void;
  guest: boolean;
}) => {
  return (
    <Drawer
      className="site-drawer"
      header={{
        containerClassName: "site-drawer-head",
        haveCloseIcon: true,
      }}
      width={getDrawerWidth(420)}
      position={getDrawerPosition()}
      open={open}
      onClose={() => setOpen(false)}
      containerClassName="min-h-96"
    >
      <CallDetail artistId={artistId} setOpen={setOpen} onSubmitted={onSubmitted} guest={guest} />
    </Drawer>
  );
};

export default CallDetailDrawer;
