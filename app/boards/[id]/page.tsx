import Masonry from "@/components/masonry";
import Image from "next/image";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session)
    return <main className="container mx-auto px-4 py-6">Please sign in.</main>;
  const board = await db.board.findFirst({
    where: { id: params.id, userId: (session as any).user.id },
    include: { items: { orderBy: { position: "asc" } } },
  });
  if (!board)
    return (
      <main className="container mx-auto px-4 py-6">Board not found.</main>
    );
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">{board.title}</h1>
      {board.notes && (
        <p className="text-muted-foreground mb-6">{board.notes}</p>
      )}
      <Masonry>
        {board.items.map((it) => (
          <div key={it.id} className="rounded-2xl overflow-hidden">
            <Image
              src={it.thumbUrl}
              alt={it.alt ?? ""}
              width={600}
              height={800}
            />
          </div>
        ))}
      </Masonry>
    </main>
  );
}
