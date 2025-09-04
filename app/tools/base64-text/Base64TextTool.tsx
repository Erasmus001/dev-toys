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
  Tooltip
} from '@mantine/core';
import { IconCopy, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { ToolLayout } from '../../components/tools/ToolLayout';
import { Base64TextToolState } from '../../lib/types';
import { notifications } from '@mantine/notifications';

export function Base64TextTool() {
  const [state, setState] = useState<Base64TextToolState>({
    mode: 'encode',
    input: '',
    output: '',
    urlSafe: false,
    isValid: true,
    error: undefined
  });

  const handleModeSwitch = () => {
    setState(prev => ({
      ...prev,
      mode: prev.mode === 'encode' ? 'decode' : 'encode',
      input: prev.output,
      output: prev.input,
      error: undefined
    }));
  };

  const processText = (inputText: string) => {
    try {
      let result = '';
      
      if (state.mode === 'encode') {
        if (state.urlSafe) {
          result = btoa(inputText)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
        } else {
          result = btoa(inputText);
        }
      } else {
        let textToProcess = inputText;
        if (state.urlSafe) {
          textToProcess = inputText
            .replace(/-/g, '+')
            .replace(/_/g, '/');
          // Add padding if needed
          while (textToProcess.length % 4) {
            textToProcess += '=';
          }
        }
        result = atob(textToProcess);
      }
      
      setState(prev => ({
        ...prev,
        output: result,
        isValid: true,
        error: undefined
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        output: '',
        isValid: false,
        error: 'Invalid input for decoding'
      }));
    }
  };

  const handleInputChange = (value: string) => {
    setState(prev => ({ ...prev, input: value }));
    if (value.trim()) {
      processText(value);
    } else {
      setState(prev => ({ ...prev, output: '', error: undefined, isValid: true }));
    }
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

  return (
    <ToolLayout
      title="Base64 Text Encoder/Decoder"
      description="Encode and decode text to/from Base64 format with URL-safe options"
      actions={
        <Group gap="sm">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button onClick={handleModeSwitch}>
            Switch to {state.mode === 'encode' ? 'Decode' : 'Encode'}
          </Button>
        </Group>
      }
    >
      <Stack gap="lg">
        {/* Controls */}
        <Group gap="md">
          <Switch
            checked={state.urlSafe}
            onChange={(event) => {
              const urlSafe = event.currentTarget.checked;
              setState(prev => ({ ...prev, urlSafe }));
              if (state.input.trim()) {
                processText(state.input);
              }
            }}
            label="URL-safe encoding"
            description="Replace +/= with -_"
          />
        </Group>

        {/* Error Alert */}
        {state.error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            {state.error}
          </Alert>
        )}

        {/* Input/Output Areas */}
        <Group grow align="flex-start" gap="lg">
          <Stack gap="xs">
            <Group justify="space-between">
              <label>
                Input ({state.mode === 'encode' ? 'Plain Text' : 'Base64'})
              </label>
            </Group>
            <Textarea
              value={state.input}
              onChange={(event) => handleInputChange(event.currentTarget.value)}
              placeholder={
                state.mode === 'encode' 
                  ? 'Enter text to encode...'
                  : 'Enter Base64 to decode...'
              }
              minRows={8}
              maxRows={15}
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            />
          </Stack>

          <Stack gap="xs">
            <Group justify="space-between">
              <label>
                Output ({state.mode === 'encode' ? 'Base64' : 'Plain Text'})
              </label>
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
                            message: 'Output copied to clipboard',
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
              placeholder="Output will appear here..."
              minRows={8}
              maxRows={15}
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