"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const [q, setQ] = useState("");
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-background/70 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center gap-3">
        <Link href="/" className="font-semibold tracking-tight">
          Lenstara
        </Link>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/search?q=${encodeURIComponent(q)}`);
          }}
          className="flex-1 max-w-2xl"
        >
          <Input
            placeholder="Search photos..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
        <Link href="/boards" className="text-sm">
          Boards
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
