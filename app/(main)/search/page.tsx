import { Suspense } from "react";
import { SearchClient } from "./SearchClient";

export default function SearchPage() {
  return (
    <div data-page className="mx-auto max-w-6xl px-4 py-10">
      {/* The query is read from useSearchParams, which needs a Suspense boundary. */}
      <Suspense>
        <SearchClient />
      </Suspense>
    </div>
  );
}
