import type { Flag, Environment, Rule } from "./types";
import { Redis } from "@upstash/redis";
import { environments } from "./environment";

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

export type Options = {
	prefix?: string;
	tenant?: string;
	redis: Redis;
};

export class Admin {
	private readonly prefix: string;
	private readonly tenant: string;
	private readonly redis: Redis;

	constructor({ redis, prefix = "edge-flags", tenant = "default" }: Options) {
		this.prefix = prefix;
		this.redis = redis;
		this.tenant = tenant;
	}

	/**
	 * Return all flags ordered by updatedAt. The most recently updated flag will be first
	 */
	public async listFlags(): Promise<Flag[]> {
		const flagNames = await this.redis.smembers(
			listKey({ prefix: this.prefix, tenant: this.tenant }),
		);
		const keys = flagNames.flatMap((id) =>
			environments.map((env) =>
				flagKey({
					prefix: this.prefix,
					tenant: this.tenant,
					flagName: id,
					environment: env as Environment,
				}),
			),
		);
		if (keys.length === 0) {
			return [];
		}
		const flags = await this.redis.mget<Flag[]>(...keys);
		return flags.sort((a, b) => b.updatedAt - a.updatedAt);
	}

	public async getFlag(
		flagName: string,
		environment: Environment,
	): Promise<Flag | null> {
		this.validateName(flagName);
		return await this.redis.get(
			flagKey({
				prefix: this.prefix,
				tenant: this.tenant,
				flagName,
				environment,
			}),
		);
	}

	/**
	 * Create a new flag for each environment
	 * The created flags will be disabled and have no rules.
	 */
	public async createFlag(create: { name: string }): Promise<
		Record<Environment, Flag>
	> {
		this.validateName(create.name);
		const now = Date.now();
		const _create = (environment: Environment): Flag => ({
			enabled: false,
			name: create.name,
			rules: [],
			environment,
			percentage: null,
			createdAt: now,
			updatedAt: now,
		});

		const flags = {
			production: _create("production"),
			preview: _create("preview"),
			development: _create("development"),
		};

		const tx = this.redis.multi();
		for (const flag of Object.values(flags)) {
			const exists = await this.redis.exists(
				flagKey({
					prefix: this.prefix,
					tenant: this.tenant,
					flagName: flag.name,
					environment: flag.environment,
				}),
			);
			if (exists) {
				throw new Error(`A flag with this name already exists: ${flag.name}`);
			}
			tx.set(
				flagKey({
					prefix: this.prefix,
					tenant: this.tenant,
					flagName: flag.name,
					environment: flag.environment,
				}),
				flag,
				{
					nx: true,
				},
			);
			tx.sadd(listKey({ prefix: this.prefix, tenant: this.tenant }), flag.name);
		}
		const [created, _] = await tx.exec<["OK" | null, unknown]>();
		if (!created) {
			throw new Error(`A flag with this name already exists: ${create.name}`);
		}

		return flags;
	}

	/**
	 * validateName throws a descriptive error if the given name is not valid
	 */
	private validateName(name: string): void {
		if (name.length < 3) {
			throw new Error("Name must be at least 3 characters");
		}
		if (name.length > 64) {
			throw new Error("Name must be at most 64 characters");
		}
		const regex = /^[a-zA-Z0-9-_\.]+$/;
		if (!regex.test(name)) {
			throw new Error(
				`Name must only include letters, numbers as well as ".", "_" and "-"`,
			);
		}
	}
	/**
	 * Rename a flag across all environments atomically
	 */
	public async renameFlag(oldName: string, newName: string): Promise<void> {
		const tx = this.redis.multi();
		for (const environment of environments) {
			const oldKey = flagKey({
				prefix: this.prefix,
				tenant: this.tenant,
				flagName: oldName,
				environment,
			});
			const newKey = flagKey({
				prefix: this.prefix,
				tenant: this.tenant,
				flagName: newName,
				environment,
			});

			const flag = await this.getFlag(oldName, environment);
			tx.set(newKey, flag, {
				nx: true,
			});
			tx.sadd(listKey({ prefix: this.prefix, tenant: this.tenant }), newName);

			// remove old
			tx.del(oldKey);
			tx.srem(listKey({ prefix: this.prefix, tenant: this.tenant }), oldName);
		}

		const [created, _] = await tx.exec<["OK" | null, unknown]>();
		if (!created) {
			throw new Error(`A flag with this name already exists: ${newName}`);
		}
	}

	public async updateFlag(
		flagName: string,
		environment: Environment,
		data: {
			enabled?: boolean;
			rules?: Rule[];
			percentage?: number | null;
		},
	): Promise<Flag> {
		this.validateName(flagName);

		const key = flagKey({
			prefix: this.prefix,
			tenant: this.tenant,
			flagName,
			environment,
		});

		const flag = await this.redis.get<Flag>(key);
		if (!flag) {
			throw new Error(`Flag ${flagName} not found`);
		}
		const updated: Flag = {
			...flag,
			updatedAt: Date.now(),
			enabled: data.enabled ?? flag.enabled,
			rules: data.rules ?? flag.rules,
			percentage:
				data.percentage === null ? null : data.percentage ?? flag.percentage,
		};
		await this.redis.set(key, updated, { xx: true });
		return updated;
	}

	public async deleteFlag(flagName: string): Promise<void> {
		this.validateName(flagName);

		const tx = this.redis.multi();
		for (const environment of environments) {
			tx.del(
				flagKey({
					prefix: this.prefix,
					tenant: this.tenant,
					flagName,
					environment,
				}),
			);
		}
		tx.srem(listKey({ prefix: this.prefix, tenant: this.tenant }), flagName);
		await tx.exec();
	}

	/**
	 * Copy a flag configuration from one environment to another.
	 * This overwrites the target environment
	 *
	 * @param flagName - the flag name to copy
	 * @param newName - give the copied flag a new name
	 */
	public async copyFlag(flagName: string, newName: string): Promise<void> {
		const tx = this.redis.multi();
		for (const environment of environments) {
			const exists = await this.redis.exists(
				flagKey({
					prefix: this.prefix,
					tenant: this.tenant,
					flagName: newName,
					environment,
				}),
			);
			if (exists) {
				throw new Error(`A flag with this name already exists: ${newName}`);
			}

			const source = await this.getFlag(flagName, environment);
			if (!source) {
				throw new Error("Source flag not found");
			}
			const newFlag = { ...source, name: newName };

			tx.set(
				flagKey({
					prefix: this.prefix,
					tenant: this.tenant,
					flagName: newName,
					environment,
				}),
				newFlag,
				{
					nx: true,
				},
			);
			tx.sadd(listKey({ prefix: this.prefix, tenant: this.tenant }), newName);
		}
		const [created, _] = await tx.exec<["OK" | null, unknown]>();

		if (!created) {
			throw new Error(`A flag with this name already exists: ${newName}`);
		}
	}

	/**
	 * Copy a flag configuration from one environment to another.
	 * This overwrites the target environment
	 *
	 * @param flagName - the flag id
	 * @param from - The environment from where the flag will be copied
	 * @param to - The environment to where the flag will be copied
	 */
	public async copyEnvironment(
		flagName: string,
		from: Environment,
		to: Environment,
	): Promise<void> {
		const source = await this.getFlag(flagName, from);
		if (!source) {
			throw new Error("Source flag not found");
		}

		const copied = await this.redis.set(
			flagKey({
				prefix: this.prefix,
				tenant: this.tenant,
				flagName,
				environment: to,
			}),
			{
				...source,
				environment: to,
				updatedAt: Date.now(),
			},
			{
				xx: true,
			},
		);
		if (!copied) {
			throw new Error(`Error: flag was not copied: ${flagName}-${from}`);
		}
	}
}
