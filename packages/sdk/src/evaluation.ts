import { EvalRequest, Rule } from "./rules";
import { Flag } from "./types";

export function evaluate(flag: Flag, userPercentage: number, req: EvalRequest): boolean {
  console.log("Found flag", JSON.stringify(flag));

  if (flag.percentage) {
    console.log({ userPercentage, flagPercentage: flag.percentage });
    if (userPercentage < flag.percentage) {
      return false;
    }
  }

  console.log(JSON.stringify({ evalRequest: req.eval }, null, 2));

  for (const rule of flag.rules) {
    const hit = new Rule(rule).evaluate(req);
    console.log("evaluating rule", rule, { hit });
    if (hit) {
      console.log("Returning", rule.value);

      return rule.value;
    }
  }

  /**
   * No rule applied
   */

  return false;
}
