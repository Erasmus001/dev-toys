'use client';

import { useState } from 'react';
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
  Badge
} from '@mantine/core';
import { IconCopy, IconCheck, IconAlertCircle, IconArrowsExchange } from '@tabler/icons-react';
import { ToolLayout } from '../../components/tools/ToolLayout';
import { notifications } from '@mantine/notifications';
import * as yaml from 'js-yaml';

type ConversionMode = 'json-to-yaml' | 'yaml-to-json';

interface JsonYamlState {
  mode: ConversionMode;
  input: string;
  output: string;
  isValid: boolean;
  error?: string;
  yamlOptions: {
    indent: number;
    flowLevel: number;
    styles: 'default' | 'compact' | 'flow';
  };
}

export function JsonYamlTool() {
  const [state, setState] = useState<JsonYamlState>({
    mode: 'json-to-yaml',
    input: '',
    output: '',
    isValid: true,
    error: undefined,
    yamlOptions: {
      indent: 2,
      flowLevel: -1,
      styles: 'default'
    }
  });

  const convertJsonToYaml = (jsonString: string): string => {
    try {
      const jsonData = JSON.parse(jsonString);
      
      const yamlOptions: yaml.DumpOptions = {
        indent: state.yamlOptions.indent,
        flowLevel: state.yamlOptions.flowLevel,
        styles: state.yamlOptions.styles === 'flow' ? {} : undefined
      };

      return yaml.dump(jsonData, yamlOptions);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Invalid JSON format');
    }
  };

  const convertYamlToJson = (yamlString: string): string => {
    try {
      const yamlData = yaml.load(yamlString);
      return JSON.stringify(yamlData, null, 2);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Invalid YAML format');
    }
  };

  const processConversion = (inputText: string) => {
    if (!inputText.trim()) {
      setState(prev => ({
        ...prev,
        output: '',
        isValid: true,
        error: undefined
      }));
      return;
    }

    try {
      let result = '';
      
      if (state.mode === 'json-to-yaml') {
        result = convertJsonToYaml(inputText);
      } else {
        result = convertYamlToJson(inputText);
      }

      setState(prev => ({
        ...prev,
        output: result,
        isValid: true,
        error: undefined
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Conversion failed';
      setState(prev => ({
        ...prev,
        output: '',
        isValid: false,
        error: errorMessage
      }));
    }
  };

  const handleInputChange = (value: string) => {
    setState(prev => ({ ...prev, input: value }));
    processConversion(value);
  };

  const handleModeSwitch = () => {
    setState(prev => {
      const newMode = prev.mode === 'json-to-yaml' ? 'yaml-to-json' : 'json-to-yaml';
      return {
        ...prev,
        mode: newMode,
        input: prev.output || prev.input,
        output: '',
        error: undefined,
        isValid: true
      };
    });
  };

  const handleClear = () => {
    setState(prev => ({
      ...prev,
      input: '',
      output: '',
      error: undefined,
      isValid: true
    }));
  };

  const updateYamlOptions = (updates: Partial<typeof state.yamlOptions>) => {
    setState(prev => ({
      ...prev,
      yamlOptions: { ...prev.yamlOptions, ...updates }
    }));
    
    // Re-process if we have input and we're in JSON to YAML mode
    if (state.input.trim() && state.mode === 'json-to-yaml') {
      setTimeout(() => processConversion(state.input), 0);
    }
  };

  const sampleData = {
    json: {
      name: "DevTools Mini",
      version: "1.0.0",
      description: "A comprehensive developer utility application",
      tools: [
        "Base64 Encoder/Decoder",
        "JSON Formatter",
        "Password Generator"
      ],
      config: {
        theme: "auto",
        language: "en",
        features: {
          darkMode: true,
          copyToClipboard: true
        }
      }
    },
    yaml: `name: DevTools Mini
version: "1.0.0"
description: A comprehensive developer utility application
tools:
  - Base64 Encoder/Decoder
  - JSON Formatter
  - Password Generator
config:
  theme: auto
  language: en
  features:
    darkMode: true
    copyToClipboard: true`
  };

  const loadSample = () => {
    const sample = state.mode === 'json-to-yaml' 
      ? JSON.stringify(sampleData.json, null, 2)
      : sampleData.yaml;
    
    setState(prev => ({ ...prev, input: sample }));
    processConversion(sample);
  };

  return (
    <ToolLayout
      title="JSON ↔ YAML Converter"
      description="Convert between JSON and YAML formats with customizable formatting options"
      actions={
        <Group gap="sm">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="outline" onClick={loadSample}>
            Load Sample
          </Button>
          <Button 
            leftSection={<IconArrowsExchange size={16} />}
            onClick={handleModeSwitch}
          >
            Switch to {state.mode === 'json-to-yaml' ? 'YAML → JSON' : 'JSON → YAML'}
          </Button>
        </Group>
      }
    >
      <Stack gap="lg">
        {/* Mode Indicator */}
        <Card>
          <Group justify="space-between">
            <Text fw={600}>Conversion Mode</Text>
            <Badge size="lg" color="blue">
              {state.mode === 'json-to-yaml' ? 'JSON → YAML' : 'YAML → JSON'}
            </Badge>
          </Group>
        </Card>

        {/* YAML Options (only for JSON to YAML) */}
        {state.mode === 'json-to-yaml' && (
          <Card>
            <Stack gap="md">
              <Text fw={600}>YAML Output Options</Text>
              
              <Group grow>
                <Select
                  label="Indentation"
                  value={state.yamlOptions.indent.toString()}
                  onChange={(value) => updateYamlOptions({ indent: parseInt(value!) })}
                  data={[
                    { value: '2', label: '2 spaces' },
                    { value: '4', label: '4 spaces' },
                    { value: '8', label: '8 spaces' }
                  ]}
                />
                
                <Select
                  label="Style"
                  value={state.yamlOptions.styles}
                  onChange={(value) => updateYamlOptions({ styles: value as 'default' | 'compact' | 'flow' })}
                  data={[
                    { value: 'default', label: 'Default (Block)' },
                    { value: 'flow', label: 'Flow Style' },
                    { value: 'compact', label: 'Compact' }
                  ]}
                />
                
                <Select
                  label="Flow Level"
                  value={state.yamlOptions.flowLevel.toString()}
                  onChange={(value) => updateYamlOptions({ flowLevel: parseInt(value!) })}
                  data={[
                    { value: '-1', label: 'Never' },
                    { value: '0', label: 'Root Level' },
                    { value: '1', label: 'Level 1+' },
                    { value: '2', label: 'Level 2+' }
                  ]}
                />
              </Group>
            </Stack>
          </Card>
        )}

        {/* Error Display */}
        {state.error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            <Text fw={500}>Conversion Error</Text>
            <Text size="sm">{state.error}</Text>
          </Alert>
        )}

        {/* Input/Output Areas */}
        <Group grow align="flex-start" gap="lg">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500}>
                Input ({state.mode === 'json-to-yaml' ? 'JSON' : 'YAML'})
              </Text>
            </Group>
            <Textarea
              value={state.input}
              onChange={(event) => handleInputChange(event.currentTarget.value)}
              placeholder={
                state.mode === 'json-to-yaml' 
                  ? `{\n  "name": "example",\n  "version": "1.0.0"\n}`
                  : `name: example\nversion: "1.0.0"`
              }
              minRows={12}
              maxRows={20}
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            />
          </Stack>

          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500}>
                Output ({state.mode === 'json-to-yaml' ? 'YAML' : 'JSON'})
              </Text>
              {state.output && (
                <MantineCopyButton value={state.output} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Copied!' : 'Copy to clipboard'}>
                      <ActionIcon
                        color={copied ? 'teal' : 'gray'}
                        variant="subtle"
                        onClick={() => {
                          copy();
                          notifications.show({
                            title: 'Copied!',
                            message: 'Converted output copied to clipboard',
                            color: 'green'
                          });
                        }}
                      >
                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </MantineCopyButton>
              )}
            </Group>
            <Textarea
              value={state.output}
              readOnly
              placeholder="Converted output will appear here..."
              minRows={12}
              maxRows={20}
              style={{ 
                fontFamily: 'var(--font-geist-mono)',
                backgroundColor: 'var(--mantine-color-gray-0)'
              }}
            />
          </Stack>
        </Group>

        {/* Format Information */}
        <Group grow align="flex-start" gap="lg">
          <Card>
            <Stack gap="md">
              <Text fw={600}>JSON Format</Text>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  <strong>Features:</strong>
                </Text>
                <Text size="sm" c="dimmed">• Lightweight data interchange format</Text>
                <Text size="sm" c="dimmed">• Widely supported across programming languages</Text>
                <Text size="sm" c="dimmed">• Strict syntax with quoted keys</Text>
                <Text size="sm" c="dimmed">• Native JavaScript support</Text>
                
                <Text size="sm" c="dimmed" mt="md">
                  <strong>Best for:</strong> APIs, configuration files, data transfer
                </Text>
              </Stack>
            </Stack>
          </Card>

          <Card>
            <Stack gap="md">
              <Text fw={600}>YAML Format</Text>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  <strong>Features:</strong>
                </Text>
                <Text size="sm" c="dimmed">• Human-readable data serialization</Text>
                <Text size="sm" c="dimmed">• Indentation-based structure</Text>
                <Text size="sm" c="dimmed">• Supports comments and multi-line strings</Text>
                <Text size="sm" c="dimmed">• More flexible syntax</Text>
                
                <Text size="sm" c="dimmed" mt="md">
                  <strong>Best for:</strong> Configuration files, documentation, CI/CD
                </Text>
              </Stack>
            </Stack>
          </Card>
        </Group>

        {/* Conversion Statistics */}
        {state.output && (
          <Card>
            <Stack gap="md">
              <Text fw={600}>Conversion Statistics</Text>
              <Group gap="md">
                <Text size="sm" c="dimmed">
                  <strong>Input Size:</strong> {state.input.length} characters
                </Text>
                <Text size="sm" c="dimmed">
                  <strong>Output Size:</strong> {state.output.length} characters
                </Text>
                <Text size="sm" c="dimmed">
                  <strong>Input Lines:</strong> {state.input.split('\n').length}
                </Text>
                <Text size="sm" c="dimmed">
                  <strong>Output Lines:</strong> {state.output.split('\n').length}
                </Text>
                <Text size="sm" c={state.output.length > state.input.length ? 'orange' : 'green'}>
                  <strong>Size Change:</strong> {state.output.length > state.input.length ? '+' : ''}{state.output.length - state.input.length} chars
                </Text>
              </Group>
            </Stack>
          </Card>
        )}
      </Stack>
    </ToolLayout>
  );
}