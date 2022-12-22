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
} from "@tremor/react";
import { useFlag } from "@upstash/edge-flags";

export default function Example() {
  const { isEnabled, isLoading, error, debug } = useFlag("my-flag");
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
            <Text>Latency</Text>
            {debug.latency ?
              <Flex justifyContent="justify-start" alignItems="items-end">
                <Metric truncate={true}>
                  {Intl.NumberFormat(undefined, {
                    compactDisplay: "short",
                  }).format(debug.latency)
                  }
                </Metric>
                <Text>
                  ms
                </Text>
              </Flex> : null}
          </Block>
        </Card>
        <Card>
          <Block truncate={true}>
            <Text>Cache</Text>

            <Metric truncate={true}>
              {debug.cache}
            </Metric>
          </Block>
        </Card>
      </ColGrid>

      <Block marginTop="mt-6">
        <Card>
          <div className="h-80" />
        </Card>
      </Block>
    </main>
  );
}
