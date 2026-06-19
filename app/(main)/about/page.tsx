import Description from "@/components/about/Description";
import Benefits from "@/components/about/Benefits";

export default function AboutPage() {
  return (
    <div className="relative flex flex-col gap-10 mx-auto max-w-6xl px-4 py-10">
      <Description />
      <Benefits />
      <div
        className="w-170 h-170 rounded-full absolute opacity-20 -top-24 -left-96 -z-1
        bg-radial-primary"
      />
      <div
        className="w-170 h-170 rounded-full absolute opacity-20 bottom-0 -right-96 -z-1
        bg-radial-primary"
      />
    </div>
  );
}
