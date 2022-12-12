import { faker } from "@faker-js/faker";
import type { Flag, Environment, Rule } from "./types";
import { RestStorage, Storage } from "./storage";
import { Redis } from "@upstash/redis";

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
		Record<Flag["environment"], Flag>
	> {
		this.validateName(create.name);
		const now = Date.now();
		const _create = (environment: Environment): Flag => ({
			enabled: false,
			name: create.name,
			rules: [],
			environment,
			percentage: null,
			value: false,
			createdAt: now,
			updatedAt: now,
		});

		const flags = {
			production: _create("production"),
			preview: _create("preview"),
			development: _create("development"),
		};
		await Promise.all(
			Object.values(flags).map((flag) => this.storage.createFlag(flag)),
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

		return await this.storage.updateFlag(flagName, environment, {
			...data,
			updatedAt: Date.now(),
		});
	}
	public async deleteFlag(flagId: string): Promise<void> {
		await this.storage.deleteFlag(flagId);
	}

	/**
	 * Copy a flag configuration from one environment to another.
	 * This overwrites the target environment
	 *
	 * @param flagId - the flag id
	 * @param from - The environment from where the flag will be copied
	 * @param to - The environment to where the flag will be copied
	 */
	public async copyFlag(
		flagId: string,
		from: Environment,
		to: Environment,
	): Promise<void> {
		const source = await this.storage.getFlag(flagId, from);
		if (!source) {
			throw new Error("Source flag not found");
		}
		await this.storage.createFlag({
			...source,
			environment: to,
			updatedAt: Date.now(),
		});
	}

	/**
	 * DEV ONLY
	 *
	 * Seed some flags
	 *
	 *
	 */
	public async initDummy(): Promise<void> {
		const envs: Environment[] = ["production", "preview", "development"];
		for (let i = 0; i < 3; i++) {
			const name = faker.color.human();
			for (const environment of envs) {
				this.storage.createFlag({
					createdAt: Date.now(),
					updatedAt: Date.now(),
					name,
					enabled: Math.random() > 0.3,
					rules: [
						{
							version: "v1",
							accessor: "ip",
							compare: "in",
							target: new Array(Math.ceil(5 * Math.random()))
								.fill(0)
								.map((_) => faker.internet.ip()),
							value: false,
						},
						{
							version: "v1",
							accessor: "identifier",
							compare: "not_in",
							target: new Array(Math.ceil(5 * Math.random()))
								.fill(0)
								.map((_) => faker.random.alpha(4)),
							value: false,
						},
						{
							version: "v1",
							accessor: "city",
							compare: "contains",
							target: "_some_suffix",
							value: false,
						},
						{
							version: "v1",
							accessor: "city",
							compare: "not_contains",
							target: "_some_suffix",
							value: true,
						},
						{
							version: "v1",
							accessor: "city",
							compare: "eq",
							target: faker.address.cityName(),
							value: true,
						},
						{
							version: "v1",
							accessor: "city",
							compare: "not_eq",
							target: faker.address.cityName(),
							value: false,
						},
						{
							version: "v1",
							accessor: "identifier",
							compare: "empty",
							value: true,
						},
						{
							version: "v1",
							accessor: "identifier",
							compare: "not_empty",
							value: false,
						},
						{
							version: "v1",
							accessor: "identifier",
							compare: "gt",
							target: "100",
							value: true,
						},
						{
							version: "v1",
							accessor: "identifier",
							compare: "gte",
							target: "200",
							value: true,
						},
						{
							version: "v1",
							accessor: "identifier",
							compare: "lt",
							target: "100",
							value: true,
						},
						{
							version: "v1",
							accessor: "identifier",
							compare: "lte",
							target: "200",
							value: true,
						},
					],
					value: Math.random() > 0.5,
					environment,
					percentage:
						Math.random() > 0.5 ? Math.ceil(100 * Math.random()) : null,
				});
			}
		}
	}
}
