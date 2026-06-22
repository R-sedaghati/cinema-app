"use client";

import { useMemo, useState } from "react";
import { Input, Select, Textarea } from "@dgshahr/ui-kit";
import { ChevronLeft } from "lucide-react";
import Button from "../common/Button";
import {
  useCreateUserSupport,
  useUserCategoryList,
} from "@/lib/services/landing/hook";
import { toast } from "react-toastify";

interface UserCreateSupport {
  first_name: string;
  last_name: string;
  email: string;
  category_id: number | null;
  sub_category_id: number | null;
  subject: string;
  message: string;
  phone_number: string;
}

const initialState: UserCreateSupport = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  category_id: null,
  sub_category_id: null,
  subject: "",
  message: "",
};

const ContactUsForm = () => {
  const { mutate, isPending } = useCreateUserSupport();
  const { data } = useUserCategoryList({ page: 1, count: 16 });

  const [form, setForm] = useState<UserCreateSupport>(initialState);

  const handleChange = <K extends keyof UserCreateSupport>(
    key: K,
    value: UserCreateSupport[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const subCategoryOptions = useMemo(() => {
    if (!form.category_id) return [];

    const selectedCategory = data?.result?.find(
      (item) => item.id === form.category_id,
    );

    return (
      selectedCategory?.children?.map((child) => ({
        label: child.faName,
        value: child.id,
      })) ?? []
    );
  }, [data, form.category_id]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone_number: form.phone_number,
        category_id: form.sub_category_id,
        subject: form.subject,
        message: form.message,
      },
      {
        onSuccess: () => {
          toast.success("درخواست شما با موفقیت ارسال شد.");
          setForm(initialState);
        },
        onError: () => {
          toast.error("ارسال درخواست با خطا مواجه شد.");
        },
      },
    );
  };

  return (
    <section className="flex flex-col w-full justify-center items-center">
      <h3 className="text-4xl font-h1-regular mb-6">فرم تماس با پشتیبانی</h3>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col mt-6 gap-7 border border-error-500/30 shadow-card rounded-4xl p-6 bg-zinc-900/40 w-full"
      >
        <div className="flex flex-wrap gap-2 w-full">
          <Input
            labelContent="نام"
            required
            value={form.first_name}
            onChange={(e) => handleChange("first_name", e.target.value)}
            placeholder="نام خود را وارد کنید."
            wrapperClassName="flex-1"
          />

          <Input
            labelContent="نام خانوادگی"
            required
            value={form.last_name}
            onChange={(e) => handleChange("last_name", e.target.value)}
            placeholder="نام خانوادگی خود را وارد کنید."
            wrapperClassName="flex-1"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full">
          <Input
            labelContent="ایمیل"
            required
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="ایمیل خود را وارد کنید."
            wrapperClassName="flex-1"
          />

          <Input
            labelContent="شماره تلفن"
            required
            value={form.phone_number}
            onChange={(e) => handleChange("phone_number", e.target.value)}
            placeholder="شماره تلفن خود را وارد کنید."
            wrapperClassName="flex-1"
            maxLength={11}
          />
        </div>

        <div className="flex gap-2 w-full">
          <Select
            inputProps={{
              labelContent: "دسته بندی اصلی",
              placeholder: "دسته بندی اصلی موضوع پیام را انتخاب کنید",
              required: true,
            }}
            mode="single"
            wrapperClassName="w-full"
            onChange={(value) => {
              setForm((prev) => ({
                ...prev,
                category_id: value,
                sub_category_id: null,
              }));
            }}
            value={form.category_id}
            options={
              data?.result?.map((item) => ({
                label: item.faName,
                value: item.id,
              })) ?? []
            }
          />
          <Select
            inputProps={{
              labelContent: "دسته بندی فرعی",
              placeholder: "دسته بندی فرعی موضوع پیام را انتخاب کنید",
              required: true,
            }}
            mode="single"
            wrapperClassName="w-full"
            value={form.sub_category_id}
            onChange={(value) => handleChange("sub_category_id", value)}
            options={subCategoryOptions}
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full">
          <Input
            labelContent="موضوع پیام"
            required
            value={form.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            placeholder="موضوع پیام خود را وارد کنید."
            wrapperClassName="flex-1"
          />
        </div>

        <Textarea
          labelContent="پیام شما"
          rows={4}
          required
          value={form.message}
          onChange={(e) => handleChange("message", e.target.value)}
          wrapperClassName="flex-1"
          placeholder="پیام تفصیلی خود را بنویسید . . ."
        />

        <div className="flex justify-center items-center gap-3">
          <Button
            type="submit"
            isLoading={isPending}
            disabled={isPending}
            className="rounded-full!"
            leftIcon={<ChevronLeft />}
          >
            ارسال پیام
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ContactUsForm;
