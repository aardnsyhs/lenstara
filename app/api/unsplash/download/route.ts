import { trackDownload } from "@/lib/unsplash";
import { limiter } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const ip = (await headers()).get("x-forwarded-for") ?? "global";

    if (limiter) {
      const { success } = await limiter.limit(`download:${ip}`);
      if (!success) {
        return new Response("You are being rate limited.", { status: 429 });
      }
    }
  } catch (error) {
    return new Response("Internal server error.", { status: 500 });
  }

  const { download_location } = await req.json();
  if (!download_location) {
    return new Response("Bad Request", { status: 400 });
  }

  await trackDownload(download_location);
  return new Response(null, { status: 204 });
}
