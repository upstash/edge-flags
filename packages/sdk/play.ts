import { EdgeFlags } from "./src/index";

async function main() {
	const flags = new EdgeFlags();
	flags.config.initDummy();

	await flags.config.createFlag({ name: "xxx" });
	const all = await flags.config.listFlags();
	await flags.config.updateFlag(all.at(0)!.id, "preview", { name: "Updated" });

	console.log(JSON.stringify(await flags.config.listFlags(), null, 2));
}
main();
