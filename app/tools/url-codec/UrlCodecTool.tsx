"use client";

import { useState } from "react";
import {
  Stack,
  Group,
  Button,
  Textarea,
  Alert,
  CopyButton as MantineCopyButton,
  ActionIcon,
  Tooltip,
  Text,
  Select,
  Card,
  Table,
  ScrollArea,
} from "@mantine/core";
import {
  IconCopy,
  IconCheck,
  IconAlertCircle,
  IconSwitch,
} from "@tabler/icons-react";
import { ToolLayout } from "../../components/tools/ToolLayout";
import { URLCodecState, URLComponents } from "../../lib/types";
import { notifications } from "@mantine/notifications";

export function UrlCodecTool() {
  const [state, setState] = useState<URLCodecState>({
    mode: "encode",
    input: "",
    output: "",
    components: {
      protocol: "",
      host: "",
      path: "",
      query: {},
      fragment: "",
    },
    encoding: "utf8",
  });

  const parseURL = (url: string): URLComponents => {
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `http://${url}`);
      const query: Record<string, string> = {};

      urlObj.searchParams.forEach((value, key) => {
        query[key] = value;
      });

      return {
        protocol: urlObj.protocol.slice(0, -1), // Remove trailing ':'
        host: urlObj.host,
        path: urlObj.pathname,
        query,
        fragment: urlObj.hash.slice(1), // Remove leading '#'
      };
    } catch (error) {
      return {
        protocol: "",
        host: "",
        path: "",
        query: {},
        fragment: "",
      };
    }
  };

  const processURL = (inputText: string) => {
    if (!inputText.trim()) {
      setState((prev) => ({
        ...prev,
        output: "",
        components: {
          protocol: "",
          host: "",
          path: "",
          query: {},
          fragment: "",
        },
      }));
      return;
    }

    try {
      let result = "";
      let components: URLComponents = {
        protocol: "",
        host: "",
        path: "",
        query: {},
        fragment: "",
      };

      if (state.mode === "encode") {
        result = encodeURIComponent(inputText);

        // Try to parse as URL to extract components
        if (inputText.includes("://") || inputText.includes(".")) {
          components = parseURL(inputText);
        }
      } else {
        result = decodeURIComponent(inputText);

        // Try to parse the decoded result as URL
        if (result.includes("://") || result.includes(".")) {
          components = parseURL(result);
        }
      }

      setState((prev) => ({
        ...prev,
        output: result,
        components,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Processing failed";
      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
      });
    }
  };

  const handleInputChange = (value: string) => {
    setState((prev) => ({ ...prev, input: value }));
    processURL(value);
  };

  const handleModeSwitch = () => {
    setState((prev) => ({
      ...prev,
      mode: prev.mode === "encode" ? "decode" : "encode",
      input: prev.output,
      output: prev.input,
    }));
  };

  const handleClear = () => {
    setState((prev) => ({
      ...prev,
      input: "",
      output: "",
      components: {
        protocol: "",
        host: "",
        path: "",
        query: {},
        fragment: "",
      },
    }));
  };

  const encodeQueryString = (params: Record<string, string>): string => {
    return Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
  };

  const decodeQueryString = (queryString: string): Record<string, string> => {
    const params: Record<string, string> = {};
    if (!queryString) return params;

    const pairs = queryString.split("&");
    pairs.forEach((pair) => {
      const [key, value] = pair.split("=");
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || "");
      }
    });

    return params;
  };

  const encodeFullURL = () => {
    const { protocol, host, path, query, fragment } = state.components;
    if (!host) return "";

    let url = `${protocol || "https"}://${host}`;
    if (path && path !== "/") url += path;

    const queryString =
      Object.keys(query).length > 0 ? encodeQueryString(query) : "";
    if (queryString) url += `?${queryString}`;

    if (fragment) url += `#${fragment}`;

    return url;
  };

  const specialEncodings = [
    { name: "Space", original: " ", encoded: "%20" },
    { name: "Exclamation", original: "!", encoded: "%21" },
    { name: "Double Quote", original: '"', encoded: "%22" },
    { name: "Hash", original: "#", encoded: "%23" },
    { name: "Dollar", original: "$", encoded: "%24" },
    { name: "Percent", original: "%", encoded: "%25" },
    { name: "Ampersand", original: "&", encoded: "%26" },
    { name: "Single Quote", original: "'", encoded: "%27" },
    { name: "Plus", original: "+", encoded: "%2B" },
    { name: "Forward Slash", original: "/", encoded: "%2F" },
    { name: "Question Mark", original: "?", encoded: "%3F" },
    { name: "At Symbol", original: "@", encoded: "%40" },
  ];

  return (
    <ToolLayout
      title="URL Encoder/Decoder"
      description="Encode and decode URLs, query parameters, and URI components"
      actions={
        <Group gap="sm">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button
            leftSection={<IconSwitch size={16} />}
            onClick={handleModeSwitch}
          >
            Switch to {state.mode === "encode" ? "Decode" : "Encode"}
          </Button>
        </Group>
      }
    >
      <Stack gap="lg">
        {/* Mode and Encoding Selection */}
        <Group gap="md">
          <Select
            label="Encoding"
            value={state.encoding}
            onChange={(value) =>
              setState((prev) => ({
                ...prev,
                encoding: value as "utf8" | "ascii" | "custom",
              }))
            }
            data={[
              { value: "utf8", label: "UTF-8" },
              { value: "ascii", label: "ASCII" },
              { value: "custom", label: "Custom" },
            ]}
            w={120}
          />
        </Group>

        {/* Input/Output Areas */}
        <Group grow align="flex-start" gap="lg">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500}>
                Input (
                {state.mode === "encode" ? "Raw Text/URL" : "Encoded URL"})
              </Text>
            </Group>
            <Textarea
              value={state.input}
              onChange={(event) => handleInputChange(event.currentTarget.value)}
              placeholder={
                state.mode === "encode"
                  ? "https://example.com/path?param=value&name=John Doe#section"
                  : "https%3A//example.com/path%3Fparam%3Dvalue%26name%3DJohn%20Doe%23section"
              }
              minRows={6}
              maxRows={12}
              style={{ fontFamily: "var(--font-geist-mono)" }}
            />
          </Stack>

          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500}>
                Output (
                {state.mode === "encode" ? "Encoded URL" : "Decoded Text/URL"})
              </Text>
              {state.output && (
                <MantineCopyButton value={state.output} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? "Copied!" : "Copy to clipboard"}>
                      <ActionIcon
                        color={copied ? "teal" : "gray"}
                        variant="subtle"
                        onClick={() => {
                          copy();
                          notifications.show({
                            title: "Copied!",
                            message: "Output copied to clipboard",
                            color: "green",
                          });
                        }}
                      >
                        {copied ? (
                          <IconCheck size={16} />
                        ) : (
                          <IconCopy size={16} />
                        )}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </MantineCopyButton>
              )}
            </Group>
            <Textarea
              value={state.output}
              readOnly
              placeholder="Processed output will appear here..."
              minRows={6}
              maxRows={12}
              style={{
                fontFamily: "var(--font-geist-mono)",
                backgroundColor: "var(--mantine-color-gray-0)",
              }}
            />
          </Stack>
        </Group>

        {/* URL Components Analysis */}
        {(state.components.host ||
          Object.keys(state.components.query).length > 0) && (
          <Card>
            <Stack gap="md">
              <Text fw={600}>URL Components</Text>

              <Group grow>
                <Stack gap="xs">
                  <Text size="sm" fw={500}>
                    Basic Components
                  </Text>
                  <Table>
                    <Table.Tbody>
                      {state.components.protocol && (
                        <Table.Tr>
                          <Table.Td fw={500}>Protocol</Table.Td>
                          <Table.Td
                            style={{ fontFamily: "var(--font-geist-mono)" }}
                          >
                            {state.components.protocol}
                          </Table.Td>
                        </Table.Tr>
                      )}
                      {state.components.host && (
                        <Table.Tr>
                          <Table.Td fw={500}>Host</Table.Td>
                          <Table.Td
                            style={{ fontFamily: "var(--font-geist-mono)" }}
                          >
                            {state.components.host}
                          </Table.Td>
                        </Table.Tr>
                      )}
                      {state.components.path &&
                        state.components.path !== "/" && (
                          <Table.Tr>
                            <Table.Td fw={500}>Path</Table.Td>
                            <Table.Td
                              style={{ fontFamily: "var(--font-geist-mono)" }}
                            >
                              {state.components.path}
                            </Table.Td>
                          </Table.Tr>
                        )}
                      {state.components.fragment && (
                        <Table.Tr>
                          <Table.Td fw={500}>Fragment</Table.Td>
                          <Table.Td
                            style={{ fontFamily: "var(--font-geist-mono)" }}
                          >
                            {state.components.fragment}
                          </Table.Td>
                        </Table.Tr>
                      )}
                    </Table.Tbody>
                  </Table>
                </Stack>

                {Object.keys(state.components.query).length > 0 && (
                  <Stack gap="xs">
                    <Text size="sm" fw={500}>
                      Query Parameters
                    </Text>
                    <ScrollArea.Autosize mah={200}>
                      <Table>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Parameter</Table.Th>
                            <Table.Th>Value</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {Object.entries(state.components.query).map(
                            ([key, value]) => (
                              <Table.Tr key={key}>
                                <Table.Td
                                  style={{
                                    fontFamily: "var(--font-geist-mono)",
                                  }}
                                >
                                  {key}
                                </Table.Td>
                                <Table.Td
                                  style={{
                                    fontFamily: "var(--font-geist-mono)",
                                  }}
                                >
                                  {value}
                                </Table.Td>
                              </Table.Tr>
                            )
                          )}
                        </Table.Tbody>
                      </Table>
                    </ScrollArea.Autosize>
                  </Stack>
                )}
              </Group>
            </Stack>
          </Card>
        )}

        {/* Reference Table */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>Common URL Encoding Reference</Text>
            <ScrollArea.Autosize mah={300}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Character</Table.Th>
                    <Table.Th>Original</Table.Th>
                    <Table.Th>Encoded</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {specialEncodings.map((item) => (
                    <Table.Tr key={item.name}>
                      <Table.Td>{item.name}</Table.Td>
                      <Table.Td
                        style={{ fontFamily: "var(--font-geist-mono)" }}
                      >
                        {item.original}
                      </Table.Td>
                      <Table.Td
                        style={{ fontFamily: "var(--font-geist-mono)" }}
                      >
                        {item.encoded}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea.Autosize>
          </Stack>
        </Card>
      </Stack>
    </ToolLayout>
  );
}
