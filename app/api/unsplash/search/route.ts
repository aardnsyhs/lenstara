import { uFetch } from "@/lib/unsplash";
import { limiter } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function GET(req: Request) {
  try {
    const ip = (await headers()).get("x-forwarded-for") ?? "global";

    if (limiter) {
      const { success } = await limiter.limit(`unsplash:${ip}`);
      if (!success) {
        return new Response("You are being rate limited.", { status: 429 });
      }
    }
  } catch (error) {
    return new Response("Internal server error.", { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const color = searchParams.get("color") ?? "";
  const orientation = searchParams.get("orientation") ?? "";
  const page = Number(searchParams.get("page") ?? 1);

  const qs = new URLSearchParams({
    query: q,
    page: String(page),
    per_page: "30",
  });
  if (color) qs.set("color", color);
  if (orientation) qs.set("orientation", orientation);

  const data = await uFetch(`/search/photos?${qs.toString()}`, {}, 300);
  return Response.json(data, {
    headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=86400" },
  });
}
