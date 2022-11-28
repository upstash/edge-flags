import { z } from "zod";
import { rule } from "./rules";

export const flag = z.object({
	id: z.string(),
	enabled: z.boolean(),
	rules: z.array(rule),
	environment: z.enum(["development", "preview", "production"]),
	percentage: z.number().min(0).max(100).nullable(),
});
