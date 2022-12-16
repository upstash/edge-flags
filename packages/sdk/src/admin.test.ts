import { Redis } from "@upstash/redis";
import { describe, test } from "node:test";
import { randomUUID } from "node:crypto";
import { Admin } from "./admin";
import assert from "node:assert";
import { config } from "dotenv";
import { environments } from "./environment";

config();
const admin = new Admin({ redis: Redis.fromEnv() });

describe("Create a flag", async () => {
	test("can load the flag after creating it", async () => {
		const name = randomUUID();
		const flag = await admin.createFlag({ name });
		assert.equal(flag.development.name, name);
		assert.equal(flag.preview.name, name);
		assert.equal(flag.production.name, name);

		for (const env of environments) {
			const found = await admin.getFlag(name, env);
			assert(found);
			assert.equal(found!.name, name);
		}
	});
});

describe("Update a flag", async () => {
	test("set percentage to null", async () => {
		const name = randomUUID();
		await admin.createFlag({ name });

		for (const env of environments) {
			const percentage1 = Math.random() * 100;
			const percentage2 = Math.random() * 100;
			await admin.updateFlag(name, env, {
				percentage: percentage1,
			});

			const f1 = await admin.getFlag(name, env);
			assert.equal(f1!.percentage, percentage1);

			await admin.updateFlag(name, env, {
				percentage: percentage2,
			});

			const f2 = await admin.getFlag(name, env);
			assert.equal(f2!.percentage, percentage1);

			await admin.updateFlag(name, env, {
				percentage: null,
			});

			const f3 = await admin.getFlag(name, env);
			assert.equal(f2!.percentage, null);
		}
	});
});

describe("Rename a flag", async () => {
	test("renames all environments", async () => {
		let name = randomUUID();

		await admin.createFlag({ name });

		for (let i = 0; i < 10; i++) {
			const newName = randomUUID();

			await admin.renameFlag(name, newName);
			for (const env of environments) {
				const flag = await admin.getFlag(newName, env);
				assert(flag);
				assert.equal(flag.name, newName);
			}
			name = newName;
		}
	});
});
