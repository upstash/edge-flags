import { faker } from "@faker-js/faker";
import type { Flag, Environment, Rule } from "./types";
import type { Redis } from "@upstash/redis";
import { NextMiddleware, NextRequest, NextResponse } from "next/server";
import * as nanoid from "nanoid";
import { RestStorage, Storage } from "./storage";

type Identify = (req: NextRequest) => string | Promise<string>;

export type Config = {
	redis: Redis;
	identify?: Identify;
};

export class EdgeFlags {
	private readonly identify?: Identify;
	public config: ConfigAPI;

	constructor(opts: Config) {
		this.identify = opts?.identify;
		this.config = new ConfigAPI({ storage: new RestStorage(opts.redis) });
	}

	/**
	 * handler should be default exported by the user in an edge compatible api route
	 */
	public handler(): NextMiddleware {
		return (_req: NextRequest) => {
			return NextResponse.next();
		};
	}
}

class ConfigAPI {
	private storage: Storage;
	private readonly newId = (prefix: string) =>
		[
			prefix,
			nanoid.customAlphabet(
				"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
			)(16),
		].join("_");

	constructor(opts: { storage: Storage }) {
		this.storage = opts.storage;
	}
	public async listFlags(): Promise<Flag[]> {
		return this.storage.listFlags();
	}

	/**
	 * Create a new flag for each environment
	 * The created flags will be disabled and have no rules.
	 */
	public async createFlag(create: { name: string }): Promise<
		Record<Flag["environment"], Flag>
	> {
		const id = this.newId("flag");
		const _create = (environment: Environment): Flag => ({
			enabled: false,
			id,
			name: create.name,
			rules: [],
			environment,
			percentage: null,
			value: false,
		});

		const flags = {
			production: _create("production"),
			preview: _create("preview"),
			development: _create("development"),
		};
		for (const flag of Object.values(flags)) {
			await this.storage.createFlag(flag);
		}

		return flags;
	}

	public async updateFlag(
		flagId: string,
		environment: Environment,
		data: {
			name?: string;
			enabled?: boolean;
			rules?: Rule[];
			percentage?: number | null;
		},
	): Promise<Flag> {
		return await this.storage.updateFlag(flagId, environment, data);
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
		await this.storage.createFlag({ ...source, environment: to });
	}

	/**
	 * DEV ONLY
	 *
	 * Seed some flags - THIS OVERRIDES THE EXISTING FLAGS
	 *
	 *
	 */
	public async initDummy(): Promise<void> {
		const envs: Environment[] = ["production", "preview", "development"];
		for (let i = 0; i < 3; i++) {
			const flagId = this.newId("flag");

			const name = faker.color.human();
			for (const environment of envs) {
				this.storage.createFlag({
					id: flagId,
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
					value: true,
					environment,
					percentage:
						Math.random() > 0.5 ? Math.ceil(100 * Math.random()) : null,
				});
			}
		}
	}
}
