import Link from "next/link";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession();
  if (!session)
    return (
      <main className="container mx-auto px-4 py-6">
        Please sign in to use Boards.
      </main>
    );
  const boards = await db.board.findMany({
    where: { userId: (session as any).user.id },
  });
  return (
    <main className="container mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Boards</h1>
        <Link className="border rounded-xl px-3 py-2" href="/boards/new">
          New Board
        </Link>
      </div>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((b) => (
          <li key={b.id} className="rounded-2xl border p-4">
            <Link href={`/boards/${b.id}`} className="font-medium">
              {b.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
