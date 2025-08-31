"use client";
import Image from "next/image";
import { useState } from "react";

export function PhotoCard({ photo }: { photo: any }) {
  const [loading, setLoading] = useState(false);
  const profile = `${photo.user.links.html}?utm_source=${process.env.NEXT_PUBLIC_APP_NAME}&utm_medium=referral`;
  async function handleDownload() {
    setLoading(true);
    await fetch("/api/unsplash/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        download_location: photo.links.download_location,
      }),
    });
    setLoading(false);
    window.open(
      `${photo.links.download}?utm_source=${process.env.NEXT_PUBLIC_APP_NAME}&utm_medium=referral`,
      "_blank"
    );
  }
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-muted/30">
      <Image
        alt={photo.alt_description ?? "Photo"}
        src={photo.urls.small}
        width={600}
        height={800}
        className="w-full h-auto object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent text-white">
        <a
          href={profile}
          target="_blank"
          rel="noopener"
          className="text-xs opacity-90 hover:opacity-100"
        >
          {photo.user.name} / Unsplash
        </a>
        <button
          onClick={handleDownload}
          disabled={loading}
          className="text-xs rounded-full px-3 py-1 bg-white/90 text-black"
        >
          {loading ? "..." : "Download"}
        </button>
      </div>
    </div>
  );
}
