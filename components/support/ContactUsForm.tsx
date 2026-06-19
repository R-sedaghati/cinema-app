"use client";
import { Input, Textarea } from "@dgshahr/ui-kit";
import { ChevronLeft } from "lucide-react";
import Button from "../common/Button";

const ContactUsForm = () => {
  return (
    <section className="flex flex-col w-full justify-center items-center">
      <h3 className="text-4xl font-h1-regular mb-6">فرم تماس با پشتیبانی</h3>

      <form className="flex flex-col mt-6 gap-7 border border-error-500/30 shadow-card rounded-4xl p-6 bg-zinc-900/40 w-full">
        <div className="flex flex-wrap gap-2 w-full">
          <Input
            labelContent="نام"
            required
            placeholder="نام خود را وارد کنید."
            wrapperClassName="flex-1"
          />
          <Input
            labelContent="نام خانوادگی"
            required
            placeholder="نام خانوادگی خود را وارد کنید."
            wrapperClassName="flex-1"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-1/2">
          <Input
            labelContent="ایمیل"
            required
            placeholder="ایمیل خود را وارد کنید."
            wrapperClassName="flex-1"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full">
          <Input
            labelContent="دسته بندی موضوع پیام"
            required
            placeholder="دسته‌بندی موضوع پیام را انتخاب کنید"
            wrapperClassName="flex-1"
          />
          <Input
            labelContent="موضوع پیام"
            required
            placeholder=" موضوع پیام خود را وارد کنید."
            wrapperClassName="flex-1"
          />
        </div>
        <Textarea
          labelContent="پیام شما"
          rows={4}
          required
          wrapperClassName="flex-1"
          placeholder="پیام تفصیلی خود را بنویسید . . ."
        />
        <div className="flex justify-center items-center gap-3">
          <Button className="rounded-full!" leftIcon={<ChevronLeft />}>
            ارسال پیام
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ContactUsForm;
