import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { limiter } from "@/lib/rate-limit";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session || !session.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const board = await db.board.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!board) {
    return new Response("Board not found or access denied", { status: 404 });
  }

  try {
    if (limiter) {
      const identifier = session.user.id;
      const { success } = await limiter.limit(`item_create:${identifier}`);
      if (!success) {
        return new Response("Rate limit exceeded", { status: 429 });
      }
    }
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }

  const { photoId, alt, thumbUrl, fullUrl, author, colorHex, position } =
    await req.json();

  const item = await db.boardItem.create({
    data: {
      boardId: params.id,
      photoId,
      alt,
      thumbUrl,
      fullUrl,
      author,
      colorHex,
      position: position ?? 0,
    },
  });
  return Response.json(item, { status: 201 });
}
