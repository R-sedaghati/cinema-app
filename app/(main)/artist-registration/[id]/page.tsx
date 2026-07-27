"use client";

import { useParams } from "next/navigation";
import ArtistRegistrationPageContent from "../ArtistRegistrationPageContent";

export default function ArtistRegistrationEditPage() {
  const params = useParams();
  const editId = Number(params.id);

  return <ArtistRegistrationPageContent editId={editId} />;
}
