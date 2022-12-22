import { Redis } from "@upstash/redis";
import { test } from "node:test";
import { randomUUID } from "node:crypto";
import { Admin } from "./admin";
import assert from "node:assert";
import { config } from "dotenv";
import { environments } from "./environment";

config();
const admin = new Admin({ redis: Redis.fromEnv() });

test("Create a flag", async (t) => {
  await t.test("can load the flag after creating it", async () => {
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

test("Update a flag", async (t) => {
  await t.test("set percentage to null", async () => {
    const name = randomUUID();
    await admin.createFlag({ name });

    for (const env of environments) {
      const percentage1 = Math.ceil(Math.random() * 100);
      const percentage2 = Math.ceil(Math.random() * 100);
      await admin.updateFlag(name, env, {
        percentage: percentage1,
      });

      const f1 = await admin.getFlag(name, env);
      assert.equal(f1!.percentage, percentage1);

      await admin.updateFlag(name, env, {
        percentage: percentage2,
      });

      const f2 = await admin.getFlag(name, env);
      assert.equal(f2!.percentage, percentage2);

      await admin.updateFlag(name, env, {
        percentage: null,
      });

      const f3 = await admin.getFlag(name, env);
      assert.equal(f3!.percentage, null);
    }
  });
});

test("Rename a flag", async (t) => {
  await t.test("renames all environments", async () => {
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

test("Setting percentage to 0", async (t) => {
  await t.test("sets it to null", async () => {
    const {
      production: { name, environment },
    } = await admin.createFlag({ name: randomUUID() });

    await admin.updateFlag(name, environment, {
      percentage: 10,
    });

    const f1 = await admin.getFlag(name, environment);
    assert.equal(f1!.percentage, 10, "percentage should be 10 now");

    await admin.updateFlag(name, environment, {
      percentage: 0,
    });

    const f2 = await admin.getFlag(name, environment);
    assert.equal(f2!.percentage, null, "percentage should be disabled and set to null");
  });
});

test("Copy to env", async (t) => {
  await t.test("overwrites the target env", async () => {
    const name = randomUUID();
    const { production, development } = await admin.createFlag({ name });

    assert.equal(production.enabled, false);
    assert.equal(development.enabled, false);
    await admin.updateFlag(development.name, development.environment, {
      enabled: true,
    });

    await admin.copyEnvironment(name, "development", "production");
    const overwritten = await admin.getFlag(name, "production");
    assert.equal(overwritten?.enabled, true, "prod should be enabled");
  });
});
