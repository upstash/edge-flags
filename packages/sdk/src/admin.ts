import type { Flag, Environment, Rule } from "./types";
import { RestStorage, Storage } from "./storage";
import { Redis } from "@upstash/redis";
import { environments } from "./environment";

export type Options = {
	prefix?: string;
	redis: Redis;
};

export class Admin {
	private storage: Storage;

	constructor({ redis, prefix = "edge-flags" }: Options) {
		this.storage = new RestStorage({ redis, prefix });
	}

	/**
	 * Return all flags ordered by updatedAt. The most recently updated flag will be first
	 */
	public async listFlags(): Promise<Flag[]> {
		const flags = await this.storage.listFlags();
		return flags.sort((a, b) => b.updatedAt - a.updatedAt);
	}

	public async getFlag(
		name: string,
		environment: Environment,
	): Promise<Flag | null> {
		this.validateName(name);
		return await this.storage.getFlag(name, environment);
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
		await Promise.all(
			Object.values(flags).map((flag) => this.storage.setFlag(flag)),
		);

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
	 * Rename a flag across all environments
	 */
	public async renameFlag(
		oldName: string,
		newName: string,
	): Promise<Record<Environment, Flag>> {
		return {
			production: await this.updateFlag(oldName, "production", {
				name: newName,
			}),
			preview: await this.updateFlag(oldName, "preview", { name: newName }),
			development: await this.updateFlag(oldName, "development", {
				name: newName,
			}),
		};
	}

	public async updateFlag(
		flagName: string,
		environment: Environment,
		data: {
			name?: string;
			enabled?: boolean;
			rules?: Rule[];
			percentage?: number | null;
		},
	): Promise<Flag> {
		if (typeof data.name !== "undefined") {
			this.validateName(data.name);
		}

		const flag = await this.storage.getFlag(flagName, environment);
		if (!flag) {
			throw new Error(`Flag ${flagName} not found`);
		}
		const updated: Flag = {
			...flag,
			updatedAt: Date.now(),
			name: data.name ?? flag.name,
			enabled: data.enabled ?? flag.enabled,
			rules: data.rules ?? flag.rules,
			percentage:
				data.percentage === null ? null : data.percentage ?? flag.percentage,
		};
		await this.storage.setFlag(updated);
		return updated;
	}
	public async deleteFlag(flagGName: string): Promise<void> {
		await this.storage.deleteFlag(flagGName);
	}

	/**
	 * Copy a flag configuration from one environment to another.
	 * This overwrites the target environment
	 *
	 * @param flagName - the flag name to copy
	 * @param newName - give the copied flag a new name
	 */
	public async copyFlag(
		flagName: string,
		newName: string,
	): Promise<Record<Environment, Flag>> {
		const copy = async (env: Environment) => {
			const source = await this.storage.getFlag(flagName, env);
			if (!source) {
				throw new Error("Source flag not found");
			}
			const newFlag = { ...source, name: newName };
			await this.storage.setFlag(newFlag);
			return newFlag;
		};

		return {
			development: await copy("development"),
			preview: await copy("preview"),
			production: await copy("production"),
		};
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
		const source = await this.storage.getFlag(flagName, from);
		if (!source) {
			throw new Error("Source flag not found");
		}
		await this.storage.setFlag({
			...source,
			environment: to,
			updatedAt: Date.now(),
		});
	}
}
