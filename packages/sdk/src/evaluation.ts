import { EvalRequest, Rule } from "./rules";
import { Flag } from "./types";

export function evaluate(flag: Flag, userPercentage: number, req: EvalRequest, debug?: boolean): boolean {
  if (debug) console.log("Evaluating flag", JSON.stringify(flag));

  if (flag.percentage) {
    if (debug) console.log({ userPercentage, flagPercentage: flag.percentage });

    if (userPercentage < flag.percentage) {
      return false;
    }
  }
  if (debug) console.log(JSON.stringify({ evalRequest: req.eval }, null, 2));

  for (const rule of flag.rules) {
    const hit = new Rule(rule).match(req);
    if (debug) console.log("matching rule", rule, { hit });

    if (hit) {
      if (debug) console.log("Returning", rule.value);

      return rule.value;
    }
  }

  /**
   * No rule applied
   */

  return false;
}
