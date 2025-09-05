'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Stack, 
  Group, 
  Button, 
  Textarea, 
  NumberInput,
  Select,
  Switch,
  Alert,
  CopyButton as MantineCopyButton,
  ActionIcon,
  Tooltip,
  Text,
  Divider,
  FileButton,
  Card,
  Badge,
  LoadingOverlay,
  Anchor,
  Code
} from '@mantine/core';
import { 
  IconCopy, 
  IconCheck, 
  IconAlertCircle, 
  IconFileUpload, 
  IconDownload,
  IconRefresh,
  IconCode,
  IconApi,
  IconSettings
} from '@tabler/icons-react';
import { Dropzone } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { ToolLayout } from '../../components/tools/ToolLayout';
import { MockApiGeneratorState, MockApiOptions, MockApiResponse } from '../../lib/types';

// Import json-schema-faker and faker
let jsf: any;
let faker: any;

// Dynamic imports to handle potential module resolution issues
const initializeLibraries = async () => {
  try {
    const jsfModule = await import('json-schema-faker');
    const fakerModule = await import('@faker-js/faker');
    
    jsf = jsfModule.default || jsfModule;
    faker = fakerModule.faker;
    
    // Configure jsf with faker
    if (jsf && faker) {
      jsf.extend('faker', () => faker);
    }
  } catch (error) {
    console.error('Failed to load libraries:', error);
    // Fallback implementation
    jsf = {
      resolve: async (schema: any) => generateFallbackData(schema)
    };
    faker = {
      setLocale: () => {},
      seed: () => {},
      person: { fullName: () => 'John Doe' },
      internet: { email: () => 'john.doe@example.com' },
      location: { 
        streetAddress: () => '123 Main St',
        city: () => 'New York',
        country: () => 'USA'
      },
      commerce: {
        productName: () => 'Sample Product',
        productDescription: () => 'A sample product description',
        price: () => '99.99',
        department: () => 'Electronics'
      },
      lorem: {
        sentence: () => 'Lorem ipsum dolor sit amet',
        word: () => 'lorem'
      },
      date: {
        future: () => new Date().toISOString().split('T')[0]
      },
      string: {
        uuid: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        })
      },
      image: {
        avatar: () => 'https://via.placeholder.com/150'
      }
    };
  }
};

// Simple fallback data generation
function generateFallbackData(schema: any): any {
  if (!schema || typeof schema !== 'object') {
    return null;
  }

  if (schema.type === 'object' && schema.properties) {
    const result: any = {};
    for (const [key, prop] of Object.entries(schema.properties as any)) {
      result[key] = generateFallbackData(prop);
    }
    return result;
  }

  if (schema.type === 'array') {
    const length = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length }, () => generateFallbackData(schema.items));
  }

  if (schema.faker && faker && (faker as any)[schema.faker.split('.')[0]]) {
    const parts = schema.faker.split('.');
    let fn = faker as any;
    for (const part of parts) {
      fn = fn[part];
    }
    return typeof fn === 'function' ? fn() : fn;
  }

  // Basic type generation
  switch (schema.type) {
    case 'string':
      if (schema.format === 'email') return 'example@email.com';
      if (schema.format === 'date') return new Date().toISOString().split('T')[0];
      return 'Sample String';
    case 'integer':
    case 'number':
      const min = schema.minimum || 1;
      const max = schema.maximum || 100;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    case 'boolean':
      return Math.random() > 0.5;
    default:
      if (schema.enum) {
        return schema.enum[Math.floor(Math.random() * schema.enum.length)];
      }
      return null;
  }
}

export function MockApiGeneratorTool() {
  const [state, setState] = useState<MockApiGeneratorState>({
    schema: '',
    output: '',
    isValid: true,
    options: {
      recordCount: 5,
      statusCode: 200,
      useFaker: true,
      includeResponseWrapper: true,
      locale: 'en'
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [librariesLoaded, setLibrariesLoaded] = useState(false);

  // Initialize libraries
  useEffect(() => {
    initializeLibraries().then(() => {
      setLibrariesLoaded(true);
    });
  }, []);

  // Initialize json-schema-faker with faker.js
  useEffect(() => {
    if (librariesLoaded && state.options.useFaker && jsf && faker) {
      jsf.extend('faker', () => faker);
    }
  }, [state.options.useFaker, librariesLoaded]);

  // Example schemas for user guidance
  const exampleSchemas = {
    user: {
      name: 'User Profile',
      schema: `{
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "minimum": 1
    },
    "name": {
      "type": "string",
      "faker": "person.fullName"
    },
    "email": {
      "type": "string",
      "format": "email",
      "faker": "internet.email"
    },
    "age": {
      "type": "integer",
      "minimum": 18,
      "maximum": 80
    },
    "avatar": {
      "type": "string",
      "faker": "image.avatar"
    },
    "address": {
      "type": "object",
      "properties": {
        "street": {
          "type": "string",
          "faker": "location.streetAddress"
        },
        "city": {
          "type": "string",
          "faker": "location.city"
        },
        "country": {
          "type": "string",
          "faker": "location.country"
        }
      }
    }
  },
  "required": ["id", "name", "email"]
}`
    },
    product: {
      name: 'Product Catalog',
      schema: `{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "faker": "string.uuid"
    },
    "name": {
      "type": "string",
      "faker": "commerce.productName"
    },
    "description": {
      "type": "string",
      "faker": "commerce.productDescription"
    },
    "price": {
      "type": "number",
      "minimum": 1,
      "maximum": 1000,
      "faker": "commerce.price"
    },
    "category": {
      "type": "string",
      "faker": "commerce.department"
    },
    "inStock": {
      "type": "boolean"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string",
        "faker": "lorem.word"
      },
      "minItems": 1,
      "maxItems": 5
    }
  },
  "required": ["id", "name", "price"]
}`
    },
    todo: {
      name: 'Todo Item',
      schema: `{
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "minimum": 1
    },
    "title": {
      "type": "string",
      "faker": "lorem.sentence"
    },
    "completed": {
      "type": "boolean"
    },
    "priority": {
      "type": "string",
      "enum": ["low", "medium", "high"]
    },
    "dueDate": {
      "type": "string",
      "format": "date",
      "faker": "date.future"
    },
    "userId": {
      "type": "integer",
      "minimum": 1,
      "maximum": 100
    }
  },
  "required": ["id", "title", "completed"]
}`
    }
  };

  const generateMockData = useCallback(async () => {
    if (!state.schema.trim() || !librariesLoaded || !jsf) {
      setState(prev => ({
        ...prev,
        output: '',
        isValid: true,
        error: undefined
      }));
      return;
    }

    setIsGenerating(true);
    
    try {
      const startTime = Date.now();
      
      // Parse the schema
      const schema = JSON.parse(state.schema);
      
      // Configure faker locale if available
      if (faker && faker.setLocale) {
        faker.setLocale(state.options.locale);
      }
      
      // Set seed for reproducible results if provided
      if (state.options.seed && faker && faker.seed) {
        faker.seed(state.options.seed);
      }
      
      // Generate data
      const data = [];
      for (let i = 0; i < state.options.recordCount; i++) {
        const generated = await jsf.resolve(schema);
        data.push(generated);
      }
      
      const generationTime = Date.now() - startTime;
      
      // Create response based on options
      let output;
      if (state.options.includeResponseWrapper) {
        const response: MockApiResponse = {
          status: state.options.statusCode,
          statusText: getStatusText(state.options.statusCode),
          data: state.options.recordCount === 1 ? data[0] : data,
          metadata: {
            count: data.length,
            generatedAt: new Date().toISOString(),
            schema: schema
          }
        };
        output = JSON.stringify(response, null, 2);
      } else {
        output = JSON.stringify(state.options.recordCount === 1 ? data[0] : data, null, 2);
      }
      
      setState(prev => ({
        ...prev,
        output,
        isValid: true,
        error: undefined,
        metadata: {
          recordCount: data.length,
          size: formatBytes(new Blob([output]).size),
          generationTime
        }
      }));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON schema';
      setState(prev => ({
        ...prev,
        output: '',
        isValid: false,
        error: errorMessage
      }));
    } finally {
      setIsGenerating(false);
    }
  }, [state.schema, state.options, librariesLoaded]);

  // Debounced generation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.schema.trim()) {
        generateMockData();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [state.schema, generateMockData]);

  const handleSchemaChange = (value: string) => {
    setState(prev => ({ ...prev, schema: value }));
  };

  const handleOptionsChange = (updates: Partial<MockApiOptions>) => {
    setState(prev => ({
      ...prev,
      options: { ...prev.options, ...updates }
    }));
  };

  const handleFileUpload = (file: File | null) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setState(prev => ({ ...prev, schema: content }));
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    if (!state.output) return;
    
    const blob = new Blob([state.output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mock-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    notifications.show({
      title: 'Success',
      message: 'Mock data exported successfully',
      color: 'green'
    });
  };

  const handleClear = () => {
    setState(prev => ({
      ...prev,
      schema: '',
      output: '',
      error: undefined,
      isValid: true,
      metadata: undefined
    }));
  };

  const loadExample = (example: keyof typeof exampleSchemas) => {
    setState(prev => ({
      ...prev,
      schema: exampleSchemas[example].schema.trim()
    }));
  };

  const statusCodes = [
    { value: '200', label: '200 OK' },
    { value: '201', label: '201 Created' },
    { value: '400', label: '400 Bad Request' },
    { value: '401', label: '401 Unauthorized' },
    { value: '403', label: '403 Forbidden' },
    { value: '404', label: '404 Not Found' },
    { value: '500', label: '500 Internal Server Error' }
  ];

  const locales = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'zh', label: 'Chinese' }
  ];

  return (
    <ToolLayout
      title="Mock API Generator"
      description="Generate realistic mock API responses from JSON schemas using Faker.js"
      actions={
        <Group gap="sm">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button 
            variant="outline" 
            leftSection={<IconRefresh size={16} />}
            onClick={generateMockData}
            loading={isGenerating}
            disabled={!librariesLoaded}
          >
            Generate
          </Button>
          {state.output && (
            <Button 
              variant="outline" 
              leftSection={<IconDownload size={16} />}
              onClick={handleExport}
            >
              Export
            </Button>
          )}
        </Group>
      }
    >
      <Stack gap="lg">
        {/* Example Templates */}
        <Card withBorder>
          <Stack gap="sm">
            <Group align="center" gap="sm">
              <IconCode size={16} />
              <Text fw={500}>Example Schemas</Text>
            </Group>
            <Group gap="sm">
              {Object.entries(exampleSchemas).map(([key, example]) => (
                <Button
                  key={key}
                  variant="light"
                  size="xs"
                  onClick={() => loadExample(key as keyof typeof exampleSchemas)}
                >
                  {example.name}
                </Button>
              ))}
            </Group>
          </Stack>
        </Card>

        {/* Configuration Options */}
        <Card withBorder>
          <Stack gap="md">
            <Group align="center" gap="sm">
              <IconSettings size={16} />
              <Text fw={500}>Generation Options</Text>
            </Group>
            
            <Group grow>
              <NumberInput
                label="Number of Records"
                description="How many records to generate (1-100)"
                value={state.options.recordCount}
                onChange={(value) => handleOptionsChange({ recordCount: Number(value) || 1 })}
                min={1}
                max={100}
              />
              
              <Select
                label="Status Code"
                description="HTTP status code for response"
                value={state.options.statusCode.toString()}
                onChange={(value) => handleOptionsChange({ statusCode: Number(value) || 200 })}
                data={statusCodes}
              />
              
              <Select
                label="Data Locale"
                description="Language for generated data"
                value={state.options.locale}
                onChange={(value) => handleOptionsChange({ locale: value || 'en' })}
                data={locales}
              />
            </Group>
            
            <Group>
              <Switch
                checked={state.options.useFaker}
                onChange={(event) => handleOptionsChange({ useFaker: event.currentTarget.checked })}
                label="Use Faker.js"
                description="Generate realistic fake data using Faker.js"
              />
              
              <Switch
                checked={state.options.includeResponseWrapper}
                onChange={(event) => handleOptionsChange({ includeResponseWrapper: event.currentTarget.checked })}
                label="Include Response Wrapper"
                description="Wrap data in API response format"
              />
            </Group>
          </Stack>
        </Card>

        {/* Error Alert */}
        {!librariesLoaded && (
          <Alert icon={<IconAlertCircle size={16} />} color="blue">
            <Text size="sm">Loading JSON Schema Faker and Faker.js libraries...</Text>
          </Alert>
        )}
        
        {!state.isValid && state.error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            <Text size="sm">{state.error}</Text>
          </Alert>
        )}

        {/* Statistics */}
        {state.metadata && (
          <Group gap="md">
            <Text size="sm" c="dimmed">
              Records: {state.metadata.recordCount}
            </Text>
            <Divider orientation="vertical" />
            <Text size="sm" c="dimmed">
              Size: {state.metadata.size}
            </Text>
            <Divider orientation="vertical" />
            <Text size="sm" c="dimmed">
              Generated in: {state.metadata.generationTime}ms
            </Text>
            <Divider orientation="vertical" />
            <Text size="sm" c={state.isValid ? 'green' : 'red'}>
              Status: {state.isValid ? 'Valid Schema' : 'Invalid Schema'}
            </Text>
          </Group>
        )}

        {/* Input/Output Areas */}
        <Group grow align="flex-start" gap="lg">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500}>JSON Schema</Text>
              <Group gap="xs">
                <FileButton onChange={handleFileUpload} accept=".json,.txt">
                  {(props) => (
                    <Tooltip label="Upload schema file">
                      <ActionIcon variant="subtle" {...props}>
                        <IconFileUpload size={16} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </FileButton>
              </Group>
            </Group>
            
            <Dropzone
              onDrop={(files) => files[0] && handleFileUpload(files[0])}
              accept={['application/json', 'text/plain']}
              maxFiles={1}
              style={{ minHeight: 300 }}
            >
              <Textarea
                value={state.schema}
                onChange={(event) => handleSchemaChange(event.currentTarget.value)}
                placeholder={`{
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "minimum": 1
    },
    "name": {
      "type": "string",
      "faker": "person.fullName"
    },
    "email": {
      "type": "string",
      "format": "email"
    }
  },
  "required": ["id", "name", "email"]
}`}
                minRows={15}
                maxRows={25}
                style={{ 
                  fontFamily: 'var(--font-geist-mono)',
                  border: 'none',
                  backgroundColor: 'transparent'
                }}
              />
            </Dropzone>
          </Stack>

          <Stack gap="xs" pos="relative">
            <LoadingOverlay visible={isGenerating} />
            <Group justify="space-between" align="center">
              <Group align="center" gap="xs">
                <Text fw={500}>Generated Mock Data</Text>
                {state.options.includeResponseWrapper && (
                  <Badge size="xs" variant="light">
                    API Response
                  </Badge>
                )}
              </Group>
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
                            message: 'Mock data copied to clipboard',
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
              placeholder="Generated mock data will appear here..."
              minRows={15}
              maxRows={25}
              style={{ 
                fontFamily: 'var(--font-geist-mono)',
                backgroundColor: 'var(--mantine-color-gray-0)'
              }}
            />
          </Stack>
        </Group>

        {/* Help Section */}
        <Card withBorder>
          <Stack gap="sm">
            <Text fw={500}>JSON Schema Guide</Text>
            <Text size="sm" c="dimmed">
              Use standard JSON Schema syntax with optional Faker.js extensions:
            </Text>
            <Group gap="lg">
              <Stack gap="xs">
                <Code block>
{`"name": {
  "type": "string",
  "faker": "person.fullName"
}`}
                </Code>
                <Text size="xs" c="dimmed">Faker.js integration</Text>
              </Stack>
              
              <Stack gap="xs">
                <Code block>
{`"age": {
  "type": "integer",
  "minimum": 18,
  "maximum": 65
}`}
                </Code>
                <Text size="xs" c="dimmed">Standard JSON Schema</Text>
              </Stack>
            </Group>
            
            <Text size="sm" c="dimmed">
              Learn more: {' '}
              <Anchor href="https://json-schema.org/" target="_blank" rel="noopener">
                JSON Schema Docs
              </Anchor>
              {' '} | {' '}
              <Anchor href="https://fakerjs.dev/" target="_blank" rel="noopener">
                Faker.js API
              </Anchor>
            </Text>
          </Stack>
        </Card>
      </Stack>
    </ToolLayout>
  );
}

// Helper functions
function getStatusText(code: number): string {
  const statusTexts: Record<number, string> = {
    200: 'OK',
    201: 'Created',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error'
  };
  return statusTexts[code] || 'Unknown';
}

function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}