import { Redis } from "@upstash/redis";
import { test, expect, describe } from "@jest/globals";
import { randomUUID } from "node:crypto";
import { Admin } from "./admin";
import { config } from "dotenv";
import { environments } from "./environment";

config();
const admin = new Admin({ redis: Redis.fromEnv() });

describe("Create a flag", () => {
  test("can load the flag after creating it", async () => {
    const name = randomUUID();
    const flag = await admin.createFlag({ name });
    expect(flag.development.name === name);
    expect(flag.preview.name === name);
    expect(flag.production.name === name);

    for (const env of environments) {
      const found = await admin.getFlag(name, env);
      expect(found);
      expect(found!.name === name);
    }
  });
});

describe("Update a flag", () => {
  test("set percentage to null", async () => {
    const name = randomUUID();
    await admin.createFlag({ name });

    for (const env of environments) {
      const percentage1 = Math.ceil(Math.random() * 100);
      const percentage2 = Math.ceil(Math.random() * 100);
      await admin.updateFlag(name, env, {
        percentage: percentage1,
      });

      const f1 = await admin.getFlag(name, env);
      expect(f1!.percentage === percentage1);

      await admin.updateFlag(name, env, {
        percentage: percentage2,
      });

      const f2 = await admin.getFlag(name, env);
      expect(f2!.percentage === percentage2);

      await admin.updateFlag(name, env, {
        percentage: null,
      });

      const f3 = await admin.getFlag(name, env);
      expect(f3!.percentage == null);
    }
  });
  test("use custom attribute", async () => {
    const name = randomUUID();
    await admin.createFlag({ name });

    for (const env of environments) {
      const attributeName = randomUUID();
      const attributeValue = randomUUID();

      await admin.updateFlag(name, env, {
        rules: [
          {
            accessor: attributeName,
            compare: "eq",
            target: attributeValue,
            value: true,
          },
        ],
      });

      const flag = await admin.getFlag(name, env);
      expect(flag?.rules.length === 1);
      expect(flag?.rules.at(0)?.accessor === attributeName);
    }
  });
});

describe("Rename a flag", () => {
  test("renames all environments", async () => {
    let name = randomUUID();

    await admin.createFlag({ name });

    for (let i = 0; i < 10; i++) {
      const newName = randomUUID();

      await admin.renameFlag(name, newName);
      for (const env of environments) {
        const flag = await admin.getFlag(newName, env);
        expect(flag);
        expect(flag!.name === newName);
      }
      name = newName;
    }
  });
});

describe("Setting percentage to 0", () => {
  test("sets it to null", async () => {
    const {
      production: { name, environment },
    } = await admin.createFlag({ name: randomUUID() });

    await admin.updateFlag(name, environment, {
      percentage: 10,
    });

    const f1 = await admin.getFlag(name, environment);
    expect(f1!.percentage === 10);

    await admin.updateFlag(name, environment, {
      percentage: 0,
    });

    const f2 = await admin.getFlag(name, environment);
    expect(f2!.percentage === null);
  });
});

describe("Copy to env", () => {
  test("overwrites the target env", async () => {
    const name = randomUUID();
    const { production, development } = await admin.createFlag({ name });

    expect(!production.enabled);
    expect(!development.enabled);
    await admin.updateFlag(development.name, development.environment, {
      enabled: true,
    });

    await admin.copyEnvironment(name, "development", "production");
    const overwritten = await admin.getFlag(name, "production");
    expect(overwritten?.enabled);
  });
});
