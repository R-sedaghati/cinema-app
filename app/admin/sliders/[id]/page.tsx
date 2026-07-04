"use client";

import SliderForm from "@/components/admin/slider/SliderForm";
import { useAdminBannerRetrieve } from "@/lib/services/admin/hook";
import withNoSSR from "@/lib/utils/withNoSSR";
import { useParams } from "next/navigation";

function SliderEdit() {
  const params = useParams();
  const id = Number(params.id);

  const { data } = useAdminBannerRetrieve(id);

  return <SliderForm mode="edit" id={id} initialData={data?.result} />;
}

export default withNoSSR(SliderEdit);
