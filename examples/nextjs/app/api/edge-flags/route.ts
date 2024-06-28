import { Redis } from "@upstash/redis";

// export const GET = createEdgeHandler({
//   maxAge: 10,
//   redisUrl: process.env.UPSTASH_REDIS_REST_URL!,
//   redisToken: process.env.UPSTASH_REDIS_REST_TOKEN!,
// });

const redis = Redis.fromEnv();

export const GET = async (req: Request) => {
  console.log("URL", req.url);

  return new Response("Hello, world!");
};

// export const runtime = "edge";

// NOTE: For pages router, just default export the handler itself
/*
export default createEdgeHandler({
  maxAge: 10,
  redisUrl: process.env.UPSTASH_REDIS_REST_URL!,
  redisToken: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
*/
