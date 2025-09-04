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
  Card,
  TextInput,
  Switch,
  Select
} from '@mantine/core';
import { IconCopy, IconCheck, IconAlertCircle, IconCode, IconBrandTypescript } from '@tabler/icons-react';
import { ToolLayout } from '../../components/tools/ToolLayout';
import { JsonTypescriptState } from '../../lib/types';
import { notifications } from '@mantine/notifications';

export function JsonTypescriptTool() {
  const [state, setState] = useState<JsonTypescriptState>({
    input: '',
    output: '',
    isValid: true,
    error: undefined,
    options: {
      interfaceName: 'GeneratedInterface',
      arrayType: 'array',
      optionalProperties: true,
      exportInterface: true
    }
  });

  const sampleJson = `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "hobbies": ["reading", "swimming", "coding"],
  "metadata": null,
  "scores": [95, 87, 92]
}`;

  const getTypeFromValue = (value: any, key?: string): string => {
    if (value === null) return 'null';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'any[]';
      
      const firstItemType = getTypeFromValue(value[0]);
      const allSameType = value.every(item => getTypeFromValue(item) === firstItemType);
      
      if (allSameType) {
        return `${firstItemType}[]`;
      } else {
        const uniqueTypes = [...new Set(value.map(item => getTypeFromValue(item)))];
        return `(${uniqueTypes.join(' | ')})[]`;
      }
    }
    
    switch (typeof value) {
      case 'string': return 'string';
      case 'number': return 'number';
      case 'boolean': return 'boolean';
      case 'object': 
        if (value === null) return 'null';
        return generateInterfaceName(key || 'NestedObject');
      default: return 'any';
    }
  };

  const generateInterfaceName = (key: string): string => {
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    
    if (key.endsWith('s') && key.length > 1) {
      return capitalize(key.slice(0, -1));
    }
    
    return capitalize(key);
  };

  const generateInterfaces = (obj: any, interfaceName: string = state.options.interfaceName): string[] => {
    const interfaces: string[] = [];
    const nestedInterfaces: string[] = [];

    const properties: string[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      let type = getTypeFromValue(value, key);
      const optional = state.options.optionalProperties ? '?' : '';
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const nestedInterfaceName = generateInterfaceName(key);
        type = nestedInterfaceName;
        nestedInterfaces.push(...generateInterfaces(value, nestedInterfaceName));
      }
      
      properties.push(`  ${key}${optional}: ${type};`);
    }

    const exportKeyword = state.options.exportInterface ? 'export ' : '';
    const interfaceDeclaration = `${exportKeyword}interface ${interfaceName} {\n${properties.join('\n')}\n}`;
    
    interfaces.push(interfaceDeclaration);
    interfaces.push(...nestedInterfaces);
    
    return interfaces;
  };

  const convertJsonToTypeScript = (jsonStr: string): string => {
    try {
      const jsonObj = JSON.parse(jsonStr);
      const interfaces = generateInterfaces(jsonObj);
      return interfaces.join('\n\n');
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  };

  const handleInputChange = (value: string) => {
    setState(prev => ({ ...prev, input: value }));
    
    if (!value.trim()) {
      setState(prev => ({
        ...prev,
        output: '',
        isValid: true,
        error: undefined
      }));
      return;
    }

    try {
      const typescript = convertJsonToTypeScript(value);
      setState(prev => ({
        ...prev,
        output: typescript,
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

  const handleOptionChange = (key: keyof typeof state.options, value: any) => {
    setState(prev => ({
      ...prev,
      options: { ...prev.options, [key]: value }
    }));
    
    if (state.input.trim()) {
      try {
        const typescript = convertJsonToTypeScript(state.input);
        setState(prev => ({ ...prev, output: typescript }));
      } catch (error) {
        // Keep existing error state
      }
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

  const loadSample = () => {
    setState(prev => ({ ...prev, input: sampleJson }));
    handleInputChange(sampleJson);
  };

  return (
    <ToolLayout
      title="JSON → TypeScript"
      description="Generate TypeScript interfaces from JSON data"
      actions={
        <Group gap="sm">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="outline" onClick={loadSample}>
            Load Sample
          </Button>
          {state.output && (
            <MantineCopyButton value={state.output} timeout={2000}>
              {({ copied, copy }) => (
                <Button 
                  onClick={() => {
                    copy();
                    notifications.show({
                      title: 'Copied!',
                      message: 'TypeScript interfaces copied to clipboard',
                      color: 'green'
                    });
                  }}
                  leftSection={<IconBrandTypescript size={16} />}
                >
                  {copied ? 'Copied!' : 'Copy TypeScript'}
                </Button>
              )}
            </MantineCopyButton>
          )}
        </Group>
      }
    >
      <Stack gap="lg">
        {/* Configuration */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>Generation Options</Text>
            <Group grow>
              <TextInput
                label="Interface Name"
                value={state.options.interfaceName}
                onChange={(event) => handleOptionChange('interfaceName', event.currentTarget.value)}
                placeholder="GeneratedInterface"
              />
              <Select
                label="Array Type"
                value={state.options.arrayType}
                onChange={(value) => handleOptionChange('arrayType', value)}
                data={[
                  { value: 'array', label: 'Array (type[])' },
                  { value: 'tuple', label: 'Tuple ([type, type])' }
                ]}
              />
            </Group>
            <Group gap="md">
              <Switch
                checked={state.options.optionalProperties}
                onChange={(event) => handleOptionChange('optionalProperties', event.currentTarget.checked)}
                label="Optional Properties"
                description="Add ? to all properties"
              />
              <Switch
                checked={state.options.exportInterface}
                onChange={(event) => handleOptionChange('exportInterface', event.currentTarget.checked)}
                label="Export Interface"
                description="Add export keyword"
              />
            </Group>
          </Stack>
        </Card>

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
              <Text fw={500}>JSON Input</Text>
              <Group gap="xs">
                <IconCode size={16} />
                <Text size="sm" c="dimmed">JSON</Text>
              </Group>
            </Group>
            <Textarea
              value={state.input}
              onChange={(event) => handleInputChange(event.currentTarget.value)}
              placeholder="Paste your JSON here..."
              minRows={15}
              maxRows={25}
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            />
          </Stack>

          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500}>TypeScript Output</Text>
              <Group gap="xs">
                {state.output && (
                  <MantineCopyButton value={state.output} timeout={2000}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? 'Copied!' : 'Copy TypeScript'}>
                        <ActionIcon
                          color={copied ? 'teal' : 'gray'}
                          variant="subtle"
                          onClick={() => {
                            copy();
                            notifications.show({
                              title: 'Copied!',
                              message: 'TypeScript interfaces copied to clipboard',
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
                <IconBrandTypescript size={16} />
                <Text size="sm" c="dimmed">TypeScript</Text>
              </Group>
            </Group>
            <Textarea
              value={state.output}
              readOnly
              placeholder="TypeScript interfaces will appear here..."
              minRows={15}
              maxRows={25}
              style={{ 
                fontFamily: 'var(--font-geist-mono)',
                backgroundColor: 'var(--mantine-color-gray-0)'
              }}
            />
          </Stack>
        </Group>

        {/* TypeScript Reference */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>TypeScript Generation Features</Text>
            <Group gap="md">
              <Stack gap="xs">
                <Text size="sm" fw={500}>Supported Types:</Text>
                <Text size="xs">• Primitive types (string, number, boolean)</Text>
                <Text size="xs">• Arrays and tuples</Text>
                <Text size="xs">• Nested objects</Text>
                <Text size="xs">• Union types</Text>
                <Text size="xs">• Null and undefined</Text>
              </Stack>
              
              <Stack gap="xs">
                <Text size="sm" fw={500}>Features:</Text>
                <Text size="xs">• Automatic interface naming</Text>
                <Text size="xs">• Optional properties</Text>
                <Text size="xs">• Export declarations</Text>
                <Text size="xs">• Nested interface generation</Text>
                <Text size="xs">• Array type customization</Text>
              </Stack>

              <Stack gap="xs">
                <Text size="sm" fw={500}>Best Practices:</Text>
                <Text size="xs">• Use descriptive JSON keys</Text>
                <Text size="xs">• Provide representative data</Text>
                <Text size="xs">• Include all possible properties</Text>
                <Text size="xs">• Consider optional fields</Text>
              </Stack>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </ToolLayout>
  );
}