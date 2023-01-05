// /api/edge-flags.ts
import { createEdgeHandler } from "@upstash/edge-flags";

export default createEdgeHandler({
  maxAge: 10,
  redisUrl: process.env.UPSTASH_REDIS_REST_URL!,
  redisToken: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Edge flags only work in edge functions, it will break if you do not set the runtime
 */
export const config = {
  runtime: "experimental-edge",
};
