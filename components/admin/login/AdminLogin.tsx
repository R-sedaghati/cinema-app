"use client";

import { FormEvent, useState } from "react";
import { Card, Input, Button } from "@dgshahr/ui-kit";
import { useAdminLogin } from "@/lib/services/admin/hook";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";

const AdminLogin = () => {
  const router = useRouter();
  const { mutate: login, isPending } = useAdminLogin();
  const { setUserName, login: loginStore } = useAdminAuthStore();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return;

    login(
      { username: formData.username, password: formData.password },
      {
        onSuccess: (response) => {
          const data = response.result;
          setUserName(data.username);
          loginStore(data.accessToken);
          router.push("/admin/users/");
          if (data?.accessToken) {
            toast.success("خوش آمدید");
          } else {
            toast.error("خطا در ورود");
          }
        },
      },
    );
  };

  return (
    <div className="w-full flex justify-center items-center min-h-dvh">
      <Card wrapperClassName="w-100">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <Input
              labelContent="نام کاربری"
              placeholder="نام کاربری"
              autoFocus
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />

            <Input
              labelContent="رمز عبور"
              type="password"
              placeholder="رمز عبور"
              value={formData.password}
              wrapperClassName="pb-2"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />

            <Button
              type="submit"
              isFullWidth
              disabled={isPending}
              isLoading={isPending}
            >
              ورود
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
