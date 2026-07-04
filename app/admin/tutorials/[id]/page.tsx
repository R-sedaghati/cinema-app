"use client";

import TutorialForm from "@/components/admin/tutorial/TutorialForm";
import { useAdminTutorialRetrieve } from "@/lib/services/admin/hook";
import withNoSSR from "@/lib/utils/withNoSSR";
import { useParams } from "next/navigation";

function TutorialEdit() {
  const params = useParams();
  const id = Number(params.id);

  const { data } = useAdminTutorialRetrieve(id);

  return <TutorialForm mode="edit" id={id} initialData={data?.result} />;
}

export default withNoSSR(TutorialEdit);
