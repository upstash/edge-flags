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
import { TrashIcon, ArrowPathIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useFlag } from "@upstash/edge-flags";
import { useEffect, useState } from "react";

export default function Example() {
  const [flag, setFlag] = useState("my-flag");
  const [attribute, setAttribute] = useState<{ name: string; value: string } | null>(null);

  const { isEnabled, isLoading, error, debug, refresh } = useFlag(
    flag,
    attribute
      ? {
          [attribute.name]: attribute.value,
        }
      : undefined,
  );

  useEffect(() => {
    refresh();
  }, [flag, attribute]);

  return (
    <main
      style={{
        margin: "8rem",
      }}
    >
      <Flex>
        <Block>
          <Title>@upstash/edge-flags</Title>
          <Text color="blue">
            <a href="https://console-git-feature-flag-upstash.vercel.app/edge-flags" target="_blank" rel="noreferrer">
              console.upstash.com/edge-flags
            </a>
          </Text>
        </Block>
        <Button
          color="emerald"
          icon={ArrowPathIcon}
          text="Reload"
          disabled={isLoading}
          loading={isLoading}
          onClick={refresh}
        />
      </Flex>

      <Card marginTop="mt-6">
        <Block>
          <Subtitle>Select your flag</Subtitle>

          <TextInput value={flag} onChange={(v) => setFlag(v.currentTarget.value)} />
        </Block>
        <Block marginTop="mt-6">
          <Subtitle>Add a custom attribute</Subtitle>
          <Flex spaceX="space-x-2" justifyContent="justify-center">
            <TextInput
              value={attribute?.name ?? ""}
              onChange={(v) => setAttribute({ name: v.currentTarget.value, value: attribute?.value ?? "" })}
            />
            <TextInput
              value={attribute?.value ?? ""}
              onChange={(v) => setAttribute({ name: attribute?.name ?? "", value: v.currentTarget.value })}
            />
          </Flex>
        </Block>
      </Card>
      {error ? (
        <Block marginTop="mt-6">
          <Card decorationColor="red">
            <Subtitle color="red">{error}</Subtitle>
          </Card>
        </Block>
      ) : null}
      <ColGrid numColsMd={2} numColsLg={4} gapX="gap-x-6" gapY="gap-y-6" marginTop="mt-6">
        <Card>
          <Block truncate={true}>
            <Text>Enabled</Text>
            <Metric truncate={true}>{isEnabled?.toString().toUpperCase()}</Metric>
          </Block>
        </Card>
        <Card>
          <Block truncate={true}>
            <Text>Loading</Text>
            <Metric truncate={true}>{isLoading.toString().toUpperCase()}</Metric>
          </Block>
        </Card>

        <Card>
          <Block truncate={true}>
            <Text>Vercel Cache</Text>

            <Metric truncate={true}>{debug.cache.vercel ? debug.cache.vercel : ""}</Metric>
          </Block>
        </Card>
        <Card>
          <Block truncate={true}>
            <Text>Memory Cache</Text>

            <Metric truncate={true}>{debug.cache.memory ? debug.cache.memory : ""}</Metric>
          </Block>
        </Card>

        <Card>
          <Block truncate={true}>
            <Text>Redis Latency</Text>
            {debug.redisLatency ? (
              <Flex justifyContent="justify-start" alignItems="items-end" spaceX="space-x-2">
                <Metric truncate={true}>
                  {Intl.NumberFormat(undefined, {
                    compactDisplay: "short",
                  }).format(debug.redisLatency)}
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
