import { faker } from "@faker-js/faker";
import type { Flag, Environment, Rule } from "./types";

import { NextMiddleware, NextRequest, NextResponse } from "next/server";
import * as nanoid from "nanoid";

type Identify = (req: NextRequest) => string | Promise<string>;

export type Config = {
	identify?: Identify;
};

export class EdgeFlags {
	private readonly identify?: Identify;
	public config: ConfigAPI;

	constructor(opts?: Config) {
		this.identify = opts?.identify;
		this.config = new ConfigAPI();
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
	private _dummy: Flag[] = [];
	private readonly newId = (prefix: string) =>
		[
			prefix,
			nanoid.customAlphabet(
				"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
			)(16),
		].join("_");

	public async listFlags(): Promise<Flag[]> {
		return this._dummy;
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
		});

		const flags = {
			production: _create("production"),
			preview: _create("preview"),
			development: _create("development"),
		};
		this._dummy.push(...Object.values(flags));

		return new Promise((r) => r(flags));
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
		const idx = this._dummy.findIndex(
			(f) => f.id === flagId && f.environment === environment,
		);
		if (idx < 0) {
			throw new Error("Flag not found");
		}
		const flag = this._dummy[idx];

		const update = {
			...flag,
			name: data?.name ?? flag.name,
			enabled: data?.enabled ?? flag.enabled,
			rules: data?.rules ?? flag.rules,
			performance: data?.percentage ?? flag.percentage,
		};
		this._dummy[idx] = update;
		return update;
	}

	public async copyFlag(flagId: string, from: Environment, to: Environment) {
		const source = this._dummy.find(
			(f) => f.id === flagId && f.environment === from,
		);
		if (!source) {
			throw new Error("Source flag not found");
		}

		const idx = this._dummy.findIndex(
			(f) => f.id === flagId && f.environment === to,
		);
		if (idx < 0) {
			throw new Error("Destination flag not found");
		}
		this._dummy[idx] = { ...source, environment: to };
	}

	/**
	 * DEV ONLY
	 *
	 * Seed some flags - THIS OVERRIDES THE EXISTING FLAGS
	 *
	 *
	 */
	public initDummy(): void {
		const envs: Environment[] = ["production", "preview", "development"];
		this._dummy = new Array(3).fill(null).flatMap((_) => {
			const flagId = this.newId("flag");

			const name = faker.color.human();
			return envs.map((environment: Environment) => {
				return {
					id: flagId,
					name,
					enabled: Math.random() > 0.3,
					rules: [
						{
							id: this.newId("rule"),
							version: "v1",
							accessor: "ip",
							compare: "in",
							target: new Array(Math.ceil(5 * Math.random()))
								.fill(0)
								.map((_) => faker.internet.ip()),
							value: false,
						},
						{
							id: this.newId("rule"),
							version: "v1",
							accessor: "identifier",
							compare: "not_in",
							target: new Array(Math.ceil(5 * Math.random()))
								.fill(0)
								.map((_) => faker.random.alpha(4)),
							value: false,
						},
						{
							id: this.newId("rule"),
							version: "v1",
							accessor: "city",
							compare: "contains",
							target: "_some_suffix",
							value: false,
						},
						{
							id: this.newId("rule"),
							version: "v1",
							accessor: "city",
							compare: "not_contains",
							target: "_some_suffix",
							value: true,
						},
						{
							id: this.newId("rule"),
							version: "v1",
							accessor: "city",
							compare: "eq",
							target: faker.address.cityName(),
							value: true,
						},
						{
							id: this.newId("rule"),
							version: "v1",
							accessor: "city",
							compare: "not_eq",
							target: faker.address.cityName(),
							value: false,
						},
						{
							id: this.newId("rule"),
							version: "v1",
							accessor: "identifier",
							compare: "empty",
							value: true,
						},
						{
							id: this.newId("rule"),
							version: "v1",
							accessor: "identifier",
							compare: "not_empty",
							value: false,
						},
						{
							id: this.newId("rule"),
							version: "v1",
							accessor: "identifier",
							compare: "gt",
							target: "100",
							value: true,
						},
						{
							id: this.newId("rule"),
							version: "v1",
							accessor: "identifier",
							compare: "gte",
							target: "200",
							value: true,
						},
						{
							id: this.newId("rule"),
							version: "v1",
							accessor: "identifier",
							compare: "lt",
							target: "100",
							value: true,
						},
						{
							id: this.newId("rule"),
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
				};
			});
		});
	}
}
