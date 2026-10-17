import { notFound, redirect } from "next/navigation";

// Admin-managed short links: /<slug> → target. Static routes (/admin, /artists, …)
// win over this dynamic segment, so it only sees otherwise-unmatched paths.
export default async function ShortLinkRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Mirrors the backend slug rule; skips a round-trip for junk like favicon probes.
  if (!/^[a-z0-9-]{1,64}$/i.test(slug)) notFound();

  const origin = process.env.API_ORIGIN ?? "https://archivehonar.ir";
  const res = await fetch(`${origin}/api/short-links/${slug.toLowerCase()}/`, {
    cache: "no-store",
  }).catch(() => null);
  if (!res?.ok) notFound();

  const { result } = (await res.json()) as { result: { targetUrl: string } };
  redirect(result.targetUrl);
}
