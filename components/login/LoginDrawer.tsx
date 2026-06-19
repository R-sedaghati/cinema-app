"use client";

import { Drawer } from "@dgshahr/ui-kit";

import LoginForm from "@/components/login";
import getDrawerWidth from "@/lib/utils/getDrawerWidth";
import getDrawerPosition from "@/lib/utils/getDrawerPosition";
import useLoginDrawerStore from "@/lib/stores/useLoginDrawerStore";

const LoginDrawer = () => {
  const { isOpen, close } = useLoginDrawerStore();

  return (
    <Drawer
      header={{
        title: "ورود یا ثبت‌نام",
        haveCloseIcon: true,
      }}
      width={getDrawerWidth(420)}
      position={getDrawerPosition()}
      open={isOpen}
      onClose={close}
    >
      <LoginForm />
    </Drawer>
  );
};

export default LoginDrawer;
