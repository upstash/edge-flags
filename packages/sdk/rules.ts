// Rules

/**
 * Some special keys are prefixed with $
 * $not: negate the following condition
 * $or
 * $and
 * $in
 * $eq
 * $startsWith
 * $endsWith
 * $regex
 * $gt
 * $lt
 */
export const x = {
	$and: [
		{
			$or: [
				{
					"geo.country": {
						$in: ["US", "CA"],
					},
				},
				{
					"geo.ip": {
						$not: {
							$in: ["1.1.1.1"],
						},
					},
				},
			],
		},
		{
			"user.id": {
				$startsWith: "x",
			},
		},
	],
};
