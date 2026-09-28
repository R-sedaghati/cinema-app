"use client";

import React from "react";
import { SectionId } from "./types";
import Overview from "./Overview";
import FormsList from "./forms-list/FormsList";
import MessagesList from "./messages/MessagesList";
import RequestsList from "./requests-list/RequestsList";
import WalletCard from "./wallet/WalletCard";
import SupportTickets from "./support/SupportTickets";
import LogoutCard from "./LogoutCard";

export default function ProfileContent({
  active,
}: Readonly<{ active: SectionId | null }>) {
  switch (active) {
    case "overview":
      return <Overview />;
    case "forms":
      return <FormsList />;
    case "messages":
      return <MessagesList />;
    case "requests":
      return <RequestsList />;
    case "wallet":
      return <WalletCard />;
    case "support":
      return <SupportTickets />;
    case "logout":
      return <LogoutCard />;
    default:
      return null;
  }
}
