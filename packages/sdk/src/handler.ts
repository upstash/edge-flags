import { Redis } from "@upstash/redis";
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";

import { Admin } from "./admin";
import { evaluate } from "./evaluation";
import { EvalRequest } from "./rules";
import { Environment, Flag } from "./types";
import { Cache } from "./cache";
import { VERSION } from "./version";

export type HandlerConfig = (
  | {
      redisUrl: string;
      redisToken: string;
    }
  | {
      redisUrl?: never;
      redisToken?: never;
    }
) & {
  /**
   * Enable debug logging
   */
  debug?: boolean;
  /**
   * Override the environment to use.
   * By default we use the VERCEL_ENV environment variable
   */
  environment?: Environment;
  /**
   * Max age of the cache in seconds
   *
   * This is the max age of the in memory cache, not the redis cache
   *
   * Edge functions are not guaranteed to be warm, so the cache can be empty at any time.
   *
   * 0, negative or undefined will disable the cache
   */
  maxAge?: number;
  /**
   * Prefix all keys in redis
   *
   * @default `edge-flags`
   */
  prefix?: string;
};

/**
 * createHandler should be default exported by the user in an edge compatible api route
 */
export function createEdgeHandler(opts: HandlerConfig): NextMiddleware {
  const cache = new Cache<Flag>(opts.maxAge);
  const redis =
    opts.redisUrl && opts.redisToken
      ? new Redis({
          url: opts.redisUrl,
          token: opts.redisToken,
        })
      : Redis.fromEnv();
  try {
    // @ts-ignore - this may not be available in older versions of @upstash/redis
    redis.addTelemetry({ sdk: `@upstash/edge-flags@${VERSION}` });
  } catch {
    // ignore
  }
  const admin = new Admin({ redis, prefix: opts.prefix });

  return async (req: NextRequest, _event: NextFetchEvent) => {
    const edgeStart = Date.now();
    const url = new URL(req.url);

    const headers = new Headers();

    const flagName = url.searchParams.get("_flag");
    if (!flagName) {
      return new NextResponse("Missing parameter: _flag", { status: 400 });
    }

    let flag = cache.get(flagName);
    if (opts.debug) console.log("cached", flag);

    if (flag) {
      headers.set("X-Edge-Flags-Cache", "hit");
    } else {
      headers.set("X-Edge-Flags-Cache", "miss");
      const redisStart = Date.now();
      const loaded = await admin.getFlag(
        flagName,
        opts.environment ?? (process.env.VERCEL_ENV as Environment) ?? "development",
      );
      if (opts.debug) console.log("found flag", loaded);
      headers.set("X-Redis-Latency", (Date.now() - redisStart).toString());
      if (loaded) {
        flag = loaded;
        cache.set(flagName, loaded);
      }
    }

    if (!flag) {
      headers.set("X-Edge-Latency", (Date.now() - edgeStart).toString());
      return NextResponse.json(
        { error: `Flag not found: ${flagName}` },
        {
          status: 404,
          headers,
        },
      );
    }

    const evalRequest: EvalRequest = req.geo ?? {};

    url.searchParams.forEach((value, key) => {
      evalRequest[decodeURIComponent(key)] = decodeURIComponent(value);
    });

    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(evalRequest)));
    const hashSum = Array.from(new Uint8Array(hash)).reduce((sum, x) => {
      sum += x;
      return sum;
    }, 0);

    const percentage = hashSum % 100;

    const value = evaluate(flag, percentage, evalRequest, opts.debug);
    if (opts.debug) console.log("eval", { evalRequest, percentage, value });

    headers.set("X-Edge-Latency", (Date.now() - edgeStart).toString());

    /**
     * No rule applied
     */
    return NextResponse.json(
      { value },
      {
        status: 200,
        headers,
      },
    );
  };
}
