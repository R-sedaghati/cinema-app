"use client";

import {
  useAdminAboutUs,
  useAdminAboutUsUpdate,
  useAdminCreateFaq,
  useAdminFaqDelete,
  useAdminFaqList,
  useAdminFaqUpdate,
  useAdminSiteContent,
  useAdminSiteContentUpdate,
} from "@/lib/services/admin/hook";
import {
  ISiteContentBenefitItem,
  ISiteContentSupportItem,
} from "@/lib/services/admin/type";
import withNoSSR from "@/lib/utils/withNoSSR";
import { Button, Card, Divider, Input, Textarea } from "@dgshahr/ui-kit";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const emptyBenefits: ISiteContentBenefitItem[] = [
  { title: "", desc: "" },
  { title: "", desc: "" },
  { title: "", desc: "" },
];

const emptySupportItems: ISiteContentSupportItem[] = [
  { title: "", detail: "", footerText: "", buttonValue: "" },
  { title: "", detail: "", footerText: "", buttonValue: "" },
  { title: "", detail: "", footerText: "", buttonValue: "" },
];

function ContentManagement() {
  const queryClient = useQueryClient();
  const { data: faqData } = useAdminFaqList();
  const { data: aboutData } = useAdminAboutUs();
  const { data: siteContentData } = useAdminSiteContent();

  const { mutate: updateAbout, isPending: isAboutPending } =
    useAdminAboutUsUpdate();

  const { mutate: updateFaq, isPending: isFaqPending } = useAdminFaqUpdate();
  const { mutate: createFaq, isPending: isCreatePending } = useAdminCreateFaq();
  const { mutate: deleteFaq, isPending: isDeletePending } =
    useAdminFaqDelete();
  const { mutate: updateSiteContent, isPending: isSiteContentPending } =
    useAdminSiteContentUpdate();

  const [aboutText, setAboutText] = useState("");
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  const [benefits, setBenefits] =
    useState<ISiteContentBenefitItem[]>(emptyBenefits);
  const [supportTitle, setSupportTitle] = useState("");
  const [supportDescription, setSupportDescription] = useState("");
  const [supportItems, setSupportItems] =
    useState<ISiteContentSupportItem[]>(emptySupportItems);
  const [termsTitle, setTermsTitle] = useState("");
  const [termsContent, setTermsContent] = useState("");

  useEffect(() => {
    const content = siteContentData?.result;
    if (!content) return;

    setBenefits(content.benefits?.items ?? emptyBenefits);
    setSupportTitle(content.support?.title ?? "");
    setSupportDescription(content.support?.description ?? "");
    setSupportItems(content.support?.items ?? emptySupportItems);
    setTermsTitle(content.terms?.title ?? "");
    setTermsContent(content.terms?.content ?? "");
  }, [siteContentData]);

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

  const handleFaqDelete = (faq: FaqItem, index: number) => {
    if (faq.id === 0) {
      setFaqs((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    deleteFaq(faq.id, {
      onSuccess: () => {
        toast.success("سوال حذف شد");
        queryClient.invalidateQueries({ queryKey: ["adminFaqList"] });
      },
      onError: () => toast.error("خطا در حذف سوال"),
    });
  };

  const handleBenefitsChange = (
    index: number,
    field: "title" | "desc",
    value: string,
  ) => {
    setBenefits((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleSupportItemChange = (
    index: number,
    field: keyof ISiteContentSupportItem,
    value: string,
  ) => {
    setSupportItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleBenefitsSubmit = () => {
    updateSiteContent(
      { benefits: { items: benefits } },
      {
        onSuccess: () => {
          toast.success("با موفقیت تغییر کرد");
          queryClient.invalidateQueries({ queryKey: ["adminSiteContent"] });
        },
        onError: () => toast.error("خطا در ذخیره‌سازی"),
      },
    );
  };

  const handleSupportSubmit = () => {
    updateSiteContent(
      {
        support: {
          title: supportTitle,
          description: supportDescription,
          items: supportItems,
        },
      },
      {
        onSuccess: () => {
          toast.success("با موفقیت تغییر کرد");
          queryClient.invalidateQueries({ queryKey: ["adminSiteContent"] });
        },
        onError: () => toast.error("خطا در ذخیره‌سازی"),
      },
    );
  };

  const handleTermsSubmit = () => {
    updateSiteContent(
      { terms: { title: termsTitle, content: termsContent } },
      {
        onSuccess: () => {
          toast.success("با موفقیت تغییر کرد");
          queryClient.invalidateQueries({ queryKey: ["adminSiteContent"] });
        },
        onError: () => toast.error("خطا در ذخیره‌سازی"),
      },
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
              <div key={faq.id === 0 ? `new-${index}` : faq.id} className="flex justify-between items-end gap-3">
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

                <Button
                  variant="outline"
                  color="error"
                  size="small"
                  isLoading={faq.id > 0 && isDeletePending}
                  disabled={faq.id > 0 && isDeletePending}
                  onClick={() => handleFaqDelete(faq, index)}
                >
                  <Trash2 size={18} />
                </Button>
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

        <Card>
          <div className="flex flex-col gap-4">
            <p className="font-h3-bold text-error-500">
              کارت‌های ماموریت، چشم‌انداز و مسئولیت (درباره ما)
            </p>

            <Divider color="gray" size="thin" type="horizontal" />

            {benefits.map((item, index) => (
              <div key={index} className="flex justify-between gap-3">
                <Input
                  labelContent={`عنوان کارت ${index + 1}`}
                  wrapperClassName="w-1/3"
                  value={item.title}
                  onChange={(e) =>
                    handleBenefitsChange(index, "title", e.target.value)
                  }
                />

                <Textarea
                  labelContent={`متن کارت ${index + 1}`}
                  wrapperClassName="w-2/3"
                  rows={4}
                  value={item.desc}
                  onChange={(e) =>
                    handleBenefitsChange(index, "desc", e.target.value)
                  }
                />
              </div>
            ))}

            <div className="flex justify-end gap-3">
              <Button
                color="error"
                isLoading={isSiteContentPending}
                disabled={isSiteContentPending}
                onClick={handleBenefitsSubmit}
              >
                ثبت تغییرات
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-4">
            <p className="font-h3-bold text-error-500">مرکز پشتیبانی</p>

            <Divider color="gray" size="thin" type="horizontal" />

            <Input
              labelContent="عنوان بخش پشتیبانی"
              value={supportTitle}
              onChange={(e) => setSupportTitle(e.target.value)}
            />

            <Textarea
              labelContent="توضیحات بخش پشتیبانی"
              rows={3}
              value={supportDescription}
              onChange={(e) => setSupportDescription(e.target.value)}
            />

            {supportItems.map((item, index) => (
              <div key={index} className="flex flex-col gap-3">
                <Divider color="gray" size="thin" type="horizontal" />
                <div className="flex justify-between gap-3">
                  <Input
                    labelContent={`عنوان کارت ${index + 1}`}
                    wrapperClassName="w-1/2"
                    value={item.title}
                    onChange={(e) =>
                      handleSupportItemChange(index, "title", e.target.value)
                    }
                  />

                  <Input
                    labelContent={`متن دکمه کارت ${index + 1}`}
                    wrapperClassName="w-1/2"
                    value={item.buttonValue}
                    onChange={(e) =>
                      handleSupportItemChange(
                        index,
                        "buttonValue",
                        e.target.value,
                      )
                    }
                  />
                </div>

                <Textarea
                  labelContent={`توضیحات کارت ${index + 1}`}
                  rows={3}
                  value={item.detail}
                  onChange={(e) =>
                    handleSupportItemChange(index, "detail", e.target.value)
                  }
                />

                <Input
                  labelContent={`متن پابرگ کارت ${index + 1}`}
                  value={item.footerText}
                  onChange={(e) =>
                    handleSupportItemChange(
                      index,
                      "footerText",
                      e.target.value,
                    )
                  }
                />
              </div>
            ))}

            <div className="flex justify-end gap-3">
              <Button
                color="error"
                isLoading={isSiteContentPending}
                disabled={isSiteContentPending}
                onClick={handleSupportSubmit}
              >
                ثبت تغییرات
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-4">
            <p className="font-h3-bold text-error-500">
              قوانین و حریم خصوصی
            </p>

            <Divider color="gray" size="thin" type="horizontal" />

            <Input
              labelContent="عنوان صفحه"
              value={termsTitle}
              onChange={(e) => setTermsTitle(e.target.value)}
            />

            <Textarea
              labelContent="متن قوانین و حریم خصوصی"
              rows={12}
              value={termsContent}
              onChange={(e) => setTermsContent(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <Button
                color="error"
                isLoading={isSiteContentPending}
                disabled={isSiteContentPending}
                onClick={handleTermsSubmit}
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
