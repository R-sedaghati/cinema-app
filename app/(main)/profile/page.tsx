import { Suspense } from "react";
import { ProfileClient } from "@/app/(main)/profile/ProfileClient";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-7 md:pt-0">
      {/* ProfileClient reads the callback's query string, so it needs a boundary. */}
      <Suspense>
        <ProfileClient />
      </Suspense>
    </div>
  );
}
