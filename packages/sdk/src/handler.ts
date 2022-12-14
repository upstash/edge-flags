import { Redis } from "@upstash/redis";
import {
	NextFetchEvent,
	NextMiddleware,
	NextRequest,
	NextResponse,
} from "next/server";

import { Admin } from "./admin";
import { Rule } from "./rules";

type Identify = (
	req: NextRequest,
) => string | undefined | Promise<string | undefined>;

export type HandlerConfig = {
	identify: Identify;
	redisUrl: string;
	redisToken: string;

	/**
	 * How long to cache the result
	 * in seconds
	 *
	 * @default: 60
	 */
	cacheMaxAge?: number;

	/**
	 * Prefix all keys in redis
	 *
	 * @default `edge-flags`
	 */
	prefix?: string;
};

const EVAL_FLAG = "eval";

/**
 * createHandler should be default exported by the user in an edge compatible api route
 */
export function createHandler(opts: HandlerConfig): NextMiddleware {
	opts.cacheMaxAge ??= 60;

	return async (req: NextRequest, _event: NextFetchEvent) => {
		const url = new URL(req.url);

		if (url.searchParams.has(EVAL_FLAG)) {
			return evaluate(req, opts);
		}

		console.log("Preparing geo data");
		console.log(JSON.stringify({ geo: req.geo }));
		url.searchParams.set(EVAL_FLAG, "true");
		const identifier = await opts.identify(req);
		if (identifier) {
			url.searchParams.set("identifier", identifier);
		}

		if (typeof req.geo?.city !== "undefined") {
			url.searchParams.set("city", req.geo.city);
		}

		if (typeof req.geo?.country !== "undefined") {
			url.searchParams.set("country", req.geo?.country);
		}

		if (typeof req.geo?.region !== "undefined") {
			url.searchParams.set("region", req.geo.region);
		}

		if (typeof req.geo?.latitude !== "undefined") {
			url.searchParams.set("latitude", req.geo.latitude);
		}

		if (typeof req.geo?.longitude !== "undefined") {
			url.searchParams.set("longitude", req.geo.longitude);
		}

		if (typeof req.ip !== "undefined") {
			url.searchParams.set("ip", req.ip);
		}

		console.log("RD", url.href);

		return NextResponse.redirect(url.href);
	};
}

async function evaluate(
	req: NextRequest,
	opts: HandlerConfig,
): Promise<NextResponse> {
	const url = new URL(req.url);

	const flagName = url.searchParams.get("flag");
	if (!flagName) {
		return new NextResponse("Missing parameter: flag", { status: 400 });
	}
	console.log("Evaluating flag", flagName);
	const redis = new Redis({
		url: opts.redisUrl,
		token: opts.redisToken,
	});

	const admin = new Admin({ redis, prefix: opts.prefix });
	console.log("Making request to redis");
	const flag = await admin.getFlag(flagName, "production");
	if (!flag) {
		return new NextResponse("Flag not found", { status: 404 });
	}
	console.log("Found flag", JSON.stringify(flag));

	const evalRequest = {
		city: url.searchParams.get("city") ?? undefined,
		country: url.searchParams.get("country") ?? undefined,
		region: url.searchParams.get("region") ?? undefined,
		latitude: url.searchParams.get("latitude") ?? undefined,
		longitude: url.searchParams.get("longitude") ?? undefined,
		ip: url.searchParams.get("ip") ?? undefined,
		identifier: url.searchParams.get("identifier") ?? undefined,
	};
	console.log(JSON.stringify({ evalRequest }, null, 2));

	for (const rule of flag.rules) {
		const hit = new Rule(rule).evaluate(evalRequest);
		console.log("evaluating rule", rule, { hit })
		if (hit) {

			const res = { value: rule.value }
			console.log("Returning", res)

			return NextResponse.json(
				res,
				{
					status: 200,
					headers: new Headers({
						"Cache-Control": `s-maxage=${opts.cacheMaxAge}, public`,
					}),
				},
			);
		}
	}

	/**
	 * No rule applied
	 */
	return NextResponse.json(
		{ value: null },
		{
			status: 200,
			headers: new Headers({
				"Cache-Control": `s-maxage=${opts.cacheMaxAge}, public`,
			}),
		},
	);
}
