import { Redis, RedisConfigNodejs } from "@upstash/redis";
import { environments } from "./environment";
import { Environment, Flag, Rule } from "./types";

export interface Storage {
	setFlag: (flag: Flag) => Promise<void>;
	getFlag: (flagName: string, environment: Environment) => Promise<Flag | null>;
	listFlags: () => Promise<Flag[]>;
	deleteFlag: (flagName: string) => Promise<void>;
}

function flagKey({
	prefix,
	tenant = "default",
	flagName,
	environment,
}: {
	prefix: string;
	tenant?: string;
	flagName: string;
	environment: Environment;
}) {
	return [prefix, tenant, "flags", flagName, environment].join(":");
}

function listKey({
	prefix,
	tenant = "default",
}: { prefix: string; tenant?: string }) {
	return [prefix, tenant, "flags"].join(":");
}

export class RestStorage implements Storage {
	private readonly redis: Redis;
	private readonly prefix: string;
	constructor({ redis, prefix }: { redis: Redis; prefix: string }) {
		this.redis = redis;
		this.prefix = prefix;
	}

	public async setFlag(flag: Flag): Promise<void> {
		const tx = this.redis.multi();
		tx.set(
			flagKey({
				prefix: this.prefix,
				tenant: "default",
				flagName: flag.name,
				environment: flag.environment,
			}),
			flag,
			{
				nx: true,
			},
		);
		tx.sadd(listKey({ prefix: this.prefix, tenant: "default" }), flag.name);
		const [created, _] = await tx.exec<["OK" | null, unknown]>();
		if (!created) {
			throw new Error(`A flag with this name already exists: ${flag.name}`);
		}
	}
	public async getFlag(
		flagName: string,
		environment: Environment,
	): Promise<Flag | null> {
		return await this.redis.get(
			flagKey({
				prefix: this.prefix,
				tenant: "default",
				flagName,
				environment,
			}),
		);
	}

	public async listFlags(): Promise<Flag[]> {
		const flagNames = await this.redis.smembers(
			listKey({ prefix: this.prefix, tenant: "default" }),
		);
		const keys = flagNames.flatMap((id) =>
			environments.map((env) =>
				flagKey({
					prefix: this.prefix,
					tenant: "default",
					flagName: id,
					environment: env as Environment,
				}),
			),
		);
		if (keys.length === 0) {
			return [];
		}
		return this.redis.mget(...keys);
	}

	public async deleteFlag(flagName: string): Promise<void> {
		const tx = this.redis.multi();
		for (const environment of environments) {
			tx.del(
				flagKey({
					prefix: this.prefix,
					tenant: "default",
					flagName,
					environment,
				}),
			);
		}
		tx.srem(listKey({ prefix: this.prefix, tenant: "default" }), flagName);
		await tx.exec();
	}
}
