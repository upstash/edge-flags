import {
	Card,
	Title,
	Text,
	ColGrid,
	Col,
	Block,
	Metric,
	Badge,
	Toggle,
	ToggleItem,
	Flex,
	TextInput,
	Button,
	Subtitle,
} from "@tremor/react";
import { useFlag } from "@upstash/edge-flags";
import { useState } from "react";

export default function Example() {
	const [flag, setFlag] = useState("my-flag");
	const [input, setInput] = useState(flag);
	const { isEnabled, isLoading, error, debug } = useFlag(flag);
	return (
		<main
			style={{
				margin: "8rem",
			}}
		>
			<Title>@upstash/edge-flags</Title>
			<Text color="blue">
				<a
					href="https://console-git-feature-flag-upstash.vercel.app/edge-flags"
					target="_blank"
					rel="noreferrer"
				>
					console.upstash.com/edge-flags
				</a>
			</Text>

			<Block marginTop="mt-6">
				<Card>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							setFlag(input);
						}}
					>
						<Subtitle>Select your flag</Subtitle>
						<Flex spaceX="space-x-2" justifyContent="justify-center">
							<TextInput
								value={input}
								onChange={(v) => setInput(v.currentTarget.value)}
							/>
							<Button color="zinc" text="Set" onClick={() => setFlag(input)} />
						</Flex>
					</form>
				</Card>
			</Block>
			{error ? (
				<Block marginTop="mt-6">
					<Card decorationColor="red">
						<Subtitle color="red">{error}</Subtitle>
					</Card>
				</Block>
			) : null}
			<ColGrid
				numColsMd={2}
				numColsLg={4}
				gapX="gap-x-6"
				gapY="gap-y-6"
				marginTop="mt-6"
			>
				<Card>
					<Block truncate={true}>
						<Text>Loading</Text>
						<Metric truncate={true}>
							{isLoading.toString().toUpperCase()}
						</Metric>
					</Block>
				</Card>
				<Card>
					<Block truncate={true}>
						<Text>Error</Text>
						<Metric truncate={true}>{error ?? "-"}</Metric>
					</Block>
				</Card>
				<Card>
					<Block truncate={true}>
						<Text>Enabled</Text>
						<Metric truncate={true}>
							{isEnabled?.toString().toUpperCase()}
						</Metric>
					</Block>
				</Card>

				<Card>
					<Block truncate={true}>
						<Text>Cache</Text>

						<Metric truncate={true}>
							{debug.cacheHit ? debug.cacheHit : ""}
						</Metric>
					</Block>
				</Card>
				<Card>
					<Block truncate={true}>
						<Text>Latency</Text>
						{debug.latency ? (
							<Flex
								justifyContent="justify-start"
								alignItems="items-end"
								spaceX="space-x-2"
							>
								<Metric truncate={true}>
									{Intl.NumberFormat(undefined, {
										compactDisplay: "short",
									}).format(debug.latency)}
								</Metric>
								<Text>ms</Text>
							</Flex>
						) : null}
					</Block>
				</Card>
			</ColGrid>
		</main>
	);
}
