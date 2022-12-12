export type ClientConfig = {
	/**
	 * The path to the edge function
	 *
	 * @default "/api/edge-flags"
	 */
	path?: string;
};

export class Client {
	private path: string;
	constructor({ path = "/api/edge-flags" }: ClientConfig) {
		this.path = path;
	}

	public async isEnabled(flagName: string): Promise<boolean> {
		return true;
	}
}
