"use client";

import type { CopyFn } from "@/lib/utils/formCopy";

const FormTitleSection: React.FC<{ copy: CopyFn; categoryTitle: string }> = ({
  copy,
  categoryTitle,
}) => (
  <p className="font-h2-bold mt-5 mb-1 md:mb-7 md:mt-0">
    <span style={copy.style("formTitle")}>{copy("formTitle", { category: categoryTitle })}</span>
  </p>
);

export default FormTitleSection;
