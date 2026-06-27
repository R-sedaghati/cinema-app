"use client";

import {
  useAdminAboutUs,
  useAdminAboutUsUpdate,
  useAdminCreateFaq,
  useAdminFaqList,
  useAdminFaqUpdate,
} from "@/lib/services/admin/hook";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Button, Card, Divider, Input, Textarea } from "@dgshahr/ui-kit";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

function ContentManagement() {
  const queryClient = useQueryClient();
  const { data: faqData } = useAdminFaqList();
  const { data: aboutData } = useAdminAboutUs();

  const { mutate: updateAbout, isPending: isAboutPending } =
    useAdminAboutUsUpdate();

  const { mutate: updateFaq, isPending: isFaqPending } = useAdminFaqUpdate();
  const { mutate: createFaq, isPending: isCreatePending } = useAdminCreateFaq();

  const [aboutText, setAboutText] = useState("");
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  useEffect(() => {
    if (aboutData?.result?.length) {
      setAboutText(aboutData.result[0].text ?? "");
    }
  }, [aboutData]);

  useEffect(() => {
    if (faqData?.result?.length) {
      setFaqs(
        faqData.result.map((item) => ({
          id: item.id,
          question: item.question ?? "",
          answer: item.answer ?? "",
        })),
      );
    }
  }, [faqData]);

  const handleFaqChange = (
    index: number,
    field: "question" | "answer",
    value: string,
  ) => {
    setFaqs((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleAboutSubmit = () => {
    updateAbout(
      { text: aboutText },
      {
        onSuccess: () => {
          toast.success("با موفقیت تغییر کرد");
        },
      },
    );
  };

  const handleFaqSubmit = () => {
    const existing = faqs.filter((f) => f.id > 0);
    const newItems = faqs.filter((f) => f.id === 0);

    const existingUpdate = existing.length
      ? new Promise<void>((resolve, reject) =>
          updateFaq(existing, { onSuccess: () => resolve(), onError: reject }),
        )
      : Promise.resolve();

    const createAll = newItems.map(
      (f) =>
        new Promise<void>((resolve, reject) =>
          createFaq(
            { question: f.question, answer: f.answer },
            { onSuccess: () => resolve(), onError: reject },
          ),
        ),
    );

    Promise.all([existingUpdate, ...createAll])
      .then(() => {
        toast.success("با موفقیت تغییر کرد");
        queryClient.invalidateQueries({ queryKey: ["adminFaqList"] });
      })
      .catch(() => toast.error("خطا در ذخیره‌سازی"));
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center px-5 py-3">
        <p className="font-h5-bold">مدیریت محتوای لندینگ</p>
      </div>

      <Divider className="mt-3" color="gray" size="thin" type="horizontal" />

      <div className="flex flex-col gap-8 bg-gray-100 px-4 pt-5">
        <Card>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p className="font-h3-bold text-error-500">سوالات متداول</p>
              <Button
                variant="outline"
                color="error"
                size="small"
                onClick={() =>
                  setFaqs((prev) => [
                    ...prev,
                    { id: 0, question: "", answer: "" },
                  ])
                }
              >
                افزودن سوال جدید
              </Button>
            </div>

            <Divider color="gray" size="thin" type="horizontal" />

            {faqs.map((faq, index) => (
              <div key={faq.id === 0 ? `new-${index}` : faq.id} className="flex justify-between gap-3">
                <Input
                  labelContent={`سوال ${index + 1}`}
                  placeholder={`سوال ${index + 1} را وارد کنید`}
                  wrapperClassName="w-1/2"
                  value={faq.question}
                  onChange={(e) =>
                    handleFaqChange(index, "question", e.target.value)
                  }
                />

                <Textarea
                  labelContent={`پاسخ سوال ${index + 1}`}
                  placeholder={`پاسخ سوال ${index + 1} را وارد کنید`}
                  wrapperClassName="w-1/2"
                  value={faq.answer}
                  onChange={(e) =>
                    handleFaqChange(index, "answer", e.target.value)
                  }
                />
              </div>
            ))}

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                color="error"
                onClick={() => {
                  if (faqData?.result?.length) {
                    setFaqs(
                      faqData.result.map((item) => ({
                        id: item.id,
                        question: item.question ?? "",
                        answer: item.answer ?? "",
                      })),
                    );
                  }
                }}
              >
                انصراف
              </Button>

              <Button
                color="error"
                isLoading={isFaqPending || isCreatePending}
                disabled={isFaqPending || isCreatePending}
                onClick={handleFaqSubmit}
              >
                ثبت تغییرات
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-4">
            <p className="font-h3-bold text-error-500">درباره آرشیو هنر</p>

            <Divider color="gray" size="thin" type="horizontal" />

            <Textarea
              labelContent="متن درباره آرشیو هنر"
              placeholder="متن درباره آرشیو هنر"
              rows={10}
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                color="error"
                onClick={() => {
                  if (aboutData?.result?.length) {
                    setAboutText(aboutData.result[0].text ?? "");
                  }
                }}
              >
                انصراف
              </Button>

              <Button
                color="error"
                isLoading={isAboutPending}
                disabled={isAboutPending}
                onClick={handleAboutSubmit}
              >
                ثبت تغییرات
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default withNoSSR(ContentManagement);
