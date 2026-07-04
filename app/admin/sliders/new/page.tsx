"use client";

import SliderForm from "@/components/admin/slider/SliderForm";
import withNoSSR from "@/lib/utils/withNoSSR";

function SliderCreate() {
  return <SliderForm mode="create" />;
}

export default withNoSSR(SliderCreate);
