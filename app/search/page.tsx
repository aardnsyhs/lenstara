import Masonry from "@/components/masonry";
import { PhotoCard } from "@/components/photo-card";

async function searchPhotos(q: string, page = 1) {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL ?? ""
    }/api/unsplash/search?q=${encodeURIComponent(q)}&page=${page}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return { results: [] };
  return res.json();
}

export default async function Page({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q ?? "";
  const data = q ? await searchPhotos(q) : { results: [] };
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-xl font-medium mb-4">Search {q && `“${q}”`}</h1>
      {!q || data.results.length === 0 ? (
        <div className="text-muted-foreground">
          Type a keyword above to find photos.
        </div>
      ) : (
        <Masonry>
          {data.results.map((p: any) => (
            <PhotoCard key={p.id} photo={p} />
          ))}
        </Masonry>
      )}
    </main>
  );
}
