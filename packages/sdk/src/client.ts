import { Redis } from "@upstash/redis";
import { Admin } from "./admin";
import { evaluate } from "./evaluation";
import { EvalRequest } from "./rules";
import { Environment } from "./types";

export type ClientConfig = {
  redis: Redis;
  environment?: Environment;
  debug?: boolean;
};

export class Client {
  private admin: Admin;
  private readonly environment: Environment;
  private readonly debug: boolean;

  constructor(config: ClientConfig) {
    this.admin = new Admin({ redis: config.redis });
    this.environment =
      config.environment ??
      (process.env.VERCEL_ENV as Environment) ??
      "development";
    this.debug = Boolean(config.debug);
  }

  async getFlag(flagName: string, req: EvalRequest): Promise<boolean> {
    const flag = await this.admin.getFlag(flagName, this.environment);

    if (!flag) {
      throw new Error(`Flag ${flagName} not found`);
    }

    const hash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(JSON.stringify(req))
    );
    const hashSum = Array.from(new Uint8Array(hash)).reduce((sum, x) => {
      sum += x;
      return sum;
    }, 0);

    const percentage = hashSum % 100;

    return evaluate(flag, percentage, req, this.debug);
  }
}
