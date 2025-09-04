'use client';

import { useState } from 'react';
import { 
  Stack, 
  Group, 
  Button, 
  Textarea, 
  Switch,
  Alert,
  CopyButton as MantineCopyButton,
  ActionIcon,
  Tooltip,
  Text,
  Divider,
  Select
} from '@mantine/core';
import { IconCopy, IconCheck, IconAlertCircle, IconCode, IconCodeDots } from '@tabler/icons-react';
import { ToolLayout } from '../../components/tools/ToolLayout';
import { JSONFormatterState, JSONError } from '../../lib/types';
import { notifications } from '@mantine/notifications';

export function JsonFormatterTool() {
  const [state, setState] = useState<JSONFormatterState>({
    input: '',
    output: '',
    isMinified: false,
    isValid: true,
    errors: [],
    viewMode: 'text'
  });

  const validateAndFormatJSON = (jsonString: string) => {
    if (!jsonString.trim()) {
      setState(prev => ({
        ...prev,
        output: '',
        isValid: true,
        errors: []
      }));
      return;
    }

    try {
      const parsed = JSON.parse(jsonString);
      const formatted = state.isMinified 
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, 2);
      
      setState(prev => ({
        ...prev,
        output: formatted,
        isValid: true,
        errors: []
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
      const match = errorMessage.match(/position (\d+)/);
      const position = match ? parseInt(match[1]) : 0;
      
      // Calculate line and column from position
      const lines = jsonString.substring(0, position).split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;

      const jsonError: JSONError = {
        line,
        column,
        message: errorMessage
      };

      setState(prev => ({
        ...prev,
        output: '',
        isValid: false,
        errors: [jsonError]
      }));
    }
  };

  const handleInputChange = (value: string) => {
    setState(prev => ({ ...prev, input: value }));
    validateAndFormatJSON(value);
  };

  const handleFormatToggle = () => {
    setState(prev => ({ ...prev, isMinified: !prev.isMinified }));
    if (state.input.trim()) {
      validateAndFormatJSON(state.input);
    }
  };

  const handleClear = () => {
    setState(prev => ({
      ...prev,
      input: '',
      output: '',
      errors: [],
      isValid: true
    }));
  };

  const handleMinify = () => {
    if (state.isValid && state.output) {
      try {
        const parsed = JSON.parse(state.output);
        const minified = JSON.stringify(parsed);
        setState(prev => ({ ...prev, output: minified, isMinified: true }));
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Unable to minify invalid JSON',
          color: 'red'
        });
      }
    }
  };

  const handleBeautify = () => {
    if (state.isValid && state.output) {
      try {
        const parsed = JSON.parse(state.output);
        const beautified = JSON.stringify(parsed, null, 2);
        setState(prev => ({ ...prev, output: beautified, isMinified: false }));
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Unable to beautify invalid JSON',
          color: 'red'
        });
      }
    }
  };

  return (
    <ToolLayout
      title="JSON Formatter"
      description="Format, validate, minify, and beautify JSON data with error detection"
      actions={
        <Group gap="sm">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          {state.isValid && state.output && (
            <>
              <Button 
                variant="outline" 
                leftSection={<IconCodeDots size={16} />}
                onClick={handleMinify}
                disabled={state.isMinified}
              >
                Minify
              </Button>
              <Button 
                variant="outline" 
                leftSection={<IconCode size={16} />}
                onClick={handleBeautify}
                disabled={!state.isMinified}
              >
                Beautify
              </Button>
            </>
          )}
        </Group>
      }
    >
      <Stack gap="lg">
        {/* Controls */}
        <Group gap="md">
          <Switch
            checked={state.isMinified}
            onChange={handleFormatToggle}
            label="Minified output"
            description="Compact JSON without whitespace"
          />
          <Select
            value={state.viewMode}
            onChange={(value) => setState(prev => ({ ...prev, viewMode: value as 'text' | 'tree' }))}
            data={[
              { value: 'text', label: 'Text View' },
              { value: 'tree', label: 'Tree View (Coming Soon)' }
            ]}
            disabled={state.viewMode !== 'text'}
            w={200}
          />
        </Group>

        {/* Error Alert */}
        {state.errors.length > 0 && (
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            <Stack gap="xs">
              {state.errors.map((error, index) => (
                <Text key={index} size="sm">
                  Line {error.line}, Column {error.column}: {error.message}
                </Text>
              ))}
            </Stack>
          </Alert>
        )}

        {/* Statistics */}
        {state.isValid && state.output && (
          <Group gap="md">
            <Text size="sm" c="dimmed">
              Characters: {state.output.length}
            </Text>
            <Divider orientation="vertical" />
            <Text size="sm" c="dimmed">
              Lines: {state.output.split('\n').length}
            </Text>
            <Divider orientation="vertical" />
            <Text size="sm" c="dimmed">
              Size: {new Blob([state.output]).size} bytes
            </Text>
            <Divider orientation="vertical" />
            <Text size="sm" c={state.isValid ? 'green' : 'red'}>
              Status: {state.isValid ? 'Valid JSON' : 'Invalid JSON'}
            </Text>
          </Group>
        )}

        {/* Input/Output Areas */}
        <Group grow align="flex-start" gap="lg">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500}>Input JSON</Text>
            </Group>
            <Textarea
              value={state.input}
              onChange={(event) => handleInputChange(event.currentTarget.value)}
              placeholder={`{
  "name": "example",
  "version": "1.0.0",
  "description": "Paste your JSON here..."
}`}
              minRows={15}
              maxRows={25}
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            />
          </Stack>

          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500}>
                Formatted JSON {state.isMinified ? '(Minified)' : '(Beautified)'}
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
                            message: 'Formatted JSON copied to clipboard',
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
              placeholder="Formatted JSON will appear here..."
              minRows={15}
              maxRows={25}
              style={{ 
                fontFamily: 'var(--font-geist-mono)',
                backgroundColor: 'var(--mantine-color-gray-0)'
              }}
            />
          </Stack>
        </Group>
      </Stack>
    </ToolLayout>
  );
}