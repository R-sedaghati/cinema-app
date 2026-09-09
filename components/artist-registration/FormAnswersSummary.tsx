"use client";

import { EFormFieldType, IFormStep } from "@/lib/services/admin/type";
import { CopyFn } from "@/lib/utils/formCopy";
import { landingCopy } from "@/lib/utils/landingCopy";

interface Props {
  steps: IFormStep[];
  answers: Record<string, unknown>;
  copy: CopyFn;
  /** Storage path -> presigned url, for answers that hold uploaded files. */
  portfolioUrls?: Record<string, string>;
}

const isFileField = (type: EFormFieldType) =>
  type === EFormFieldType.IMAGE || type === EFormFieldType.VIDEO;

const toList = (value: unknown): string[] =>
  Array.isArray(value) ? (value as string[]) : value ? [value as string] : [];

/**
 * The read-only rendering of a filled form — the review step of the flow and the profile's
 * "view my form" page are the same list of label/value pairs.
 */
const FormAnswersSummary: React.FC<Props> = ({
  steps,
  answers,
  copy,
  portfolioUrls = {},
}) => (
  <div className="flex flex-col gap-4">
    {steps.map((step) => (
      <div key={step.id} className="flex flex-col gap-2">
        <p className="font-h6-bold">{step.title}</p>
        <div className="grid md:grid-cols-2 gap-2">
          {[...step.fields]
            .sort((a, b) => a.order - b.order)
            .map((field) => {
              const value = answers[field.key];

              if (isFileField(field.type)) {
                const paths = toList(value);

                return (
                  <div key={field.id} className="flex flex-col gap-1">
                    <p className="font-p2-medium text-gray-500">{field.label}:</p>
                    {paths.length === 0 ? (
                      <p className="font-p2-regular">{copy("emptyValue")}</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {paths.map((path) =>
                          field.type === EFormFieldType.IMAGE ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={path}
                              src={portfolioUrls[path] ?? path}
                              alt={field.label}
                              className="size-24 rounded-lg object-cover"
                            />
                          ) : (
                            <video
                              key={path}
                              src={portfolioUrls[path] ?? path}
                              controls
                              className="h-24 rounded-lg"
                            />
                          ),
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              const display =
                typeof value === "boolean"
                  ? value
                    ? copy("booleanYes")
                    : copy("booleanNo")
                  : Array.isArray(value)
                    ? value.join(landingCopy("listSeparator"))
                    : ((value as string | number | undefined) ??
                      copy("emptyValue"));

              return (
                <div key={field.id} className="flex gap-1">
                  <p className="font-p2-medium text-gray-500">{field.label}:</p>
                  <p className="font-p2-regular">{String(display)}</p>
                </div>
              );
            })}
        </div>
      </div>
    ))}
  </div>
);

export default FormAnswersSummary;
