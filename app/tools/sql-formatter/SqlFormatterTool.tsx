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
  Select,
  NumberInput,
  Switch
} from '@mantine/core';
import { IconCopy, IconCheck, IconAlertCircle, IconDatabase, IconCode } from '@tabler/icons-react';
import { ToolLayout } from '../../components/tools/ToolLayout';
import { SQLFormatterState, SQLDialect, FormattingStyle } from '../../lib/types';
import { notifications } from '@mantine/notifications';
import { format } from 'sql-formatter';

export function SqlFormatterTool() {
  const [state, setState] = useState<SQLFormatterState>({
    input: '',
    output: '',
    dialect: 'mysql',
    style: 'expanded',
    options: {
      keywordCase: 'upper',
      indentSize: 2,
      maxLineLength: 80,
      commaStyle: 'trailing'
    }
  });

  const sqlDialects: { value: SQLDialect; label: string }[] = [
    { value: 'mysql', label: 'MySQL' },
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'sqlite', label: 'SQLite' },
    { value: 'mssql', label: 'SQL Server' },
    { value: 'oracle', label: 'Oracle' }
  ];

  const formattingStyles: { value: FormattingStyle; label: string }[] = [
    { value: 'compact', label: 'Compact' },
    { value: 'expanded', label: 'Expanded' },
    { value: 'custom', label: 'Custom' }
  ];

  const sampleQueries = [
    {
      name: 'Simple SELECT',
      query: 'select u.id, u.name, p.title from users u join posts p on u.id = p.user_id where u.active = 1 order by p.created_at desc limit 10;'
    },
    {
      name: 'Complex JOIN',
      query: 'select u.first_name, u.last_name, o.order_date, oi.quantity, p.name as product_name, p.price from users u inner join orders o on u.id = o.user_id inner join order_items oi on o.id = oi.order_id inner join products p on oi.product_id = p.id where o.order_date >= "2023-01-01" and p.category = "electronics" order by o.order_date desc, u.last_name asc;'
    },
    {
      name: 'Subquery',
      query: 'select * from (select user_id, count(*) as order_count, avg(total_amount) as avg_amount from orders where order_date >= "2023-01-01" group by user_id having count(*) > 5) as frequent_customers order by avg_amount desc;'
    },
    {
      name: 'CREATE TABLE',
      query: 'create table users (id int primary key auto_increment, first_name varchar(50) not null, last_name varchar(50) not null, email varchar(100) unique not null, created_at timestamp default current_timestamp, updated_at timestamp default current_timestamp on update current_timestamp);'
    }
  ];

  const formatSql = (sql: string) => {
    try {
      if (!sql.trim()) {
        setState(prev => ({ ...prev, output: '' }));
        return;
      }

      const dialectMap: Record<SQLDialect, string> = {
        mysql: 'mysql',
        postgresql: 'postgresql',
        sqlite: 'sqlite',
        mssql: 'tsql',
        oracle: 'plsql'
      };

      const options = {
        language: dialectMap[state.dialect || 'mysql'] as any,
        keywordCase: state.options.keywordCase === 'title' ? 'upper' : state.options.keywordCase
      };

      const formatted = format(sql, options);
      
      setState(prev => ({ ...prev, output: formatted }));
    } catch (error) {
      console.error('SQL formatting error:', error);
      setState(prev => ({ 
        ...prev, 
        output: 'Error: Could not format SQL. Please check your syntax.' 
      }));
    }
  };

  const handleInputChange = (value: string) => {
    setState(prev => ({ ...prev, input: value }));
    formatSql(value);
  };

  const handleDialectChange = (dialect: SQLDialect) => {
    setState(prev => ({ ...prev, dialect }));
    if (state.input) {
      formatSql(state.input);
    }
  };

  const handleStyleChange = (style: FormattingStyle) => {
    setState(prev => ({ ...prev, style }));
    if (state.input) {
      formatSql(state.input);
    }
  };

  const handleOptionChange = (key: keyof typeof state.options, value: any) => {
    setState(prev => ({ 
      ...prev, 
      options: { ...prev.options, [key]: value }
    }));
    if (state.input) {
      formatSql(state.input);
    }
  };

  const handleClear = () => {
    setState(prev => ({
      ...prev,
      input: '',
      output: ''
    }));
  };

  const loadSample = (query: string) => {
    setState(prev => ({ ...prev, input: query }));
    formatSql(query);
  };

  const minifyQuery = () => {
    if (!state.input.trim()) return;
    
    // Simple minification - remove extra whitespace and line breaks
    const minified = state.input
      .replace(/\s+/g, ' ')
      .replace(/\s*([,;()=<>])\s*/g, '$1')
      .replace(/\s*(AND|OR|FROM|WHERE|JOIN|ON|GROUP BY|ORDER BY|HAVING)\s+/gi, ' $1 ')
      .trim();
    
    setState(prev => ({ ...prev, output: minified }));
  };

  return (
    <ToolLayout
      title="SQL Formatter"
      description="Format and beautify SQL queries with syntax highlighting"
      actions={
        <Group gap="sm">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="outline" onClick={minifyQuery}>
            Minify
          </Button>
          {state.output && (
            <MantineCopyButton value={state.output} timeout={2000}>
              {({ copied, copy }) => (
                <Button 
                  onClick={() => {
                    copy();
                    notifications.show({
                      title: 'Copied!',
                      message: 'Formatted SQL copied to clipboard',
                      color: 'green'
                    });
                  }}
                  leftSection={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                >
                  {copied ? 'Copied!' : 'Copy SQL'}
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
            <Text fw={600}>Formatting Options</Text>
            <Group grow>
              <Select
                label="SQL Dialect"
                value={state.dialect}
                onChange={(value) => handleDialectChange(value as SQLDialect)}
                data={sqlDialects}
              />
              <Select
                label="Style"
                value={state.style}
                onChange={(value) => handleStyleChange(value as FormattingStyle)}
                data={formattingStyles}
              />
            </Group>
            
            {state.style === 'custom' && (
              <Group grow>
                <Select
                  label="Keyword Case"
                  value={state.options.keywordCase}
                  onChange={(value) => handleOptionChange('keywordCase', value)}
                  data={[
                    { value: 'upper', label: 'UPPERCASE' },
                    { value: 'lower', label: 'lowercase' },
                    { value: 'title', label: 'Title Case' }
                  ]}
                />
                <NumberInput
                  label="Indent Size"
                  value={state.options.indentSize}
                  onChange={(value) => handleOptionChange('indentSize', value)}
                  min={1}
                  max={8}
                />
                <NumberInput
                  label="Max Line Length"
                  value={state.options.maxLineLength}
                  onChange={(value) => handleOptionChange('maxLineLength', value)}
                  min={40}
                  max={200}
                />
              </Group>
            )}
          </Stack>
        </Card>

        {/* Sample Queries */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>Sample Queries</Text>
            <Group gap="xs">
              {sampleQueries.map((sample, index) => (
                <Button
                  key={index}
                  variant="light"
                  size="xs"
                  onClick={() => loadSample(sample.query)}
                >
                  {sample.name}
                </Button>
              ))}
            </Group>
          </Stack>
        </Card>

        {/* Input/Output Areas */}
        <Group grow align="flex-start" gap="lg">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500}>SQL Input</Text>
              <Group gap="xs">
                <IconDatabase size={16} />
                <Text size="sm" c="dimmed">{state.dialect?.toUpperCase() || 'SQL'}</Text>
              </Group>
            </Group>
            <Textarea
              value={state.input}
              onChange={(event) => handleInputChange(event.currentTarget.value)}
              placeholder="Enter your SQL query here..."
              minRows={12}
              maxRows={20}
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            />
          </Stack>

          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500}>Formatted SQL</Text>
              {state.output && (
                <MantineCopyButton value={state.output} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Copied!' : 'Copy formatted SQL'}>
                      <ActionIcon
                        color={copied ? 'teal' : 'gray'}
                        variant="subtle"
                        onClick={() => {
                          copy();
                          notifications.show({
                            title: 'Copied!',
                            message: 'Formatted SQL copied to clipboard',
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
              placeholder="Formatted SQL will appear here..."
              minRows={12}
              maxRows={20}
              style={{ 
                fontFamily: 'var(--font-geist-mono)',
                backgroundColor: 'var(--mantine-color-gray-0)'
              }}
            />
          </Stack>
        </Group>

        {/* SQL Reference */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>SQL Formatting Features</Text>
            <Group gap="md">
              <Stack gap="xs">
                <Text size="sm" fw={500}>Supported Features:</Text>
                <Text size="xs">• Keyword case conversion</Text>
                <Text size="xs">• Proper indentation</Text>
                <Text size="xs">• Line length control</Text>
                <Text size="xs">• JOIN clause formatting</Text>
              </Stack>
              
              <Stack gap="xs">
                <Text size="sm" fw={500}>Dialects:</Text>
                <Text size="xs">• MySQL</Text>
                <Text size="xs">• PostgreSQL</Text>
                <Text size="xs">• SQLite</Text>
                <Text size="xs">• SQL Server & Oracle</Text>
              </Stack>

              <Stack gap="xs">
                <Text size="sm" fw={500}>Output Styles:</Text>
                <Text size="xs">• Compact (minimal whitespace)</Text>
                <Text size="xs">• Expanded (readable format)</Text>
                <Text size="xs">• Custom (configurable options)</Text>
                <Text size="xs">• Minify (single line)</Text>
              </Stack>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </ToolLayout>
  );
}