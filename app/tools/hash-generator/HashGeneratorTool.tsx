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
  Switch,
  Badge,
  FileButton
} from '@mantine/core';
import { IconCopy, IconCheck, IconUpload, IconFile } from '@tabler/icons-react';
import { ToolLayout } from '../../components/tools/ToolLayout';
import { notifications } from '@mantine/notifications';
import CryptoJS from 'crypto-js';

type HashAlgorithm = 'MD5' | 'SHA1' | 'SHA256' | 'SHA512' | 'SHA3';

interface HashGeneratorState {
  input: string;
  inputType: 'text' | 'file';
  algorithm: HashAlgorithm;
  results: Record<HashAlgorithm, string>;
  generateAll: boolean;
  file: File | null;
}

export function HashGeneratorTool() {
  const [state, setState] = useState<HashGeneratorState>({
    input: '',
    inputType: 'text',
    algorithm: 'SHA256',
    results: {
      MD5: '',
      SHA1: '',
      SHA256: '',
      SHA512: '',
      SHA3: ''
    },
    generateAll: true,
    file: null
  });

  const algorithmDescriptions = {
    MD5: {
      name: 'MD5',
      description: 'Message-Digest Algorithm 5 (128-bit hash)',
      security: 'Deprecated - Not cryptographically secure',
      color: 'red'
    },
    SHA1: {
      name: 'SHA-1',
      description: 'Secure Hash Algorithm 1 (160-bit hash)',
      security: 'Deprecated - Vulnerable to attacks',
      color: 'orange'
    },
    SHA256: {
      name: 'SHA-256',
      description: 'Secure Hash Algorithm 256-bit (part of SHA-2)',
      security: 'Cryptographically secure',
      color: 'green'
    },
    SHA512: {
      name: 'SHA-512',
      description: 'Secure Hash Algorithm 512-bit (part of SHA-2)',
      security: 'Cryptographically secure',
      color: 'green'
    },
    SHA3: {
      name: 'SHA-3',
      description: 'Secure Hash Algorithm 3 (Keccak)',
      security: 'Latest standard - Highly secure',
      color: 'blue'
    }
  };

  const generateHash = (input: string, algorithm: HashAlgorithm): string => {
    try {
      switch (algorithm) {
        case 'MD5':
          return CryptoJS.MD5(input).toString();
        case 'SHA1':
          return CryptoJS.SHA1(input).toString();
        case 'SHA256':
          return CryptoJS.SHA256(input).toString();
        case 'SHA512':
          return CryptoJS.SHA512(input).toString();
        case 'SHA3':
          return CryptoJS.SHA3(input).toString();
        default:
          return '';
      }
    } catch (error) {
      return '';
    }
  };

  const processInput = async (inputText: string) => {
    if (!inputText) {
      setState(prev => ({
        ...prev,
        results: {
          MD5: '',
          SHA1: '',
          SHA256: '',
          SHA512: '',
          SHA3: ''
        }
      }));
      return;
    }

    const newResults: Record<HashAlgorithm, string> = {
      MD5: '',
      SHA1: '',
      SHA256: '',
      SHA512: '',
      SHA3: ''
    };

    if (state.generateAll) {
      // Generate all hashes
      Object.keys(newResults).forEach(algo => {
        newResults[algo as HashAlgorithm] = generateHash(inputText, algo as HashAlgorithm);
      });
    } else {
      // Generate only selected algorithm
      newResults[state.algorithm] = generateHash(inputText, state.algorithm);
    }

    setState(prev => ({
      ...prev,
      results: newResults
    }));
  };

  const handleInputChange = (value: string) => {
    setState(prev => ({ ...prev, input: value }));
    processInput(value);
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file) {
      setState(prev => ({ ...prev, file: null }));
      return;
    }

    setState(prev => ({ ...prev, file }));

    try {
      const text = await file.text();
      setState(prev => ({ ...prev, input: text }));
      processInput(text);
    } catch (error) {
      notifications.show({
        title: 'File Error',
        message: 'Failed to read file content',
        color: 'red'
      });
    }
  };

  const handleClear = () => {
    setState(prev => ({
      ...prev,
      input: '',
      file: null,
      results: {
        MD5: '',
        SHA1: '',
        SHA256: '',
        SHA512: '',
        SHA3: ''
      }
    }));
  };

  const compareHashes = (hash1: string, hash2: string): boolean => {
    return hash1.toLowerCase() === hash2.toLowerCase();
  };

  return (
    <ToolLayout
      title="Hash Generator"
      description="Generate MD5, SHA1, SHA256, SHA512, and SHA3 hashes from text or files"
      actions={
        <Group gap="sm">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <FileButton onChange={handleFileUpload} accept="text/*">
            {(props) => (
              <Button {...props} leftSection={<IconUpload size={16} />} variant="outline">
                Upload File
              </Button>
            )}
          </FileButton>
        </Group>
      }
    >
      <Stack gap="lg">
        {/* Configuration */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>Hash Configuration</Text>
            
            <Group gap="md">
              <Select
                label="Input Type"
                value={state.inputType}
                onChange={(value) => setState(prev => ({ ...prev, inputType: value as 'text' | 'file' }))}
                data={[
                  { value: 'text', label: 'Text Input' },
                  { value: 'file', label: 'File Upload' }
                ]}
                w={150}
              />
              
              {!state.generateAll && (
                <Select
                  label="Hash Algorithm"
                  value={state.algorithm}
                  onChange={(value) => setState(prev => ({ ...prev, algorithm: value as HashAlgorithm }))}
                  data={[
                    { value: 'MD5', label: 'MD5' },
                    { value: 'SHA1', label: 'SHA-1' },
                    { value: 'SHA256', label: 'SHA-256' },
                    { value: 'SHA512', label: 'SHA-512' },
                    { value: 'SHA3', label: 'SHA-3' }
                  ]}
                  w={150}
                />
              )}

              <Switch
                checked={state.generateAll}
                onChange={(event) => {
                  const checked = event?.currentTarget?.checked ?? !state.generateAll;
                  setState(prev => ({ ...prev, generateAll: checked }));
                }}
                label="Generate all hashes"
                description="Generate all algorithms at once"
              />
            </Group>
          </Stack>
        </Card>

        {/* File Info */}
        {state.file && (
          <Alert>
            <Group gap="sm">
              <IconFile size={16} />
              <Text size="sm">
                <strong>File:</strong> {state.file.name} ({(state.file.size / 1024).toFixed(2)} KB)
              </Text>
            </Group>
          </Alert>
        )}

        {/* Input Area */}
        <Stack gap="xs">
          <Text fw={500}>Input Text</Text>
          <Textarea
            value={state.input}
            onChange={(event) => handleInputChange(event.currentTarget.value)}
            placeholder="Enter text to hash..."
            minRows={6}
            maxRows={12}
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          />
        </Stack>

        {/* Hash Results */}
        {Object.values(state.results).some(hash => hash) && (
          <Stack gap="md">
            <Text fw={600}>Hash Results</Text>
            
            {Object.entries(state.results).map(([algorithm, hash]) => {
              if (!hash && state.generateAll) return null;
              if (!hash && algorithm !== state.algorithm) return null;
              
              const info = algorithmDescriptions[algorithm as HashAlgorithm];
              
              return (
                <Card key={algorithm} p="md">
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Group gap="sm">
                        <Text fw={600}>{info.name}</Text>
                        <Badge color={info.color}>{info.security}</Badge>
                      </Group>
                      
                      {hash && (
                        <MantineCopyButton value={hash} timeout={2000}>
                          {({ copied, copy }) => (
                            <Tooltip label={copied ? 'Copied!' : 'Copy hash'}>
                              <ActionIcon
                                color={copied ? 'teal' : 'gray'}
                                variant="subtle"
                                onClick={() => {
                                  copy();
                                  notifications.show({
                                    title: 'Copied!',
                                    message: `${algorithm} hash copied to clipboard`,
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
                    
                    <Text size="sm" c="dimmed">{info.description}</Text>
                    
                    {hash && (
                      <Text 
                        style={{ 
                          fontFamily: 'var(--font-geist-mono)',
                          wordBreak: 'break-all',
                          backgroundColor: 'var(--mantine-color-gray-0)',
                          padding: '8px',
                          borderRadius: '4px'
                        }}
                        size="sm"
                      >
                        {hash}
                      </Text>
                    )}
                    
                    {hash && (
                      <Group gap="md">
                        <Text size="xs" c="dimmed">
                          <strong>Length:</strong> {hash.length} characters
                        </Text>
                        <Text size="xs" c="dimmed">
                          <strong>Bits:</strong> {hash.length * 4} bits
                        </Text>
                      </Group>
                    )}
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        )}

        {/* Algorithm Information */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>Hash Algorithm Information</Text>
            
            <Stack gap="sm">
              {Object.entries(algorithmDescriptions).map(([algo, info]) => (
                <Group key={algo} justify="space-between" p="xs">
                  <Group gap="sm">
                    <Text fw={500}>{info.name}</Text>
                    <Badge size="sm" color={info.color}>{info.security}</Badge>
                  </Group>
                  <Text size="sm" c="dimmed">{info.description}</Text>
                </Group>
              ))}
            </Stack>
            
            <Alert color="yellow">
              <Text size="sm">
                <strong>Security Notice:</strong> MD5 and SHA-1 are deprecated and should not be used for security purposes. 
                Use SHA-256, SHA-512, or SHA-3 for cryptographic applications.
              </Text>
            </Alert>
          </Stack>
        </Card>

        {/* Hash Comparison (if multiple hashes are generated) */}
        {state.generateAll && Object.values(state.results).filter(h => h).length > 1 && (
          <Card>
            <Stack gap="md">
              <Text fw={600}>Hash Comparison</Text>
              <Text size="sm" c="dimmed">
                Different algorithms produce different hash lengths and security levels. 
                For the same input, each algorithm will always produce the same hash.
              </Text>
              
              <Group gap="md">
                {Object.entries(state.results).filter(([, hash]) => hash).map(([algo, hash]) => (
                  <Badge key={algo} size="lg">
                    {algo}: {hash.length} chars
                  </Badge>
                ))}
              </Group>
            </Stack>
          </Card>
        )}
      </Stack>
    </ToolLayout>
  );
}