import { Suspense } from "react";
import { ArtistsSearchClient } from "../../../components/artists/ArtistsSearchClient";

export default function ArtistsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      {/* Search state is read from useSearchParams, which needs a Suspense boundary. */}
      <Suspense>
        <ArtistsSearchClient />
      </Suspense>
    </div>
  );
}
