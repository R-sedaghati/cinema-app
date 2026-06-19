import ContactUsForm from "@/components/support/ContactUsForm";
import SupportCenter from "@/components/support/SupportCenter";

export default function SupportPage() {
  return (
    <div className="relative mx-auto max-w-6xl px-4 py-10 space-y-20">
      <SupportCenter />
      <ContactUsForm />
      <div
        className="w-170 h-170 rounded-full absolute opacity-20 -top-24 -left-96 -z-1
        bg-radial-primary"
      />
      <div
        className="w-170 h-170 rounded-full absolute opacity-20 bottom-44 -right-96 -z-1
        bg-radial-primary"
      />
    </div>
  );
}
