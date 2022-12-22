// /api/edge-flags.ts

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	console.log("SERVERLESS");
	res.send(`Hello ${JSON.stringify(req.query)}`);
	res.end();
}
