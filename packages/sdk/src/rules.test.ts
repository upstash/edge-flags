import { describe, it, expect } from "@jest/globals";
import { Rule } from "./rules";

describe("in", () => {
  it("should match if the value is in the array", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "in",
      target: ["a", "b", "c"],
      value: true,
    });

    expect(rule.match({ test: "a" })).toBe(true);
  });

  it("should not match if the accessor is different", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "in",
      target: ["a", "b", "c"],
      value: true,
    });

    expect(rule.match({ attr: "a" })).toBe(false);
  });

  it("should not match if the attribute is not in the targets", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "in",
      target: ["a", "b", "c"],
      value: true,
    });

    expect(rule.match({ test: "x" })).toBe(false);
  });
});
describe("notIn", () => {
  it("should not match if the value is in the array", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "not_in",
      target: ["a", "b", "c"],
      value: true,
    });

    expect(rule.match({ test: "a" })).toBe(false);
  });

  it("should match if the accessor is different", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "not_in",
      target: ["a", "b", "c"],
      value: true,
    });

    expect(rule.match({ attr: "a" })).toBe(true);
  });

  it("should match if the attribute is not in the targets", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "not_in",
      target: ["a", "b", "c"],
      value: true,
    });

    expect(rule.match({ test: "x" })).toBe(true);
  });
});
describe("contains", () => {
  it("should match if the target is empty, cause js is weird", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "contains",
      target: "",
      value: true,
    });

    expect(rule.match({ test: "abc" })).toBe(true);
  });
  it("should not match if the value is undefined", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "contains",
      target: "abc",
      value: true,
    });

    expect(rule.match({})).toBe(false);
  });
  it("should match if the value is a subset of target", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "contains",
      target: "a",
      value: true,
    });

    expect(rule.match({ test: "abc" })).toBe(true);
  });
  it("should not match if the value is not a subset of target", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "contains",
      target: "x",
      value: true,
    });

    expect(rule.match({ test: "abc" })).toBe(false);
  });
});
describe("notContains", () => {
  it("should not match if the target is empty", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "not_contains",
      target: "",
      value: true,
    });

    expect(rule.match({ test: "abc" })).toBe(false);
  });
  it("should match if the value is undefined", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "not_contains",
      target: "abc",
      value: true,
    });

    expect(rule.match({})).toBe(true);
  });
  it("should not match if the value is a subset of target", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "not_contains",
      target: "a",
      value: true,
    });

    expect(rule.match({ test: "abc" })).toBe(false);
  });
  it("should match if the value is not a subset of target", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "not_contains",
      target: "x",
      value: true,
    });

    expect(rule.match({ test: "abc" })).toBe(true);
  });
});
describe("eq", () => {
  it("should match if the value is equal to target", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "eq",
      target: "x",
      value: true,
    });
    expect(rule.match({ test: "x" })).toBe(true);
  });
  it("should not match if the value is equal to target", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "eq",
      target: "x",
      value: true,
    });
    expect(rule.match({ test: "y" })).toBe(false);
  });
});
describe("notEq", () => {
  it("should not match if the value is equal to target", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "not_eq",
      target: "x",
      value: true,
    });
    expect(rule.match({ test: "x" })).toBe(false);
  });
  it("should match if the value is equal to target", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "not_eq",
      target: "x",
      value: true,
    });
    expect(rule.match({ test: "y" })).toBe(true);
  });
});
describe("empty", () => {
  it("should match if the value is undefined", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "empty",
      value: true,
    });
    expect(rule.match({ test: undefined })).toBe(true);
  });
  it("should match if the value is an empty string", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "empty",
      value: true,
    });
    expect(rule.match({ test: "" })).toBe(true);
  });
  it("should not match if the value is a non-empty string", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "empty",
      value: true,
    });
    expect(rule.match({ test: "1" })).toBe(false);
  });
});
describe("notEmpty", () => {
  it("should not match if the value is undefined", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "not_empty",
      value: true,
    });
    expect(rule.match({ test: undefined })).toBe(false);
  });
  it("should not match if the value is an empty string", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "not_empty",
      value: true,
    });
    expect(rule.match({ test: "" })).toBe(false);
  });
  it("should match if the value is a non-empty string", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "not_empty",
      value: true,
    });
    expect(rule.match({ test: "1" })).toBe(true);
  });
});
describe("gt", () => {
  it("should not match if the value is empty", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "gt",
      target: "1",
      value: true,
    });
    expect(rule.match({})).toBe(false);
  });
  it("should not match if the value is equal to target", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "gt",
      target: "1",
      value: true,
    });
    expect(rule.match({ test: "1" })).toBe(false);
  });
  it("should match if the value is strictly greater than target", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "gt",
      target: "1",
      value: true,
    });
    expect(rule.match({ test: "2" })).toBe(true);
  });
});
describe("gte", () => {
  it("should not match if the value is empty", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "gte",
      target: "1",
      value: true,
    });
    expect(rule.match({})).toBe(false);
  });
  it("should match if the value is equal to target", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "gte",
      target: "1",
      value: true,
    });
    expect(rule.match({ test: "1" })).toBe(true);
  });
  it("should match if the value is strictly greater than target", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "gte",
      target: "1",
      value: true,
    });
    expect(rule.match({ test: "2" })).toBe(true);
  });
});
describe("lt", () => {
  it("should not match if the value is empty", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "lt",
      target: "1",
      value: true,
    });
    expect(rule.match({})).toBe(false);
  });
  it("should not match if the value is equal to target", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "lt",
      target: "1",
      value: true,
    });
    expect(rule.match({ test: "1" })).toBe(false);
  });
  it("should match if the value is strictly less than target", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "lt",
      target: "1",
      value: true,
    });
    expect(rule.match({ test: "0" })).toBe(true);
  });
});
describe("lte", () => {
  it("should not match if the value is empty", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "lte",
      target: "1",
      value: true,
    });
    expect(rule.match({})).toBe(false);
  });
  it("should match if the value is equal to target", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "lte",
      target: "1",
      value: true,
    });
    expect(rule.match({ test: "1" })).toBe(true);
  });
  it("should match if the value is strictly less than target", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "lte",
      target: "1",
      value: true,
    });
    expect(rule.match({ test: "0" })).toBe(true);
  });
});

describe("serialize", () => {
  it("is the same after serialization", () => {
    const rule = new Rule({
      accessor: "test",
      compare: "lte",
      target: "1",
      value: true,
    });

    const s = rule.toString();

    const recovered = Rule.parse(s);

    expect(recovered).toEqual(rule);
  });
});
