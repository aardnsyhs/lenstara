import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { limiter } from "@/lib/rate-limit";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session || !session.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    if (limiter) {
      const identifier = session.user.id;
      const { success } = await limiter.limit(`board_get:${identifier}`);
      if (!success) {
        return new Response("Rate limit exceeded", { status: 429 });
      }
    }
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }

  const board = await db.board.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: { items: { orderBy: { position: "asc" } } },
  });
  if (!board) return new Response("Not Found", { status: 404 });
  return Response.json(board);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session || !session.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    if (limiter) {
      const identifier = session.user.id;
      const { success } = await limiter.limit(`board_patch:${identifier}`);
      if (!success) {
        return new Response("Rate limit exceeded", { status: 429 });
      }
    }
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }

  const data = await req.json();
  const board = await db.board.update({
    where: { id: params.id, userId: session.user.id },
    data,
  });
  return Response.json(board);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session || !session.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    if (limiter) {
      const identifier = session.user.id;
      const { success } = await limiter.limit(`board_delete:${identifier}`);
      if (!success) {
        return new Response("Rate limit exceeded", { status: 429 });
      }
    }
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }

  await db.board.delete({
    where: { id: params.id, userId: session.user.id },
  });
  return new Response(null, { status: 204 });
}
