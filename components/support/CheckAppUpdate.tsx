import { useState } from "react";
import { BazaarUpdate } from "@/plugins/bazaar-update";
import { useRouter } from "next/navigation";

export default function CheckAppUpdate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCheckUpdate = async () => {
    setLoading(true);
    setMessage("");

    try {
      const result = await BazaarUpdate.checkForUpdate();

      if (result.status === "upToDate") {
        setMessage("اپلیکیشن شما به‌روز است.");
        return;
      }

      setMessage("نسخه جدیدی موجود است.");

      await BazaarUpdate.startUpdate();
    } catch (error) {
      console.error("Bazaar update error:", error);
      setMessage("بررسی نسخه جدید با خطا مواجه شد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleCheckUpdate}
          disabled={loading}
          data-card
          className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-4 md:px-6 md:py-6 hover:border-error-500/40 transition-colors group active:scale-[.99]"
        >
          <div>
            <p
              data-el="card-title"
              className="text-sm md:text-base font-semibold text-zinc-100"
            >
              {loading ? "در حال بررسی..." : "بررسی نسخه‌ی جدید"}
            </p>
          </div>
        </button>
        <p
          data-el="card-title"
          className="text-sm md:text-base font-semibold text-zinc-100"
        >
          {message && <p>{message}</p>}{" "}
        </p>
      </div>
      <div className="flex flex-col items-center md:hidden gap-4 w-full">
        <a href="/apk/app-Archivehonar.apk" download="app-Archivehonar.apk">
          <img
            src="/download-android.svg"
            alt="Download Android App"
            className="h-18.75 w-64"
            width={256}
            height={75}
          />
        </a>
        <button
          onClick={() => router.push("https://cafebazaar.ir/app/archive.honar")}
        >
          <img
            src="/download-bazar.svg"
            alt="App Store"
            className="h-18.75 w-64"
            width={256}
            height={75}
          />
        </button>
      </div>
    </div>
  );
}
