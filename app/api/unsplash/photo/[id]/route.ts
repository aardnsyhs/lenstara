import { uFetch } from "@/lib/unsplash";
import { limiter } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const ip = (await headers()).get("x-forwarded-for") ?? "global";

    if (limiter) {
      const { success } = await limiter.limit(`photo:${ip}`);
      if (!success) {
        return new Response("You are being rate limited.", { status: 429 });
      }
    }
  } catch (error) {
    return new Response("Internal server error.", { status: 500 });
  }

  const data = await uFetch(`/photos/${params.id}`, {}, 3600);
  return Response.json(data, {
    headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" },
  });
}
