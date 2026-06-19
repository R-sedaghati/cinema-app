"use client";

import React from "react";
import { SectionId } from "./types";
import Overview from "./Overview";
import FormsList from "./forms-list/FormsList";
import RequestsList from "./requests-list/RequestsList";
import PaymentsList from "./payments/PaymentsList";
import SupportCard from "./SupportCard";
import LogoutCard from "./LogoutCard";

export default function ProfileContent({
  active,
}: Readonly<{ active: SectionId | null }>) {
  switch (active) {
    case "overview":
      return <Overview />;
    case "forms":
      return <FormsList />;
    case "requests":
      return <RequestsList />;
    case "payments":
      return <PaymentsList />;
    case "support":
      return <SupportCard />;
    case "logout":
      return <LogoutCard />;
    default:
      return null;
  }
}
