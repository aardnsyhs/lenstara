import { attribution, uFetch } from "@/lib/unsplash";
import Image from "next/image";

export default async function Page({ params }: { params: { id: string } }) {
  const p = await uFetch(`/photos/${params.id}`, {}, 3600);
  const att = attribution(p);
  return (
    <main className="container mx-auto px-4 py-6 grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 overflow-hidden rounded-2xl">
        <Image
          src={p.urls.regular}
          alt={p.alt_description ?? "Photo"}
          width={1600}
          height={900}
          className="w-full h-auto object-cover"
        />
      </div>
      <aside className="space-y-4">
        <a href={att.href} target="_blank" className="underline text-sm">
          {att.text}
        </a>
        <div className="text-sm text-muted-foreground">
          <div>
            Dimensions: {p.width}×{p.height}
          </div>
          {p.exif?.name && <div>Camera: {p.exif.name}</div>}
          {p.location?.name && <div>Location: {p.location.name}</div>}
        </div>
      </aside>
    </main>
  );
}
