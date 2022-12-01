import { flag } from "./flag";
import { rule } from "./rules";
import { z } from "zod";
export type Flag = z.infer<typeof flag>;
export type Environment = Flag["environment"];
export type Rule = z.infer<typeof rule>;
