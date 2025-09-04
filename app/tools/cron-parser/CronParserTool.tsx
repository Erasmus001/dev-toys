'use client';

import { useState } from 'react';
import { 
  Stack, 
  Group, 
  Button, 
  TextInput, 
  Alert,
  CopyButton as MantineCopyButton,
  ActionIcon,
  Tooltip,
  Text,
  Card,
  Badge,
  Code
} from '@mantine/core';
import { IconCopy, IconCheck, IconAlertCircle, IconClock } from '@tabler/icons-react';
import { ToolLayout } from '../../components/tools/ToolLayout';
import { CronParserState, CronParsedResult } from '../../lib/types';
import { notifications } from '@mantine/notifications';

export function CronParserTool() {
  const [state, setState] = useState<CronParserState>({
    expression: '',
    isValid: true,
    error: undefined,
    parsed: null,
    nextExecutions: [],
    timezone: 'UTC'
  });

  const commonCronExpressions = [
    { label: 'Every minute', value: '* * * * *' },
    { label: 'Every 5 minutes', value: '*/5 * * * *' },
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Every day at midnight', value: '0 0 * * *' },
    { label: 'Every weekday at 9 AM', value: '0 9 * * 1-5' }
  ];

  const parseCronExpression = (expression: string): CronParsedResult | null => {
    const parts = expression.trim().split(/\s+/);
    
    if (parts.length !== 5 && parts.length !== 6) {
      throw new Error('CRON expression must have 5 or 6 parts');
    }

    if (parts.length === 5) {
      return {
        minute: parts[0],
        hour: parts[1],
        dayOfMonth: parts[2],
        month: parts[3],
        dayOfWeek: parts[4],
        description: generateDescription(parts)
      };
    } else {
      return {
        second: parts[0],
        minute: parts[1],
        hour: parts[2],
        dayOfMonth: parts[3],
        month: parts[4],
        dayOfWeek: parts[5],
        description: generateDescription(parts)
      };
    }
  };

  const generateDescription = (parts: string[]): string => {
    if (parts.every(part => part === '*')) {
      return 'Every minute';
    }

    let description = 'Runs ';

    // Simple description generation
    if (parts[0] === '*') {
      description += 'every minute';
    } else {
      description += `at minute ${parts[0]}`;
    }

    if (parts[1] !== '*') {
      const hour = parseInt(parts[1]);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      description += `, at ${displayHour}:00 ${period}`;
    }

    if (parts[2] !== '*') {
      description += `, on day ${parts[2]} of month`;
    }

    if (parts[3] !== '*') {
      description += `, in month ${parts[3]}`;
    }

    if (parts[4] !== '*') {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      if (parts[4].includes('-')) {
        const [start, end] = parts[4].split('-').map(d => parseInt(d));
        description += `, ${days[start]} through ${days[end]}`;
      } else {
        const dayIndex = parseInt(parts[4]);
        description += `, on ${days[dayIndex]}`;
      }
    }

    return description;
  };

  const handleExpressionChange = (value: string) => {
    setState(prev => ({ ...prev, expression: value }));
    
    if (!value.trim()) {
      setState(prev => ({
        ...prev,
        parsed: null,
        nextExecutions: [],
        isValid: true,
        error: undefined
      }));
      return;
    }

    try {
      const parsed = parseCronExpression(value);
      setState(prev => ({
        ...prev,
        parsed,
        isValid: true,
        error: undefined
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid CRON expression';
      setState(prev => ({
        ...prev,
        parsed: null,
        nextExecutions: [],
        isValid: false,
        error: errorMessage
      }));
    }
  };

  const handleClear = () => {
    setState({
      expression: '',
      isValid: true,
      error: undefined,
      parsed: null,
      nextExecutions: [],
      timezone: 'UTC'
    });
  };

  const loadExample = (expression: string) => {
    setState(prev => ({ ...prev, expression }));
    handleExpressionChange(expression);
  };

  return (
    <ToolLayout
      title="CRON Expression Parser"
      description="Parse CRON expressions and understand their schedule"
      actions={
        <Group gap="sm">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          {state.expression && (
            <MantineCopyButton value={state.expression} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied!' : 'Copy expression'}>
                  <ActionIcon
                    color={copied ? 'teal' : 'gray'}
                    variant="subtle"
                    onClick={() => {
                      copy();
                      notifications.show({
                        title: 'Copied!',
                        message: 'CRON expression copied to clipboard',
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
      }
    >
      <Stack gap="lg">
        {/* Input Section */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>CRON Expression</Text>
            <TextInput
              value={state.expression}
              onChange={(event) => handleExpressionChange(event.currentTarget.value)}
              placeholder="Enter CRON expression (e.g., 0 9 * * 1-5)"
              leftSection={<IconClock size={16} />}
              error={state.error}
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            />
          </Stack>
        </Card>

        {/* Error Display */}
        {state.error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            <Text fw={500}>Invalid CRON Expression</Text>
            <Text size="sm">{state.error}</Text>
          </Alert>
        )}

        {/* Common Examples */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>Common CRON Expressions</Text>
            <Group gap="xs">
              {commonCronExpressions.map((example, index) => (
                <Button
                  key={index}
                  variant="light"
                  size="xs"
                  onClick={() => loadExample(example.value)}
                >
                  {example.label}
                </Button>
              ))}
            </Group>
          </Stack>
        </Card>

        {/* Parsed Expression Details */}
        {state.parsed && (
          <Card>
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={600}>Expression Details</Text>
                <Badge color="green" leftSection={<IconCheck size={12} />}>
                  Valid
                </Badge>
              </Group>
              
              <Stack gap="sm">
                <Text size="lg" fw={500}>{state.parsed.description}</Text>
                <Code block>
                  {state.expression}
                </Code>
              </Stack>

              <Stack gap="sm">
                <Text fw={500}>Field Breakdown</Text>
                <Group gap="md">
                  <Text size="sm"><strong>Minute:</strong> {state.parsed.minute}</Text>
                  <Text size="sm"><strong>Hour:</strong> {state.parsed.hour}</Text>
                  <Text size="sm"><strong>Day:</strong> {state.parsed.dayOfMonth}</Text>
                  <Text size="sm"><strong>Month:</strong> {state.parsed.month}</Text>
                  <Text size="sm"><strong>Day of Week:</strong> {state.parsed.dayOfWeek}</Text>
                </Group>
              </Stack>
            </Stack>
          </Card>
        )}

        {/* CRON Format Reference */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>CRON Format Reference</Text>
            <Stack gap="sm">
              <Text size="sm">
                <strong>Format:</strong> <Code>minute hour day month dayOfWeek</Code>
              </Text>
              <Text size="sm">
                <strong>Special Characters:</strong> * (any), , (list), - (range), / (step)
              </Text>
              <Text size="sm">
                <strong>Examples:</strong> */15 (every 15), 1,3,5 (at 1,3,5), 1-5 (from 1 to 5)
              </Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </ToolLayout>
  );
}