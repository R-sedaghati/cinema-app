"use client";

import { Suspense } from "react";
import ArtistRegistrationPageContent from "./ArtistRegistrationPageContent";

export default function ArtistRegistrationPage() {
  return (
    <Suspense>
      <ArtistRegistrationPageContent editId={null} />
    </Suspense>
  );
}
