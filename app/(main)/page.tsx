import Masonry from "@/components/masonry";
import { PhotoCard } from "@/components/photo-card";
import { uFetch } from "@/lib/unsplash";

export const revalidate = 300;

export default async function Page() {
  const photos = await uFetch("/photos?order_by=popular&per_page=30", {}, 300);
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
        Discover
      </h1>
      <Masonry>
        {photos.map((p: any) => (
          <PhotoCard key={p.id} photo={p} />
        ))}
      </Masonry>
    </main>
  );
}
