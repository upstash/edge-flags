import { z } from "zod";

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

const keys = z.enum(["city", "country", "region", "ip", "identifier"]);

export const b = z.object({
  version: z.string(),
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
      accessor: keys,
      compare: z.literal("in"),
      target: z.array(z.string()),
    }),
  ),
  notIn: b.merge(
    z.object({
      accessor: keys,
      compare: z.literal("not_in"),
      target: z.array(z.string()),
    }),
  ),
  contains: b.merge(
    z.object({
      accessor: keys,
      compare: z.literal("contains"),
      target: z.string(),
    }),
  ),
  notContains: b.merge(
    z.object({
      accessor: keys,
      compare: z.literal("not_contains"),
      target: z.string(),
    }),
  ),
  eq: b.merge(
    z.object({
      accessor: keys,
      compare: z.literal("eq"),
      target: z.string(),
    }),
  ),
  notEq: b.merge(
    z.object({
      accessor: keys,
      compare: z.literal("not_eq"),
      target: z.string(),
    }),
  ),
  empty: b.merge(
    z.object({
      accessor: keys,
      compare: z.literal("empty"),
    }),
  ),
  notEmpty: b.merge(
    z.object({
      accessor: keys,
      compare: z.literal("not_empty"),
    }),
  ),
  gt: b.merge(
    z.object({
      accessor: keys,
      compare: z.literal("gt"),
      target: z.union([z.number(), z.string()]),
    }),
  ),
  gte: b.merge(
    z.object({
      accessor: keys,
      compare: z.literal("gte"),
      target: z.union([z.number(), z.string()]),
    }),
  ),
  lt: b.merge(
    z.object({
      accessor: keys,
      compare: z.literal("lt"),
      target: z.union([z.number(), z.string()]),
    }),
  ),
  lte: b.merge(
    z.object({
      accessor: keys,
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

  static parse(raw: unknown): Rule {
    return new Rule(rule.parse(raw));
  }
  toString(): string {
    return JSON.stringify(this.schema);
  }

  public evaluate(req: {
    city?: string;
    country?: string;
    region?: string;
    latitude?: string;
    longitude?: string;
    ip?: string;
    identifier?: string;
  }): boolean {
    const value = req[this.schema.accessor];
    if (typeof value === "undefined") {
      return false;
    }
    switch (this.schema.compare) {
      case "in":
        return this.schema.target.includes(value);
      case "not_in":
        return !this.schema.target.includes(value);
      case "contains":
        return value.includes(this.schema.target);
      case "not_contains":
        return !value.includes(this.schema.target);
      case "empty":
        return value === "";
      case "not_empty":
        return value !== "";
      case "eq":
        return value === this.schema.target;
      case "not_eq":
        return value !== this.schema.target;
      case "gt":
        return value > this.schema.target;
      case "gte":
        return value >= this.schema.target;
      case "lt":
        return value < this.schema.target;
      case "lte":
        return value <= this.schema.target;
    }
  }
}
