"use client";
import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
	Card,
	Title,
	Text,
	Tab,
	TabList,
	ColGrid,
	Block,
	List,
	ListItem,
	Toggle,
	ToggleItem,
	Flex,
	Button,
	Footer,
	ButtonInline,
	Divider,
	CategoryBar,
	ProgressBar,
	SelectBox,
	SelectBoxItem,
	Dropdown,
	DropdownItem,
	Icon,
	Col,
	Metric,
} from "@tremor/react";

import React, { useState } from "react";

type FlagProps = {
	id: string;
	name: string;
};

const Flag: React.FC<FlagProps> = ({ name }) => {
	const [enabled, setEnabled] = useState(false);
	const [percentage, setPercentage] = useState<number | null>(null);
	const [rules, setRules] = useState<null[]>([]);
	return (
		<Block>
			<Card shadow={true}>
				<Flex justifyContent='justify-start' spaceX="space-x-4">
					<Metric>{name}</Metric>
					<Flex justifyContent="justify-end" spaceX="space-x-4">
						<Button
							importance='secondary'
							size="sm"
							text="Add Rule"
							handleClick={() => setRules([...rules, null])}
						/>
						<Button
							importance='secondary'
							size="sm"
							text="Add Percentage"
							handleClick={() => {
								setPercentage(Math.round(Math.random() * 100));
							}}
						/>
						<Toggle
							defaultValue={enabled}
							handleSelect={setEnabled}
							color={enabled ? "green" : "red"}
						>
							<ToggleItem value={true} text="Enabled" />
							<ToggleItem value={false} text="Disabled" />
						</Toggle>
					</Flex>
				</Flex>

				<Divider />

				{percentage !== null ? (
					<Block>
						<Title>Percentage</Title>

						<ProgressBar
							// categoryPercentageValues={[percentage, 100 - percentage]}
							// colors={["green", "zinc"]}
							color="emerald"
							percentageValue={percentage}
							label={`${percentage}%`}
						/>
					</Block>
				) : null}

				{rules.length > 0 ? (
					<Block marginTop="mt-8">
						<Title>Rules</Title>

						{rules.map((rule, i) => (
							<Flex spaceX='space-x-2' marginTop='mt-4'>
								<SelectBox placeholder="Select Attribute">
									<SelectBoxItem value="userId" text="User Id" />
									<SelectBoxItem value="country" text="Country" />
									<SelectBoxItem value="ip" text="IP" />
									<SelectBoxItem value="custom" text="Custom Attribute" />
								</SelectBox>
								<SelectBox placeholder="Select Comparison">
									<SelectBoxItem value="not_in" text="is not one of" />
									<SelectBoxItem value="starts_with" text="starts with" />
									<SelectBoxItem value="ends_with" text="ends with" />
									<SelectBoxItem value="contains" text="contains" />
									<SelectBoxItem value="not_contains" text="does not contain" />
									<SelectBoxItem value="regex" text="match regex" />
									<SelectBoxItem value="lt" text="less than" />
									<SelectBoxItem value="lte" text="less than or equal" />
									<SelectBoxItem value="gt" text="greater than" />
									<SelectBoxItem value="gte" text="greater than or equal" />
								</SelectBox>

								<Icon icon={ArrowRightIcon} />
								<Dropdown placeholder="Value if enabled">
									<DropdownItem value={true} text="On" />
									<DropdownItem value={false} text="Off" />
								</Dropdown>

								<Button
									icon={XMarkIcon}
									size="sm"
									importance="secondary"
									color='red'
									text="Delete"
									handleClick={() => {
										setRules(rules.filter((_, j) => j !== i));
									}}
								/>
							</Flex>
						))}
					</Block>
				) : null}

				<Footer>
					<Flex justifyContent="justify-end" spaceX='space-x-4'>
						<ButtonInline size="sm" color="red" text="Delete Flag" />
						<Button importance="primary" size="sm" text="Save" />
					</Flex>
				</Footer>
			</Card>
		</Block>
	);
};

export default function Example() {
	return (
		<main className='pt-8'>
			<Flex>
				<div>
					<Title>Settings</Title>
					<Text>Manage your feature flags</Text>
				</div>
				<div>
					<SelectBox defaultValue="development">
						<SelectBoxItem value="development" text="Development" />
						<SelectBoxItem value="preview" text="Preview" />
						<SelectBoxItem value="roduction" text="Production" />
					</SelectBox>
				</div>
			</Flex>

			<ColGrid numCols={1} gapY="gap-y-8" marginTop="mt-8">
				<Flag id="1" name="dropdb" />
				<Flag id="2" name="feature-x" />
				<Flag id="3" name="fire 50% of twitter" />
			</ColGrid>
		</main>
	);
}
