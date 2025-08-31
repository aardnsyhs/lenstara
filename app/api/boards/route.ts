import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { limiter } from "@/lib/rate-limit";

export async function GET() {
  const session = await getServerSession();
  if (!session || !session.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    if (limiter) {
      const identifier = session.user.id;
      const { success } = await limiter.limit(`boards_get:${identifier}`);
      if (!success) {
        return new Response("Rate limit exceeded", { status: 429 });
      }
    }
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }

  const boards = await db.board.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(boards);
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session || !session.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    if (limiter) {
      const identifier = session.user.id;
      const { success } = await limiter.limit(`boards_get:${identifier}`);
      if (!success) {
        return new Response("Rate limit exceeded", { status: 429 });
      }
    }
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }

  const { title, notes } = await req.json();
  const board = await db.board.create({
    data: { title, notes, userId: (session as any).user.id },
  });
  return Response.json(board, { status: 201 });
}
