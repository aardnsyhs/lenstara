import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : undefined;

export const limiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(50, "1 h"),
      analytics: true,
    })
  : undefined;
