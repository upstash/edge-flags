import { z } from "zod";
import { rule } from "./rules";

export const flag = z.object({
  // The name must be unique per tenant but is shared across environments
  name: z.string(),
  version: z.string(),
  enabled: z.boolean(),
  rules: z.array(rule),
  environment: z.enum(["development", "preview", "production"]),
  percentage: z.number().min(0).max(100).nullable(),
  createdAt: z.number().int().positive(),
  updatedAt: z.number().int().positive(),
});
