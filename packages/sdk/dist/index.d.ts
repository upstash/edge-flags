import { z } from 'zod';
import { NextMiddleware, NextRequest } from 'next/server';

declare const flag: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    enabled: z.ZodBoolean;
    rules: z.ZodArray<z.ZodDiscriminatedUnion<"compare", z.Primitive, z.ZodObject<z.extendShape<{
        version: z.ZodString;
        accessor: z.ZodString;
        compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
        value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
    }, {
        accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
        compare: z.ZodLiteral<"in">;
        target: z.ZodArray<z.ZodString, "many">;
    }>, "strip", z.ZodTypeAny, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "in";
        value: string | number | boolean;
        target: string[];
    }, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "in";
        value: string | number | boolean;
        target: string[];
    }> | z.ZodObject<z.extendShape<{
        version: z.ZodString;
        accessor: z.ZodString;
        compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
        value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
    }, {
        accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
        compare: z.ZodLiteral<"not_in">;
        target: z.ZodArray<z.ZodString, "many">;
    }>, "strip", z.ZodTypeAny, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "not_in";
        value: string | number | boolean;
        target: string[];
    }, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "not_in";
        value: string | number | boolean;
        target: string[];
    }> | z.ZodObject<z.extendShape<{
        version: z.ZodString;
        accessor: z.ZodString;
        compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
        value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
    }, {
        accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
        compare: z.ZodLiteral<"contains">;
        target: z.ZodString;
    }>, "strip", z.ZodTypeAny, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "contains";
        value: string | number | boolean;
        target: string;
    }, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "contains";
        value: string | number | boolean;
        target: string;
    }> | z.ZodObject<z.extendShape<{
        version: z.ZodString;
        accessor: z.ZodString;
        compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
        value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
    }, {
        accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
        compare: z.ZodLiteral<"not_contains">;
        target: z.ZodString;
    }>, "strip", z.ZodTypeAny, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "not_contains";
        value: string | number | boolean;
        target: string;
    }, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "not_contains";
        value: string | number | boolean;
        target: string;
    }> | z.ZodObject<z.extendShape<{
        version: z.ZodString;
        accessor: z.ZodString;
        compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
        value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
    }, {
        accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
        compare: z.ZodLiteral<"eq">;
        target: z.ZodString;
    }>, "strip", z.ZodTypeAny, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "eq";
        value: string | number | boolean;
        target: string;
    }, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "eq";
        value: string | number | boolean;
        target: string;
    }> | z.ZodObject<z.extendShape<{
        version: z.ZodString;
        accessor: z.ZodString;
        compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
        value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
    }, {
        accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
        compare: z.ZodLiteral<"not_eq">;
        target: z.ZodString;
    }>, "strip", z.ZodTypeAny, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "not_eq";
        value: string | number | boolean;
        target: string;
    }, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "not_eq";
        value: string | number | boolean;
        target: string;
    }> | z.ZodObject<z.extendShape<{
        version: z.ZodString;
        accessor: z.ZodString;
        compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
        value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
    }, {
        accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
        compare: z.ZodLiteral<"empty">;
    }>, "strip", z.ZodTypeAny, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "empty";
        value: string | number | boolean;
    }, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "empty";
        value: string | number | boolean;
    }> | z.ZodObject<z.extendShape<{
        version: z.ZodString;
        accessor: z.ZodString;
        compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
        value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
    }, {
        accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
        compare: z.ZodLiteral<"not_empty">;
    }>, "strip", z.ZodTypeAny, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "not_empty";
        value: string | number | boolean;
    }, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "not_empty";
        value: string | number | boolean;
    }> | z.ZodObject<z.extendShape<{
        version: z.ZodString;
        accessor: z.ZodString;
        compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
        value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
    }, {
        accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
        compare: z.ZodLiteral<"gt">;
        target: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
    }>, "strip", z.ZodTypeAny, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "gt";
        value: string | number | boolean;
        target: string | number;
    }, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "gt";
        value: string | number | boolean;
        target: string | number;
    }> | z.ZodObject<z.extendShape<{
        version: z.ZodString;
        accessor: z.ZodString;
        compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
        value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
    }, {
        accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
        compare: z.ZodLiteral<"gte">;
        target: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
    }>, "strip", z.ZodTypeAny, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "gte";
        value: string | number | boolean;
        target: string | number;
    }, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "gte";
        value: string | number | boolean;
        target: string | number;
    }> | z.ZodObject<z.extendShape<{
        version: z.ZodString;
        accessor: z.ZodString;
        compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
        value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
    }, {
        accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
        compare: z.ZodLiteral<"lt">;
        target: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
    }>, "strip", z.ZodTypeAny, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "lt";
        value: string | number | boolean;
        target: string | number;
    }, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "lt";
        value: string | number | boolean;
        target: string | number;
    }> | z.ZodObject<z.extendShape<{
        version: z.ZodString;
        accessor: z.ZodString;
        compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
        value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
    }, {
        accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
        compare: z.ZodLiteral<"lte">;
        target: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
    }>, "strip", z.ZodTypeAny, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "lte";
        value: string | number | boolean;
        target: string | number;
    }, {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "lte";
        value: string | number | boolean;
        target: string | number;
    }>>, "many">;
    environment: z.ZodEnum<["development", "preview", "production"]>;
    percentage: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    enabled: boolean;
    rules: ({
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "in";
        value: string | number | boolean;
        target: string[];
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "not_in";
        value: string | number | boolean;
        target: string[];
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "contains";
        value: string | number | boolean;
        target: string;
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "not_contains";
        value: string | number | boolean;
        target: string;
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "eq";
        value: string | number | boolean;
        target: string;
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "not_eq";
        value: string | number | boolean;
        target: string;
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "empty";
        value: string | number | boolean;
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "not_empty";
        value: string | number | boolean;
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "gt";
        value: string | number | boolean;
        target: string | number;
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "gte";
        value: string | number | boolean;
        target: string | number;
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "lt";
        value: string | number | boolean;
        target: string | number;
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "lte";
        value: string | number | boolean;
        target: string | number;
    })[];
    environment: "development" | "preview" | "production";
    percentage: number | null;
}, {
    id: string;
    name: string;
    enabled: boolean;
    rules: ({
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "in";
        value: string | number | boolean;
        target: string[];
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "not_in";
        value: string | number | boolean;
        target: string[];
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "contains";
        value: string | number | boolean;
        target: string;
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "not_contains";
        value: string | number | boolean;
        target: string;
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "eq";
        value: string | number | boolean;
        target: string;
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "not_eq";
        value: string | number | boolean;
        target: string;
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "empty";
        value: string | number | boolean;
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "not_empty";
        value: string | number | boolean;
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "gt";
        value: string | number | boolean;
        target: string | number;
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "gte";
        value: string | number | boolean;
        target: string | number;
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "lt";
        value: string | number | boolean;
        target: string | number;
    } | {
        version: string;
        accessor: "city" | "country" | "region" | "ip" | "identifier";
        compare: "lte";
        value: string | number | boolean;
        target: string | number;
    })[];
    environment: "development" | "preview" | "production";
    percentage: number | null;
}>;

declare const rule: z.ZodDiscriminatedUnion<"compare", z.Primitive, z.ZodObject<z.extendShape<{
    version: z.ZodString;
    accessor: z.ZodString;
    compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
    /**
     * The flag returns this `value` if this rule evaluates to true
     */
    value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
}, {
    accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
    compare: z.ZodLiteral<"in">;
    target: z.ZodArray<z.ZodString, "many">;
}>, "strip", z.ZodTypeAny, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "in";
    value: string | number | boolean;
    target: string[];
}, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "in";
    value: string | number | boolean;
    target: string[];
}> | z.ZodObject<z.extendShape<{
    version: z.ZodString;
    accessor: z.ZodString;
    compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
    /**
     * The flag returns this `value` if this rule evaluates to true
     */
    value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
}, {
    accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
    compare: z.ZodLiteral<"not_in">;
    target: z.ZodArray<z.ZodString, "many">;
}>, "strip", z.ZodTypeAny, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "not_in";
    value: string | number | boolean;
    target: string[];
}, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "not_in";
    value: string | number | boolean;
    target: string[];
}> | z.ZodObject<z.extendShape<{
    version: z.ZodString;
    accessor: z.ZodString;
    compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
    /**
     * The flag returns this `value` if this rule evaluates to true
     */
    value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
}, {
    accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
    compare: z.ZodLiteral<"contains">;
    target: z.ZodString;
}>, "strip", z.ZodTypeAny, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "contains";
    value: string | number | boolean;
    target: string;
}, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "contains";
    value: string | number | boolean;
    target: string;
}> | z.ZodObject<z.extendShape<{
    version: z.ZodString;
    accessor: z.ZodString;
    compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
    /**
     * The flag returns this `value` if this rule evaluates to true
     */
    value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
}, {
    accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
    compare: z.ZodLiteral<"not_contains">;
    target: z.ZodString;
}>, "strip", z.ZodTypeAny, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "not_contains";
    value: string | number | boolean;
    target: string;
}, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "not_contains";
    value: string | number | boolean;
    target: string;
}> | z.ZodObject<z.extendShape<{
    version: z.ZodString;
    accessor: z.ZodString;
    compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
    /**
     * The flag returns this `value` if this rule evaluates to true
     */
    value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
}, {
    accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
    compare: z.ZodLiteral<"eq">;
    target: z.ZodString;
}>, "strip", z.ZodTypeAny, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "eq";
    value: string | number | boolean;
    target: string;
}, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "eq";
    value: string | number | boolean;
    target: string;
}> | z.ZodObject<z.extendShape<{
    version: z.ZodString;
    accessor: z.ZodString;
    compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
    /**
     * The flag returns this `value` if this rule evaluates to true
     */
    value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
}, {
    accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
    compare: z.ZodLiteral<"not_eq">;
    target: z.ZodString;
}>, "strip", z.ZodTypeAny, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "not_eq";
    value: string | number | boolean;
    target: string;
}, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "not_eq";
    value: string | number | boolean;
    target: string;
}> | z.ZodObject<z.extendShape<{
    version: z.ZodString;
    accessor: z.ZodString;
    compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
    /**
     * The flag returns this `value` if this rule evaluates to true
     */
    value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
}, {
    accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
    compare: z.ZodLiteral<"empty">;
}>, "strip", z.ZodTypeAny, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "empty";
    value: string | number | boolean;
}, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "empty";
    value: string | number | boolean;
}> | z.ZodObject<z.extendShape<{
    version: z.ZodString;
    accessor: z.ZodString;
    compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
    /**
     * The flag returns this `value` if this rule evaluates to true
     */
    value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
}, {
    accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
    compare: z.ZodLiteral<"not_empty">;
}>, "strip", z.ZodTypeAny, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "not_empty";
    value: string | number | boolean;
}, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "not_empty";
    value: string | number | boolean;
}> | z.ZodObject<z.extendShape<{
    version: z.ZodString;
    accessor: z.ZodString;
    compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
    /**
     * The flag returns this `value` if this rule evaluates to true
     */
    value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
}, {
    accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
    compare: z.ZodLiteral<"gt">;
    target: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
}>, "strip", z.ZodTypeAny, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "gt";
    value: string | number | boolean;
    target: string | number;
}, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "gt";
    value: string | number | boolean;
    target: string | number;
}> | z.ZodObject<z.extendShape<{
    version: z.ZodString;
    accessor: z.ZodString;
    compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
    /**
     * The flag returns this `value` if this rule evaluates to true
     */
    value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
}, {
    accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
    compare: z.ZodLiteral<"gte">;
    target: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
}>, "strip", z.ZodTypeAny, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "gte";
    value: string | number | boolean;
    target: string | number;
}, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "gte";
    value: string | number | boolean;
    target: string | number;
}> | z.ZodObject<z.extendShape<{
    version: z.ZodString;
    accessor: z.ZodString;
    compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
    /**
     * The flag returns this `value` if this rule evaluates to true
     */
    value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
}, {
    accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
    compare: z.ZodLiteral<"lt">;
    target: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
}>, "strip", z.ZodTypeAny, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "lt";
    value: string | number | boolean;
    target: string | number;
}, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "lt";
    value: string | number | boolean;
    target: string | number;
}> | z.ZodObject<z.extendShape<{
    version: z.ZodString;
    accessor: z.ZodString;
    compare: z.ZodEnum<["in", "not_in", "contains", "not_contains", "eq", "not_eq", "empty", "not_empty", "gt", "gte", "lt", "lte"]>;
    /**
     * The flag returns this `value` if this rule evaluates to true
     */
    value: z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>;
}, {
    accessor: z.ZodEnum<["city", "country", "region", "ip", "identifier"]>;
    compare: z.ZodLiteral<"lte">;
    target: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
}>, "strip", z.ZodTypeAny, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "lte";
    value: string | number | boolean;
    target: string | number;
}, {
    version: string;
    accessor: "city" | "country" | "region" | "ip" | "identifier";
    compare: "lte";
    value: string | number | boolean;
    target: string | number;
}>>;

type Flag = z.infer<typeof flag>;
type Environment = Flag["environment"];
type Rule = z.infer<typeof rule>;

type Identify = (req: NextRequest) => string | Promise<string>;
type Config = {
    identify?: Identify;
};
declare class EdgeFlags {
    private readonly identify?;
    config: ConfigAPI;
    constructor(opts?: Config);
    /**
     * handler should be default exported by the user in an edge compatible api route
     */
    handler(): NextMiddleware;
}
declare class ConfigAPI {
    private _dummy;
    private readonly newId;
    listFlags(): Promise<Flag[]>;
    /**
     * Create a new flag for each environment
     * The created flags will be disabled and have no rules.
     */
    createFlag(create: {
        name: string;
    }): Promise<Record<Flag["environment"], Flag>>;
    updateFlag(flagId: string, environment: Environment, data: {
        name?: string;
        enabled?: boolean;
        rules?: Rule[];
        percentage?: number | null;
    }): Promise<Flag>;
    copyFlag(flagId: string, from: Environment, to: Environment): Promise<void>;
    /**
     * DEV ONLY
     *
     * Seed some flags - THIS OVERRIDES THE EXISTING FLAGS
     *
     *
     */
    initDummy(): void;
}

export { Config, EdgeFlags, Environment, Flag, Rule };
