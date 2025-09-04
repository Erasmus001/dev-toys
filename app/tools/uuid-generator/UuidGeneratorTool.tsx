'use client';

import { useState } from 'react';
import { 
  Stack, 
  Group, 
  Button, 
  Select,
  Alert,
  CopyButton as MantineCopyButton,
  ActionIcon,
  Tooltip,
  Text,
  Card,
  NumberInput,
  TextInput,
  List,
  Badge,
  Divider
} from '@mantine/core';
import { IconCopy, IconCheck, IconRefresh, IconInfoCircle } from '@tabler/icons-react';
import { ToolLayout } from '../../components/tools/ToolLayout';
import { UUIDGeneratorState } from '../../lib/types';
import { notifications } from '@mantine/notifications';
import { v1 as uuidv1, v4 as uuidv4, v5 as uuidv5 } from 'uuid';

export function UuidGeneratorTool() {
  const [state, setState] = useState<UUIDGeneratorState>({
    version: 4,
    generated: [],
    v5Config: {
      namespace: uuidv4(), // Use a random UUID as default namespace
      name: 'example-name'
    },
    bulkCount: 1
  });

  const generateUUID = () => {
    try {
      const uuids: string[] = [];
      
      for (let i = 0; i < state.bulkCount; i++) {
        let uuid: string;
        
        switch (state.version) {
          case 1:
            uuid = uuidv1();
            break;
          case 4:
            uuid = uuidv4();
            break;
          case 5:
            if (!state.v5Config.namespace || !state.v5Config.name) {
              notifications.show({
                title: 'Error',
                message: 'UUID v5 requires both namespace and name',
                color: 'red'
              });
              return;
            }
            uuid = uuidv5(state.v5Config.name, state.v5Config.namespace);
            break;
          default:
            uuid = uuidv4();
        }
        
        uuids.push(uuid);
      }
      
      setState(prev => ({
        ...prev,
        generated: uuids
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate UUID';
      notifications.show({
        title: 'Generation Error',
        message: errorMessage,
        color: 'red'
      });
    }
  };

  const handleClear = () => {
    setState(prev => ({
      ...prev,
      generated: []
    }));
  };

  const parseUUID = (uuid: string) => {
    try {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)) {
        return { valid: false, info: null };
      }

      const version = parseInt(uuid[14]);
      const variant = uuid[19];
      
      const info = {
        version,
        variant: ['8', '9', 'a', 'b'].includes(variant.toLowerCase()) ? 'RFC 4122' : 'Unknown',
        format: 'Standard',
        length: uuid.length,
        withoutHyphens: uuid.replace(/-/g, ''),
        uppercase: uuid.toUpperCase(),
        lowercase: uuid.toLowerCase()
      };

      return { valid: true, info };
    } catch (error) {
      return { valid: false, info: null };
    }
  };

  const versionDescriptions = {
    1: {
      name: 'Time-based',
      description: 'Generated from timestamp and MAC address. Contains identifiable information.',
      features: ['Timestamp-based', 'MAC address', 'Unique across space and time', 'Predictable']
    },
    4: {
      name: 'Random',
      description: 'Generated using random or pseudo-random numbers. Most commonly used.',
      features: ['Cryptographically secure', 'No identifiable information', 'Very low collision probability', 'Widely supported']
    },
    5: {
      name: 'Name-based (SHA-1)',
      description: 'Generated from a namespace and name using SHA-1 hash. Deterministic.',
      features: ['Deterministic', 'Based on namespace + name', 'SHA-1 hash', 'Reproducible']
    }
  };

  const commonNamespaces = [
    { label: 'DNS', value: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' },
    { label: 'URL', value: '6ba7b811-9dad-11d1-80b4-00c04fd430c8' },
    { label: 'OID', value: '6ba7b812-9dad-11d1-80b4-00c04fd430c8' },
    { label: 'X.500', value: '6ba7b814-9dad-11d1-80b4-00c04fd430c8' }
  ];

  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate UUIDs in various formats (v1, v4, v5) with bulk generation support"
      actions={
        <Group gap="sm">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button 
            leftSection={<IconRefresh size={16} />}
            onClick={generateUUID}
          >
            Generate UUID{state.bulkCount > 1 ? 's' : ''}
          </Button>
        </Group>
      }
    >
      <Stack gap="lg">
        {/* Configuration */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>UUID Configuration</Text>
            
            <Group grow>
              <Select
                label="UUID Version"
                value={state.version.toString()}
                onChange={(value) => setState(prev => ({ ...prev, version: parseInt(value!) as 1 | 4 | 5 }))}
                data={[
                  { value: '1', label: 'Version 1 (Time-based)' },
                  { value: '4', label: 'Version 4 (Random)' },
                  { value: '5', label: 'Version 5 (Name-based SHA-1)' }
                ]}
              />
              
              <NumberInput
                label="Bulk Count"
                value={state.bulkCount}
                onChange={(value) => setState(prev => ({ ...prev, bulkCount: Number(value) || 1 }))}
                min={1}
                max={100}
                step={1}
              />
            </Group>

            {/* Version 5 specific configuration */}
            {state.version === 5 && (
              <Stack gap="md">
                <Alert icon={<IconInfoCircle size={16} />} color="blue">
                  UUID v5 generates deterministic UUIDs based on a namespace and name.
                  Same inputs always produce the same UUID.
                </Alert>
                
                <Group grow>
                  <Select
                    label="Namespace (or custom)"
                    value={state.v5Config.namespace}
                    onChange={(value) => setState(prev => ({ 
                      ...prev, 
                      v5Config: { ...prev.v5Config, namespace: value! } 
                    }))}
                    data={[
                      ...commonNamespaces,
                      { label: 'Custom UUID...', value: state.v5Config.namespace }
                    ]}
                    searchable
                    allowDeselect={false}
                  />
                </Group>
                
                <TextInput
                  label="Custom Namespace UUID"
                  value={state.v5Config.namespace}
                  onChange={(event) => setState(prev => ({ 
                    ...prev, 
                    v5Config: { ...prev.v5Config, namespace: event.currentTarget.value } 
                  }))}
                  placeholder="Enter a valid UUID for namespace..."
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                />
                
                <TextInput
                  label="Name"
                  value={state.v5Config.name}
                  onChange={(event) => setState(prev => ({ 
                    ...prev, 
                    v5Config: { ...prev.v5Config, name: event.currentTarget.value } 
                  }))}
                  placeholder="Enter name to generate UUID from..."
                />
              </Stack>
            )}

            {/* Version Description */}
            <Alert color="gray">
              <Stack gap="xs">
                <Text fw={500}>{versionDescriptions[state.version].name}</Text>
                <Text size="sm">{versionDescriptions[state.version].description}</Text>
                <List size="sm">
                  {versionDescriptions[state.version].features.map((feature, index) => (
                    <List.Item key={index}>{feature}</List.Item>
                  ))}
                </List>
              </Stack>
            </Alert>
          </Stack>
        </Card>

        {/* Generated UUIDs */}
        {state.generated.length > 0 && (
          <Stack gap="md">
            <Group justify="space-between">
              <Text fw={600}>
                Generated UUID{state.generated.length > 1 ? 's' : ''} (v{state.version})
              </Text>
              <Badge color="blue">{state.generated.length} generated</Badge>
            </Group>

            <Stack gap="xs">
              {state.generated.map((uuid, index) => {
                const { valid, info } = parseUUID(uuid);
                return (
                  <Card key={index} p="sm" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                    <Group justify="space-between" align="flex-start">
                      <Stack gap="xs" flex={1}>
                        <Group gap="xs">
                          <Text 
                            style={{ fontFamily: 'var(--font-geist-mono)', wordBreak: 'break-all' }}
                            fw={500}
                          >
                            {uuid}
                          </Text>
                          <Badge size="sm" color={valid ? 'green' : 'red'}>
                            {valid ? 'Valid' : 'Invalid'}
                          </Badge>
                        </Group>
                        
                        {info && (
                          <Group gap="md">
                            <Text size="xs" c="dimmed">
                              <strong>Version:</strong> {info.version}
                            </Text>
                            <Divider orientation="vertical" />
                            <Text size="xs" c="dimmed">
                              <strong>Variant:</strong> {info.variant}
                            </Text>
                            <Divider orientation="vertical" />
                            <Text size="xs" c="dimmed">
                              <strong>Format:</strong> {info.format}
                            </Text>
                          </Group>
                        )}
                      </Stack>
                      
                      <Group gap="xs">
                        <MantineCopyButton value={uuid} timeout={2000}>
                          {({ copied, copy }) => (
                            <Tooltip label={copied ? 'Copied!' : 'Copy UUID'}>
                              <ActionIcon
                                color={copied ? 'teal' : 'gray'}
                                variant="subtle"
                                onClick={() => {
                                  copy();
                                  notifications.show({
                                    title: 'Copied!',
                                    message: 'UUID copied to clipboard',
                                    color: 'green'
                                  });
                                }}
                              >
                                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </MantineCopyButton>
                        
                        {info && (
                          <MantineCopyButton value={info.withoutHyphens} timeout={2000}>
                            {({ copied, copy }) => (
                              <Tooltip label={copied ? 'Copied without hyphens!' : 'Copy without hyphens'}>
                                <ActionIcon
                                  color={copied ? 'teal' : 'gray'}
                                  variant="subtle"
                                  onClick={copy}
                                >
                                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                </ActionIcon>
                              </Tooltip>
                            )}
                          </MantineCopyButton>
                        )}
                      </Group>
                    </Group>
                  </Card>
                );
              })}
            </Stack>

            {/* Bulk Copy Options */}
            {state.generated.length > 1 && (
              <Card>
                <Stack gap="md">
                  <Text fw={500}>Bulk Copy Options</Text>
                  <Group gap="sm">
                    <MantineCopyButton value={state.generated.join('\\n')} timeout={2000}>
                      {({ copied, copy }) => (
                        <Button 
                          variant="outline" 
                          size="sm"
                          leftSection={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                          color={copied ? 'teal' : 'gray'}
                          onClick={copy}
                        >
                          {copied ? 'Copied!' : 'Copy All (Line-separated)'}
                        </Button>
                      )}
                    </MantineCopyButton>
                    
                    <MantineCopyButton value={JSON.stringify(state.generated, null, 2)} timeout={2000}>
                      {({ copied, copy }) => (
                        <Button 
                          variant="outline" 
                          size="sm"
                          leftSection={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                          color={copied ? 'teal' : 'gray'}
                          onClick={copy}
                        >
                          {copied ? 'Copied!' : 'Copy as JSON Array'}
                        </Button>
                      )}
                    </MantineCopyButton>
                    
                    <MantineCopyButton value={state.generated.join(', ')} timeout={2000}>
                      {({ copied, copy }) => (
                        <Button 
                          variant="outline" 
                          size="sm"
                          leftSection={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                          color={copied ? 'teal' : 'gray'}
                          onClick={copy}
                        >
                          {copied ? 'Copied!' : 'Copy Comma-separated'}
                        </Button>
                      )}
                    </MantineCopyButton>
                  </Group>
                </Stack>
              </Card>
            )}
          </Stack>
        )}

        {/* UUID Information */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>About UUIDs</Text>
            <Text size="sm" c="dimmed">
              Universally Unique Identifiers (UUIDs) are 128-bit values used to uniquely identify information. 
              They are represented as 32 hexadecimal digits displayed in groups separated by hyphens: 
              8-4-4-4-12 for a total of 36 characters.
            </Text>
            
            <Group gap="md">
              <Text size="sm" c="dimmed">
                <strong>Format:</strong> xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
              </Text>
            </Group>
            
            <Text size="sm" c="dimmed">
              Where M indicates the version (1, 4, or 5) and N indicates the variant (typically 8, 9, A, or B).
            </Text>
          </Stack>
        </Card>
      </Stack>
    </ToolLayout>
  );
}