import { setLazyProp } from "next/dist/server/api-utils";
import { useEffect, useState } from "react";

export type EdgeFlagsConfig = {
	/**
	 * The full to the edge function.
	 * TODO:
	 * @default "/api/edge-flags"
	 */
	url?: string;
};

// export class EdgeFlagsServerComponent {
// 	private url: URL;
// 	constructor(config?: EdgeFlagsConfig) {
// 		const host = process.env.VERCEL_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL

// 		const baseUrl = host ? `https://${host}` : "http://localhost:3000"
// 		this.url = new URL("/api/edge-flags", baseUrl)
// 	}

// 	private async eval(flagName: string): Promise<boolean> {
// 		const url = new URL(this.url)
// 		url.searchParams.set("flag", flagName)
// 		console.log({url})
// 		const res = await fetch(url)
// 		if (res.status !== 200) {
// 			throw new Error(await res.text())
// 		}
// 		const { value } = await res.json() as { value: boolean }
// 		return value

// 	}

// 	/**
// 	 * Check if a boolean feature flag is enabled or not
// 	 */
// 	public async isEnabled(flagName: string): Promise<boolean> {

// 		return await this.eval(flagName);
// 	}
// }

export type UseFlag = {
	isLoading: boolean;
	error: string | null;
	isEnabled: boolean | null;
	/**
	 * For development purposes only
	 * 
	 * This can change at any time
	 */
	debug: {
		latency: number | null;
		cacheHit: string | null
	}
};

export function useFlag(flagName: string): UseFlag {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
	const [latency, setLatency] = useState<number | null>(null);
	const [cacheHit, setCacheHit] = useState<string | null>(null);

	const getFlag = async () => {
		const now = Date.now();
		try {
			setIsLoading(true);
			const res = await fetch(`/api/edge-flags?flag=${flagName}`);
			if (!res.ok) {
				setError(await res.text());
				return;
			}
			console.log(res.headers)
			const json = (await res.json()) as { value: boolean };
			console.log({ json });
			setCacheHit(res.headers.get("X-Vercel-Cache"))
			setIsEnabled(json.value);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				throw err;
			}
		} finally {
			setLatency(Date.now() - now);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getFlag();
	}, [flagName]);

	return { isLoading, error, isEnabled, debug: { latency, cacheHit } };
}

export class EdgeFlagsClientComponent {
	private url: URL;
	constructor(config?: EdgeFlagsConfig) {
		const host = process.env.VERCEL_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL;

		const baseUrl = host ? `https://${host}` : "http://localhost:3000";
		this.url = new URL("/api/edge-flags", baseUrl);
	}

	private async eval(flagName: string): Promise<boolean> {
		const url = new URL(this.url);
		url.searchParams.set("flag", flagName);
		console.log({ url });
		const res = await fetch(url);
		if (res.status !== 200) {
			throw new Error(await res.text());
		}
		const { value } = (await res.json()) as { value: boolean };
		return value;
	}

	/**
	 * Check if a boolean feature flag is enabled or not
	 */
	public async isEnabled(flagName: string): Promise<boolean> {
		return await this.eval(flagName);
	}
}
