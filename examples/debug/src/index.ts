import { Admin } from "@upstash/edge-flags";
import { Redis } from "@upstash/redis";

async function main() {
	const redis = Redis.fromEnv();
	const edgeFlags = new Admin({
		redis,
	});

	await edgeFlags.initDummy();
}

main();
