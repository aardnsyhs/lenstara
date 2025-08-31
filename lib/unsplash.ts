const BASE = "https://api.unsplash.com";
const APP = process.env.NEXT_PUBLIC_APP_NAME!;

export function addUtm(url: string) {
  const u = new URL(url);
  if (!u.searchParams.get("utm_source")) u.searchParams.set("utm_source", APP);
  if (!u.searchParams.get("utm_medium"))
    u.searchParams.set("utm_medium", "referral");
  return u.toString();
}

export async function uFetch(
  path: string,
  init: RequestInit = {},
  revalidate = 3600
) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      ...init.headers,
    },
    next: { revalidate, tags: ["unsplash"] },
  });
  if (!res.ok) throw new Error(`Unsplash ${res.status}`);
  return res.json();
}

export function attribution(photo: any) {
  const name = photo?.user?.name ?? photo?.user?.username ?? "Unknown";
  const href = addUtm(photo?.user?.links?.html ?? "https://unsplash.com");
  return { text: `Foto oleh ${name} di Unsplash`, href };
}

export async function trackDownload(download_location: string) {
  const url = new URL(download_location);
  url.searchParams.set("client_id", process.env.UNSPLASH_ACCESS_KEY!);
  return fetch(url.toString(), { cache: "no-store" });
}
