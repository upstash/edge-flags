import { Admin } from "@upstash/edge-flags";
import { Redis } from "@upstash/redis";

async function main() {
	const redis = Redis.fromEnv();
	const edgeFlags = new Admin({
		redis,
	});

	// await edgeFlags.createFlag({name: "is-german"})
	await edgeFlags.updateFlag("is-german", "production", {
		enabled: true,
		rules: [
			{
				version: "v1",
				accessor: "country",
				compare: "in",
				target: ["Germany", "Turkey"],
				value: true,
			},
		],
	});
}

main();
