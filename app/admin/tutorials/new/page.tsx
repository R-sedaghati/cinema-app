"use client";

import TutorialForm from "@/components/admin/tutorial/TutorialForm";
import withNoSSR from "@/lib/utils/withNoSSR";

function TutorialCreate() {
  return <TutorialForm mode="create" />;
}

export default withNoSSR(TutorialCreate);
