import Banner from "@/components/home/banner/Banner";
import MainHeader from "@/components/home/main-header/MainHeader";
import Reasons from "@/components/home/reasons/Reasons";
import Statistics from "@/components/home/statistics/Statistics";
import { FaqClient } from "../faq/FaqClient";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-32">
      <MainHeader />
      <Statistics />
      <Banner />
      <Reasons />
      <FaqClient />
    </div>
  );
}
