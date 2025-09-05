'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Stack,
  Grid,
  Textarea,
  Button,
  Group,
  Select,
  Switch,
  Card,
  Text,
  Alert,
  Badge,
  Divider,
  FileButton,
  ActionIcon,
  Tooltip,
  Tabs,
  ScrollArea,
  Paper
} from '@mantine/core';
import {
  IconCopy,
  IconCheck,
  IconRefresh,
  IconDownload,
  IconFileUpload,
  IconSwitch,
  IconInfoCircle,
  IconFileTypeCsv,
  IconBraces,
  IconSettings
} from '@tabler/icons-react';
import { ToolLayout } from '../../components/tools/ToolLayout';
import { JsonCsvState, JsonCsvOptions } from '../../lib/types';
import { notifications } from '@mantine/notifications';
import Papa from 'papaparse';

export function JsonCsvTool() {
  const [state, setState] = useState<JsonCsvState>({
    mode: 'json-to-csv',
    input: '',
    output: '',
    options: {
      delimiter: ',',
      includeHeaders: true,
      skipEmptyLines: true,
      trimWhitespace: true,
      encoding: 'utf-8',
      flattenArrays: false,
      arrayDelimiter: '; '
    },
    isValid: true,
    error: undefined,
    metadata: undefined
  });

  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<() => void>(null);

  // Sample data for demonstration
  const sampleJsonData = JSON.stringify([
    { id: 1, name: "John Doe", email: "john@example.com", age: 30, active: true },
    { id: 2, name: "Jane Smith", email: "jane@example.com", age: 25, active: false },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", age: 35, active: true }
  ], null, 2);

  const sampleCsvData = `id,name,email,age,active
1,John Doe,john@example.com,30,true
2,Jane Smith,jane@example.com,25,false
3,Bob Johnson,bob@example.com,35,true`;

  // Convert JSON to CSV
  const convertJsonToCsv = (jsonString: string): { success: boolean; data?: string; error?: string; metadata?: any } => {
    try {
      const parsed = JSON.parse(jsonString);
      
      if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array of objects for CSV conversion');
      }

      if (parsed.length === 0) {
        return { success: true, data: '', metadata: { rows: 0, columns: 0, size: '0 B' } };
      }

      // Flatten arrays if option is enabled
      const processedData = state.options.flattenArrays
        ? parsed.map(item => flattenObject(item))
        : parsed;

      const csv = Papa.unparse(processedData, {
        delimiter: state.options.delimiter,
        header: state.options.includeHeaders,
        skipEmptyLines: state.options.skipEmptyLines,
        quotes: true,
      });

      const rows = csv.split('\n').length;
      const columns = processedData.length > 0 ? Object.keys(processedData[0]).length : 0;
      const size = formatFileSize(new Blob([csv]).size);

      return {
        success: true,
        data: csv,
        metadata: { rows, columns, size }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Invalid JSON format'
      };
    }
  };

  // Convert CSV to JSON
  const convertCsvToJson = async (csvString: string): Promise<{ success: boolean; data?: string; error?: string; metadata?: any }> => {
    return new Promise((resolve) => {
      Papa.parse(csvString, {
        header: state.options.includeHeaders,
        delimiter: state.options.delimiter,
        skipEmptyLines: state.options.skipEmptyLines,
        complete: (results: any) => {
          try {
            if (results.errors.length > 0) {
              const errorMessages = results.errors.map((err: any) => 
                `Row ${err.row + 1}: ${err.message}`
              ).join('; ');
              
              resolve({
                success: false,
                error: `CSV parsing errors: ${errorMessages}`
              });
              return;
            }

            const jsonString = JSON.stringify(results.data, null, 2);
            const rows = results.data.length;
            const columns = results.meta.fields?.length || 0;
            const size = formatFileSize(new Blob([jsonString]).size);

            resolve({
              success: true,
              data: jsonString,
              metadata: { rows, columns, size }
            });
          } catch (error: any) {
            resolve({
              success: false,
              error: error.message || 'Failed to convert CSV to JSON'
            });
          }
        },
        error: (error: any) => {
          resolve({
            success: false,
            error: error.message || 'Failed to parse CSV'
          });
        }
      });
    });
  };

  // Flatten nested objects for CSV conversion
  const flattenObject = (obj: any, prefix = ''): any => {
    const flattened: any = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          Object.assign(flattened, flattenObject(value, newKey));
        } else if (Array.isArray(value)) {
          flattened[newKey] = value.join(state.options.arrayDelimiter);
        } else {
          flattened[newKey] = value;
        }
      }
    }
    
    return flattened;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Perform conversion
  const performConversion = async () => {
    if (!state.input.trim()) {
      setState(prev => ({
        ...prev,
        output: '',
        isValid: true,
        error: undefined,
        metadata: undefined
      }));
      return;
    }

    let result;
    if (state.mode === 'json-to-csv') {
      result = convertJsonToCsv(state.input);
    } else {
      result = await convertCsvToJson(state.input);
    }

    setState(prev => ({
      ...prev,
      output: result.success ? result.data || '' : '',
      isValid: result.success,
      error: result.error,
      metadata: result.metadata
    }));
  };

  // Handle mode switch
  const handleModeSwitch = () => {
    setState(prev => ({
      ...prev,
      mode: prev.mode === 'json-to-csv' ? 'csv-to-json' : 'json-to-csv',
      input: '',
      output: '',
      isValid: true,
      error: undefined,
      metadata: undefined
    }));
  };

  // Load sample data
  const loadSample = () => {
    const sampleData = state.mode === 'json-to-csv' ? sampleJsonData : sampleCsvData;
    setState(prev => ({ ...prev, input: sampleData }));
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!state.output) return;
    
    try {
      await navigator.clipboard.writeText(state.output);
      setCopied(true);
      notifications.show({
        title: 'Success',
        message: 'Copied to clipboard!',
        color: 'green'
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to copy to clipboard',
        color: 'red'
      });
    }
  };

  // Download result
  const downloadResult = () => {
    if (!state.output) return;
    
    const extension = state.mode === 'json-to-csv' ? 'csv' : 'json';
    const mimeType = state.mode === 'json-to-csv' ? 'text/csv' : 'application/json';
    const filename = `converted-data.${extension}`;
    
    const blob = new Blob([state.output], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    notifications.show({
      title: 'Success',
      message: `File downloaded as ${filename}`,
      color: 'green'
    });
  };

  // Handle file upload
  const handleFileUpload = (file: File | null) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setState(prev => ({ ...prev, input: content }));
    };
    reader.readAsText(file);
  };

  // Clear input and output
  const clearAll = () => {
    setState(prev => ({
      ...prev,
      input: '',
      output: '',
      isValid: true,
      error: undefined,
      metadata: undefined
    }));
  };

  // Trigger conversion when input or options change
  useEffect(() => {
    const timer = setTimeout(() => {
      performConversion();
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [state.input, state.options, state.mode]);

  const delimiterOptions = [
    { value: ',', label: 'Comma (,)' },
    { value: ';', label: 'Semicolon (;)' },
    { value: '\t', label: 'Tab (\\t)' },
    { value: '|', label: 'Pipe (|)' }
  ];

  const encodingOptions = [
    { value: 'utf-8', label: 'UTF-8' },
    { value: 'latin1', label: 'Latin-1' }
  ];

  const inputIcon = state.mode === 'json-to-csv' ? <IconBraces size={16} /> : <IconFileTypeCsv size={16} />;
  const outputIcon = state.mode === 'json-to-csv' ? <IconFileTypeCsv size={16} /> : <IconBraces size={16} />;

  return (
    <ToolLayout
      title="JSON ↔ CSV Converter"
      description="Convert data between JSON and CSV formats with bidirectional conversion, syntax validation, and customizable options"
    >
      <Stack gap="lg">
        {/* Mode Switcher */}
        <Card withBorder>
          <Group justify="space-between" align="center">
            <Group gap="md">
              {inputIcon}
              <Text size="sm" fw={500}>
                {state.mode === 'json-to-csv' ? 'JSON to CSV' : 'CSV to JSON'}
              </Text>
            </Group>
            
            <Group gap="sm">
              <Button
                variant="light"
                size="sm"
                leftSection={<IconSwitch size={16} />}
                onClick={handleModeSwitch}
              >
                Switch Mode
              </Button>
              <Button
                variant="subtle"
                size="sm"
                onClick={loadSample}
              >
                Load Sample
              </Button>
            </Group>
          </Group>
        </Card>

        <Tabs defaultValue="converter">
          <Tabs.List>
            <Tabs.Tab value="converter" leftSection={<IconBraces size={16} />}>
              Converter
            </Tabs.Tab>
            <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
              Settings
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="converter" pt="md">
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card withBorder h="100%">
                  <Stack gap="sm">
                    <Group justify="space-between" align="center">
                      <Group gap="xs">
                        {inputIcon}
                        <Text size="sm" fw={500}>
                          {state.mode === 'json-to-csv' ? 'JSON Input' : 'CSV Input'}
                        </Text>
                      </Group>
                      
                      <Group gap="xs">
                        <FileButton
                          onChange={handleFileUpload}
                          accept={state.mode === 'json-to-csv' ? '.json' : '.csv'}
                        >
                          {(props) => (
                            <ActionIcon {...props} variant="subtle" size="sm">
                              <IconFileUpload size={16} />
                            </ActionIcon>
                          )}
                        </FileButton>
                        
                        <ActionIcon
                          variant="subtle"
                          size="sm"
                          onClick={clearAll}
                        >
                          <IconRefresh size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>

                    <Textarea
                      placeholder={
                        state.mode === 'json-to-csv'
                          ? 'Enter JSON array of objects...'
                          : 'Enter CSV data...'
                      }
                      value={state.input}
                      onChange={(e) => setState(prev => ({ ...prev, input: e.target.value }))}
                      minRows={12}
                      maxRows={20}
                      styles={{
                        input: {
                          fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
                          fontSize: '12px'
                        }
                      }}
                    />
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card withBorder h="100%">
                  <Stack gap="sm">
                    <Group justify="space-between" align="center">
                      <Group gap="xs">
                        {outputIcon}
                        <Text size="sm" fw={500}>
                          {state.mode === 'json-to-csv' ? 'CSV Output' : 'JSON Output'}
                        </Text>
                        {state.metadata && (
                          <Badge size="sm" variant="light">
                            {state.metadata.rows} rows, {state.metadata.columns} cols
                          </Badge>
                        )}
                      </Group>
                      
                      <Group gap="xs">
                        <ActionIcon
                          variant="subtle"
                          size="sm"
                          onClick={copyToClipboard}
                          disabled={!state.output}
                        >
                          {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                        </ActionIcon>
                        
                        <ActionIcon
                          variant="subtle"
                          size="sm"
                          onClick={downloadResult}
                          disabled={!state.output}
                        >
                          <IconDownload size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>

                    {state.error && (
                      <Alert
                        icon={<IconInfoCircle size={16} />}
                        color="red"
                        variant="light"
                      >
                        {state.error}
                      </Alert>
                    )}

                    <ScrollArea>
                      <Textarea
                        placeholder="Converted output will appear here..."
                        value={state.output}
                        readOnly
                        minRows={12}
                        maxRows={20}
                        styles={{
                          input: {
                            fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
                            fontSize: '12px',
                            backgroundColor: 'var(--mantine-color-gray-0)'
                          }
                        }}
                      />
                    </ScrollArea>

                    {state.metadata && (
                      <Group gap="md" justify="center">
                        <Text size="xs" c="dimmed">
                          Rows: {state.metadata.rows}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Columns: {state.metadata.columns}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Size: {state.metadata.size}
                        </Text>
                      </Group>
                    )}
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="settings" pt="md">
            <Paper withBorder p="md">
              <Stack gap="md">
                <Text size="sm" fw={500}>Conversion Options</Text>
                
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Select
                      label="CSV Delimiter"
                      description="Character used to separate CSV fields"
                      value={state.options.delimiter}
                      onChange={(value) => 
                        setState(prev => ({
                          ...prev,
                          options: { ...prev.options, delimiter: value as any }
                        }))
                      }
                      data={delimiterOptions}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Select
                      label="Text Encoding"
                      description="Character encoding for file processing"
                      value={state.options.encoding}
                      onChange={(value) => 
                        setState(prev => ({
                          ...prev,
                          options: { ...prev.options, encoding: value as any }
                        }))
                      }
                      data={encodingOptions}
                    />
                  </Grid.Col>
                </Grid>

                <Divider />

                <Stack gap="sm">
                  <Switch
                    label="Include Headers"
                    description="Include column headers in CSV output / treat first CSV row as headers"
                    checked={state.options.includeHeaders}
                    onChange={(event) =>
                      setState(prev => ({
                        ...prev,
                        options: { 
                          ...prev.options, 
                          includeHeaders: event?.currentTarget?.checked ?? !prev.options.includeHeaders 
                        }
                      }))
                    }
                  />
                  
                  <Switch
                    label="Skip Empty Lines"
                    description="Ignore empty lines during processing"
                    checked={state.options.skipEmptyLines}
                    onChange={(event) =>
                      setState(prev => ({
                        ...prev,
                        options: { 
                          ...prev.options, 
                          skipEmptyLines: event?.currentTarget?.checked ?? !prev.options.skipEmptyLines 
                        }
                      }))
                    }
                  />
                  
                  <Switch
                    label="Trim Whitespace"
                    description="Remove leading/trailing whitespace from fields"
                    checked={state.options.trimWhitespace}
                    onChange={(event) =>
                      setState(prev => ({
                        ...prev,
                        options: { 
                          ...prev.options, 
                          trimWhitespace: event?.currentTarget?.checked ?? !prev.options.trimWhitespace 
                        }
                      }))
                    }
                  />
                  
                  <Switch
                    label="Flatten Arrays"
                    description="Convert nested objects and arrays to flat structure (JSON to CSV only)"
                    checked={state.options.flattenArrays}
                    disabled={state.mode === 'csv-to-json'}
                    onChange={(event) =>
                      setState(prev => ({
                        ...prev,
                        options: { 
                          ...prev.options, 
                          flattenArrays: event?.currentTarget?.checked ?? !prev.options.flattenArrays 
                        }
                      }))
                    }
                  />
                </Stack>
              </Stack>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </ToolLayout>
  );
}