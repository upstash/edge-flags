import { EdgeFlags } from "@upstash/edge-flags";
import { Redis } from "@upstash/redis";

async function main() {
	const redis = Redis.fromEnv();
	const edgeFlags = new EdgeFlags({
		redis,
	});

	await edgeFlags.config.initDummy()

	await edgeFlags.config.deleteFlag("flag_vQ4hwiMiiKpvdM2g");
	console.log(await edgeFlags.config.listFlags());
}

main();
