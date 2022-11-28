import { NextMiddleware, NextRequest, NextResponse } from "next/server";

type Identify = (req: NextRequest) => string | Promise<string>;

export type Config = {
	identify: Identify;
};

export class EdgeFlags {
	public readonly config: Config;

	constructor(config: Config) {
		this.config = config;
	}

	/**
	 * handler should be default exported by the user in an edge compatible api route
	 */
	public handler(): NextMiddleware {
		return (_req: NextRequest) => {
			return NextResponse.next();
		};
	}
}
