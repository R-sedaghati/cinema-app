"use client";

import { useState } from "react";
import { Drawer, Input } from "@dgshahr/ui-kit";
import { toast } from "react-toastify";
import getDrawerWidth from "@/lib/utils/getDrawerWidth";
import getDrawerPosition from "@/lib/utils/getDrawerPosition";
import { useUpdateUserProfile } from "@/lib/services/landing/hook";
import Button from "@/components/common/Button";
import { useLandingCopy } from "@/lib/hooks/useLandingCopy";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CompleteProfileDrawer = ({ open, onClose }: Props) => {
  const { mutate, isPending } = useUpdateUserProfile();
  const copy = useLandingCopy();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    mutate(
      { firstName, lastName },
      {
        onSuccess: () => {
          toast.success(copy("completeProfileSuccess"));
          onClose();
        },
      },
    );
  };

  return (
    <Drawer
      header={{
        title: copy("completeProfileTitle"),
        haveCloseIcon: true,
      }}
      width={getDrawerWidth(420)}
      position={getDrawerPosition()}
      open={open}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4">
        <p className="text-sm text-zinc-400">
          {copy("completeProfileDesc")}
        </p>

        <Input
          id="complete-first-name"
          labelContent={copy("fieldFirstName")}
          required
          placeholder={copy("fieldFirstNamePlaceholder")}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <Input
          id="complete-last-name"
          labelContent={copy("fieldLastName")}
          required
          placeholder={copy("fieldLastNamePlaceholder")}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <Button
          type="submit"
          isLoading={isPending}
          disabled={isPending}
          className="w-full rounded-full!"
          isFullWidth
        >
          {copy("actionSave")}
        </Button>
      </form>
    </Drawer>
  );
};

export default CompleteProfileDrawer;
