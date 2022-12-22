import { Redis } from "@upstash/redis";
import {
	NextFetchEvent,
	NextMiddleware,
	NextRequest,
	NextResponse,
} from "next/server";

import { Admin } from "./admin";
import { Rule } from "./rules";
import { Environment } from "./types";

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
	 * How long to cache the result
	 * in seconds
	 *
	 * Set to 0 to disable caching
	 */
	cacheMaxAge: number;

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
	const headers = new Headers();
	if (opts.cacheMaxAge && opts.cacheMaxAge > 0) {
		headers.set("Cache-Control", `s-maxage=${opts.cacheMaxAge}, public`);
	}

	return async (req: NextRequest, _event: NextFetchEvent) => {
		const url = new URL(req.url);

		const flagName = url.searchParams.get("flag");
		if (!flagName) {
			return new NextResponse("Missing parameter: flag", { status: 400 });
		}
		console.log("Evaluating flag", flagName);

		const redis =
			opts.redisUrl && opts.redisToken
				? new Redis({
						url: opts.redisUrl,
						token: opts.redisToken,
				  })
				: Redis.fromEnv();

		const admin = new Admin({ redis, prefix: opts.prefix });
		console.log("Making request to redis");

		const environment =
			(process.env.VERCEL_ENV as Environment | undefined) ?? "development";
		console.log({ environment });
		const flag = await admin.getFlag(flagName, environment);
		if (!flag) {
			return new NextResponse("Flag not found", { status: 404 });
		}
		console.log("Found flag", JSON.stringify(flag));

		if (flag.percentage) {
			const userPercentage = parseFloat(url.searchParams.get("pid")!);
			console.log({ userPercentage, flagPercentage: flag.percentage });
			if (userPercentage < flag.percentage) {
				return NextResponse.json(
					{ value: false },
					{
						status: 200,
						headers,
					},
				);
			}
		}

		const evalRequest = {
			city: url.searchParams.get("city") ?? undefined,
			country: url.searchParams.get("country") ?? undefined,
			region: url.searchParams.get("region") ?? undefined,
			latitude: url.searchParams.get("latitude") ?? undefined,
			longitude: url.searchParams.get("longitude") ?? undefined,
			ip: url.searchParams.get("ip") ?? undefined,
			userId: url.searchParams.get("userId") ?? undefined,
		};

		console.log(JSON.stringify({ evalRequest }, null, 2));

		for (const rule of flag.rules) {
			const hit = new Rule(rule).evaluate(evalRequest);
			console.log("evaluating rule", rule, { hit });
			if (hit) {
				const res = { value: rule.value };
				console.log("Returning", res);

				return NextResponse.json(res, {
					status: 200,
					headers,
				});
			}
		}

		/**
		 * No rule applied
		 */
		return NextResponse.json(
			{ value: null },
			{
				status: 200,
				headers,
			},
		);
	};
}
