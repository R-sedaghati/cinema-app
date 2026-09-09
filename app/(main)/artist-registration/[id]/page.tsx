"use client";

import { Suspense } from "react";
import { notFound, useParams } from "next/navigation";
import ArtistRegistrationPageContent from "../ArtistRegistrationPageContent";

export default function ArtistRegistrationEditPage() {
  const params = useParams();
  const raw = Array.isArray(params.id) ? params.id[0] : params.id;
  const editId = Number(raw);

  // `Number("abc")` is NaN, which is falsy — without this the page would fall through
  // to the create flow instead of 404ing.
  if (!raw || !Number.isInteger(editId) || editId <= 0) notFound();

  return (
    <Suspense>
      <ArtistRegistrationPageContent editId={editId} />
    </Suspense>
  );
}
