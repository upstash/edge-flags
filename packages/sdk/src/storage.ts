import { Redis } from "@upstash/redis";
import { Environment, Flag, Rule } from "./types";

export interface Storage {
	createFlag: (flag: Flag) => Promise<void>;
	getFlag: (flagId: string, environment: Environment) => Promise<Flag | null>;
	listFlags: () => Promise<Flag[]>;
	updateFlag: (
		flagId: string,
		environment: Environment,
		data: {
			name?: string;
			enabled?: boolean;
			rules?: Rule[];
			percentage?: number | null;
			updatedAt: number;
		},
	) => Promise<Flag>;
	deleteFlag: (flagId: string) => Promise<void>;
}

function flagKey({
	tenant = "default",
	flagId,
	environment,
}: { tenant?: string; flagId: string; environment: Environment }) {
	return `edge-flags:${tenant}:flags:${flagId}:${environment}`;
}

function listKey({ tenant = "default" }: { tenant?: string }) {
	return `edge-flags:${tenant}:flags`;
}

export class RestStorage implements Storage {
	private readonly redis: Redis;
	constructor(redis: Redis) {
		this.redis = redis;
	}

	public async createFlag(flag: Flag): Promise<void> {
		const tx = this.redis.multi();
		tx.set(
			flagKey({
				tenant: "default",
				flagId: flag.id,
				environment: flag.environment,
			}),
			flag,
		);
		tx.sadd(listKey({ tenant: "default" }), flag.id);
		await tx.exec();
	}
	public async getFlag(
		flagId: string,
		environment: Environment,
	): Promise<Flag | null> {
		return await this.redis.get(
			flagKey({ tenant: "default", flagId, environment }),
		);
	}

	public async listFlags(): Promise<Flag[]> {
		const flagIds = await this.redis.smembers(listKey({ tenant: "default" }));
		const keys = flagIds.flatMap((id) =>
			["production", "preview", "development"].map((env) =>
				flagKey({
					tenant: "default",
					flagId: id,
					environment: env as Environment,
				}),
			),
		);
		if (keys.length === 0) {
			return [];
		}
		return this.redis.mget(...keys);
	}

	public async updateFlag(
		flagId: string,
		environment: Environment,
		data: {
			name?: string;
			enabled?: boolean;
			rules?: Rule[];
			percentage?: number | null;
			updatedAt: number;
		},
	): Promise<Flag> {
		const key = flagKey({ tenant: "default", flagId, environment });
		const flag = await this.redis.get<Flag>(key);
		if (!flag) {
			throw new Error(`Flag ${flagId} not found`);
		}
		const updated: Flag = {
			...flag,
			updatedAt: data.updatedAt,
			name: data.name ?? flag.name,
			enabled: data.enabled ?? flag.enabled,
			rules: data.rules ?? flag.rules,
			percentage: data.percentage ?? flag.percentage,
		};
		await this.redis.set(key, updated);
		return updated;
	}

	public async deleteFlag(flagId: string): Promise<void> {
		const tx = this.redis.multi();
		for (const environment of [
			"production",
			"preview",
			"development",
		] as Environment[]) {
			tx.del(flagKey({ tenant: "default", flagId, environment }));
		}
		tx.srem(listKey({ tenant: "default" }), flagId);
		await tx.exec();
	}
}
