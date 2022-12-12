import { z } from "zod";
import { rule } from "./rules";

export const flag = z.object({
	// The id must be unique
	id: z.string(),
	// The name must be unique per tenant but is shared across environments
	name: z.string(),
	enabled: z.boolean(),
	rules: z.array(rule),
	environment: z.enum(["development", "preview", "production"]),
	percentage: z.number().min(0).max(100).nullable(),
	value: z.boolean(),
	createdAt: z.number().int().positive(),
	updatedAt: z.number().int().positive(),
});
