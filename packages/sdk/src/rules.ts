import { z } from "zod";

export type EvalRequest = {
  [custom: string]: string | undefined;
  city?: string;
  country?: string;
  region?: string;
  latitude?: string;
  longitude?: string;
  ip?: string;
};

export const comparator = z.enum([
  // a value is a member of a predefined set
  "in",
  "not_in",
  // the value contains a substring x
  "contains",
  "not_contains",
  "eq",
  "not_eq",
  "empty",
  "not_empty",
  "gt",
  "gte",
  "lt",
  "lte",
]);

export const b = z.object({
  accessor: z.string(),
  compare: comparator,
  /**
   * The flag returns this `value` if this rule evaluates to true
   */
  value: z.boolean(),
});

const rules = {
  in: b.merge(
    z.object({
      compare: z.literal("in"),
      target: z.array(z.string()),
    }),
  ),
  notIn: b.merge(
    z.object({
      compare: z.literal("not_in"),
      target: z.array(z.string()),
    }),
  ),
  contains: b.merge(
    z.object({
      compare: z.literal("contains"),
      target: z.string(),
    }),
  ),
  notContains: b.merge(
    z.object({
      compare: z.literal("not_contains"),
      target: z.string(),
    }),
  ),
  eq: b.merge(
    z.object({
      compare: z.literal("eq"),
      target: z.string(),
    }),
  ),
  notEq: b.merge(
    z.object({
      compare: z.literal("not_eq"),
      target: z.string(),
    }),
  ),
  empty: b.merge(
    z.object({
      compare: z.literal("empty"),
    }),
  ),
  notEmpty: b.merge(
    z.object({
      compare: z.literal("not_empty"),
    }),
  ),
  gt: b.merge(
    z.object({
      compare: z.literal("gt"),
      target: z.union([z.number(), z.string()]),
    }),
  ),
  gte: b.merge(
    z.object({
      compare: z.literal("gte"),
      target: z.union([z.number(), z.string()]),
    }),
  ),
  lt: b.merge(
    z.object({
      compare: z.literal("lt"),
      target: z.union([z.number(), z.string()]),
    }),
  ),
  lte: b.merge(
    z.object({
      compare: z.literal("lte"),
      target: z.union([z.number(), z.string()]),
    }),
  ),
};

export const rule = z.discriminatedUnion("compare", [
  rules.in,
  rules.notIn,
  rules.contains,
  rules.notContains,
  rules.eq,
  rules.notEq,
  rules.empty,
  rules.notEmpty,
  rules.gt,
  rules.gte,
  rules.lt,
  rules.lte,
]);

export class Rule {
  public readonly schema: z.infer<typeof rule>;

  constructor(schema: z.infer<typeof rule>) {
    this.schema = schema;
  }

  static parse(raw: string): Rule {
    return new Rule(rule.parse(JSON.parse(raw)));
  }
  toString(): string {
    return JSON.stringify(this.schema);
  }

  public match(req: EvalRequest): boolean {
    const value = req[this.schema.accessor];

    switch (this.schema.compare) {
      case "in":
        if (typeof value === "undefined") {
          return false;
        }
        return this.schema.target.includes(value);
      case "not_in":
        if (typeof value === "undefined") {
          // if the value is not defined, then by definition no target is a member
          return true;
        }
        return !this.schema.target.includes(value);
      case "contains":
        if (typeof value === "undefined") {
          return false;
        }
        return value.includes(this.schema.target);
      case "not_contains":
        if (typeof value === "undefined") {
          // if the value is not defined, then by definition it does not include the target
          return true;
        }
        return !value.includes(this.schema.target);
      case "empty":
        return !value;
      case "not_empty":
        return !!value;
      case "eq":
        return value === this.schema.target;
      case "not_eq":
        return value !== this.schema.target;
      case "gt":
        return typeof value !== "undefined" && value > this.schema.target;
      case "gte":
        return typeof value !== "undefined" && value >= this.schema.target;
      case "lt":
        return typeof value !== "undefined" && value < this.schema.target;
      case "lte":
        return typeof value !== "undefined" && value <= this.schema.target;
    }
  }
}
