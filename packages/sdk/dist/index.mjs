// src/sdk.ts
import { faker } from "@faker-js/faker";
import { NextResponse } from "next/server";
import * as nanoid from "nanoid";
var EdgeFlags = class {
  identify;
  config;
  constructor(opts) {
    this.identify = opts?.identify;
    this.config = new ConfigAPI();
  }
  handler() {
    return (_req) => {
      return NextResponse.next();
    };
  }
};
var ConfigAPI = class {
  _dummy = [];
  newId = (prefix) => [
    prefix,
    nanoid.customAlphabet(
      "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    )(16)
  ].join("_");
  async listFlags() {
    return this._dummy;
  }
  async createFlag(create) {
    const id = this.newId("flag");
    const _create = (environment) => ({
      enabled: false,
      id,
      name: create.name,
      rules: [],
      environment,
      percentage: null
    });
    const flags = {
      production: _create("production"),
      preview: _create("preview"),
      development: _create("development")
    };
    this._dummy.push(...Object.values(flags));
    return new Promise((r) => r(flags));
  }
  async updateFlag(flagId, environment, data) {
    const idx = this._dummy.findIndex(
      (f) => f.id === flagId && f.environment === environment
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
      performance: data?.percentage ?? flag.percentage
    };
    this._dummy[idx] = update;
    return update;
  }
  async copyFlag(flagId, from, to) {
    const source = this._dummy.find(
      (f) => f.id === flagId && f.environment === from
    );
    if (!source) {
      throw new Error("Source flag not found");
    }
    const idx = this._dummy.findIndex(
      (f) => f.id === flagId && f.environment === to
    );
    if (idx < 0) {
      throw new Error("Destination flag not found");
    }
    this._dummy[idx] = { ...source, environment: to };
  }
  initDummy() {
    const envs = ["production", "preview", "development"];
    this._dummy = new Array(3).fill(null).flatMap((_) => {
      const flagId = this.newId("flag");
      const name = faker.color.human();
      return envs.map((environment) => {
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
              target: new Array(Math.ceil(5 * Math.random())).fill(0).map((_2) => faker.internet.ip()),
              value: false
            },
            {
              id: this.newId("rule"),
              version: "v1",
              accessor: "identifier",
              compare: "not_in",
              target: new Array(Math.ceil(5 * Math.random())).fill(0).map((_2) => faker.random.alpha(4)),
              value: false
            },
            {
              id: this.newId("rule"),
              version: "v1",
              accessor: "city",
              compare: "contains",
              target: "_some_suffix",
              value: false
            },
            {
              id: this.newId("rule"),
              version: "v1",
              accessor: "city",
              compare: "not_contains",
              target: "_some_suffix",
              value: true
            },
            {
              id: this.newId("rule"),
              version: "v1",
              accessor: "city",
              compare: "eq",
              target: faker.address.cityName(),
              value: true
            },
            {
              id: this.newId("rule"),
              version: "v1",
              accessor: "city",
              compare: "not_eq",
              target: faker.address.cityName(),
              value: false
            },
            {
              id: this.newId("rule"),
              version: "v1",
              accessor: "identifier",
              compare: "empty",
              value: true
            },
            {
              id: this.newId("rule"),
              version: "v1",
              accessor: "identifier",
              compare: "not_empty",
              value: false
            },
            {
              id: this.newId("rule"),
              version: "v1",
              accessor: "identifier",
              compare: "gt",
              target: "100",
              value: true
            },
            {
              id: this.newId("rule"),
              version: "v1",
              accessor: "identifier",
              compare: "gte",
              target: "200",
              value: true
            },
            {
              id: this.newId("rule"),
              version: "v1",
              accessor: "identifier",
              compare: "lt",
              target: "100",
              value: true
            },
            {
              id: this.newId("rule"),
              version: "v1",
              accessor: "identifier",
              compare: "lte",
              target: "200",
              value: true
            }
          ],
          value: true,
          environment,
          percentage: Math.random() > 0.5 ? Math.ceil(100 * Math.random()) : null
        };
      });
    });
  }
};
export {
  EdgeFlags
};
//# sourceMappingURL=index.mjs.map