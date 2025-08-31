import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { limiter } from "@/lib/rate-limit";
import { headers } from "next/headers";

const unsplashProvider = {
  id: "unsplash",
  name: "Unsplash",
  type: "oauth" as const,
  clientId: process.env.UNSPLASH_ACCESS_KEY,
  clientSecret: process.env.UNSPLASH_SECRET,
  authorization: {
    url: "https://unsplash.com/oauth/authorize",
    params: { scope: "public read_user write_likes" },
  },
  token: "https://unsplash.com/oauth/token",
  userinfo: "https://api.unsplash.com/me",
  profile(profile: any) {
    return {
      id: profile.id,
      name: profile.name ?? profile.username,
      email: profile.email ?? `${profile.username}@users.unsplash.local`,
      image:
        profile.profile_image?.medium ?? profile.profile_image?.large ?? null,
    };
  },
};

const authHandler = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [unsplashProvider as any],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account) token.access_token = (account as any).access_token;
      return token;
    },
    async session({ session, token }) {
      (session as any).access_token = (token as any).access_token;
      return session;
    },
  },
});

const handler = async (req: Request, context: any) => {
  try {
    const ip = (await headers()).get("x-forwarded-for") ?? "global";

    if (limiter) {
      const { success } = await limiter.limit(`auth:${ip}`);
      if (!success) {
        return new Response("You are being rate limited.", { status: 429 });
      }
    }
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }

  return authHandler(req, context);
};

export { handler as GET, handler as POST };
