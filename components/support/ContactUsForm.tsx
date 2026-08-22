"use client";

import { useMemo, useState } from "react";
import { Select } from "@dgshahr/ui-kit";
import { ChevronLeft } from "lucide-react";
import Button from "../common/Button";
import FieldRenderer from "../artist-registration/fields/FieldRenderer";
import {
  useCreateUserSupport,
  useUserCategoryList,
  useUserSiteContent,
} from "@/lib/services/landing/hook";
import { appendCustomAnswers, contactFormOf } from "@/lib/constants/contactForm";
import { EFormFieldType } from "@/lib/services/admin/type";
import type { IContactFormField, IFormField, IFormStep } from "@/lib/services/admin/type";
import { getStepErrors } from "@/lib/utils/validateFormStep";
import { toast } from "react-toastify";

/** The dynamic definition carries no ids/order, which FieldRenderer expects. */
const asFormField = (field: IContactFormField, index: number): IFormField => ({
  id: index,
  key: field.key,
  label: field.label,
  type: field.type,
  placeholder: field.placeholder ?? null,
  helpText: field.helpText ?? null,
  required: field.required,
  order: index,
  options: field.options ?? null,
  validation: field.validation ?? null,
});

const ContactUsForm = () => {
  const { mutate, isPending } = useCreateUserSupport();
  const { data } = useUserCategoryList({ page: 1, count: 30 });
  const { data: siteContent } = useUserSiteContent();

  const form = useMemo(
    () => contactFormOf(siteContent?.result?.contactForm),
    [siteContent],
  );

  const [answers, setAnswers] = useState<Record<string, unknown>>({});

  const setAnswer = (key: string, value: unknown) =>
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
      // Changing the parent category invalidates the child one.
      ...(key === "category" ? { subCategory: null } : {}),
    }));

  const categories = useMemo(() => data?.result ?? [], [data]);
  const subCategoryOptions = useMemo(() => {
    const parent = categories.find((item) => item.id === answers.category);
    return parent?.children?.map((child) => ({ label: child.faName, value: child.id })) ?? [];
  }, [categories, answers.category]);

  const text = (key: string) => String(answers[key] ?? "").trim();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // The category selects are not FieldRenderer fields, so they are checked here.
    const missingCategory = form.fields.find(
      (field) =>
        field.required &&
        (field.key === "category" || field.key === "subCategory") &&
        !answers[field.key],
    );

    if (missingCategory) {
      toast.error(`${missingCategory.label} الزامی است`);
      return;
    }

    const step = {
      id: 0,
      title: form.title,
      order: 0,
      icon: null,
      fields: form.fields
        .filter((field) => !["category", "subCategory"].includes(field.key))
        .map(asFormField),
    } satisfies IFormStep;

    const errors = getStepErrors(step, answers);

    if (errors.length) {
      toast.error(errors[0]);
      return;
    }

    mutate(
      {
        first_name: text("firstName"),
        last_name: text("lastName"),
        email: text("email"),
        phone_number: text("phoneNumber"),
        category_id: (answers.subCategory ?? answers.category ?? null) as number | null,
        subject: text("subject"),
        message: appendCustomAnswers(text("message"), form.fields, answers),
      },
      {
        onSuccess: () => {
          toast.success("درخواست شما با موفقیت ارسال شد.");
          setAnswers({});
        },
        onError: () => {
          toast.error("ارسال درخواست با خطا مواجه شد.");
        },
      },
    );
  };

  return (
    <section className="flex flex-col w-full justify-center items-center">
      <h3 className="text-4xl font-h1-regular mb-6">{form.title}</h3>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col mt-6 gap-7 border border-error-500/30 shadow-card rounded-4xl p-6 bg-zinc-900/40 w-full"
      >
        {form.fields.map((field, index) => {
          if (field.key === "category" || field.key === "subCategory") {
            const isSub = field.key === "subCategory";

            return (
              <Select
                key={field.key}
                inputProps={{
                  labelContent: field.label,
                  placeholder: field.placeholder ?? "",
                  required: field.required,
                }}
                mode="single"
                wrapperClassName="w-full"
                value={(answers[field.key] ?? null) as number | null}
                onChange={(value) => setAnswer(field.key, value)}
                options={
                  isSub
                    ? subCategoryOptions
                    : categories.map((item) => ({ label: item.faName, value: item.id }))
                }
              />
            );
          }

          return (
            <FieldRenderer
              key={field.key}
              field={asFormField(field, index)}
              value={answers[field.key] ?? (field.type === EFormFieldType.CHECKBOX ? [] : "")}
              onChange={(value) => setAnswer(field.key, value)}
            />
          );
        })}

        <div className="flex justify-center items-center gap-3">
          <Button
            type="submit"
            isLoading={isPending}
            disabled={isPending}
            className="rounded-full!"
            leftIcon={<ChevronLeft />}
          >
            {form.submitLabel}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ContactUsForm;
