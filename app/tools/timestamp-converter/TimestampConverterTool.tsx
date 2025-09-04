'use client';

import { useState, useEffect } from 'react';
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
  Select,
  Card,
  Table,
  NumberInput
} from '@mantine/core';
import { IconCopy, IconCheck, IconClock, IconCalendar } from '@tabler/icons-react';
import { ToolLayout } from '../../components/tools/ToolLayout';
import { notifications } from '@mantine/notifications';

interface TimestampConverterState {
  timestamp: number;
  humanReadable: string;
  timezone: string;
  format: string;
  customFormat: string;
  isValid: boolean;
  currentTime: number;
}

export function TimestampConverterTool() {
  const [state, setState] = useState<TimestampConverterState>({
    timestamp: Math.floor(Date.now() / 1000),
    humanReadable: '',
    timezone: 'local',
    format: 'iso',
    customFormat: 'YYYY-MM-DD HH:mm:ss',
    isValid: true,
    currentTime: Math.floor(Date.now() / 1000)
  });

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({ ...prev, currentTime: Math.floor(Date.now() / 1000) }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp: number, format: string, timezone: string): string => {
    try {
      const date = new Date(timestamp * 1000);
      
      if (isNaN(date.getTime())) {
        return 'Invalid timestamp';
      }

      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone === 'local' ? undefined : timezone
      };

      switch (format) {
        case 'iso':
          return timezone === 'local' ? date.toISOString() : date.toLocaleString('sv-SE', { ...options, timeZoneName: 'short' });
        case 'locale':
          return date.toLocaleString(undefined, { ...options, timeZoneName: 'short' });
        case 'date-only':
          return date.toLocaleDateString(undefined, options);
        case 'time-only':
          return date.toLocaleTimeString(undefined, options);
        case 'rfc':
          return date.toUTCString();
        case 'relative':
          return getRelativeTime(timestamp);
        default:
          return date.toISOString();
      }
    } catch (error) {
      return 'Format error';
    }
  };

  const getRelativeTime = (timestamp: number): string => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    const absDiff = Math.abs(diff);

    if (absDiff < 60) return `${absDiff} seconds ${diff < 0 ? 'from now' : 'ago'}`;
    if (absDiff < 3600) return `${Math.floor(absDiff / 60)} minutes ${diff < 0 ? 'from now' : 'ago'}`;
    if (absDiff < 86400) return `${Math.floor(absDiff / 3600)} hours ${diff < 0 ? 'from now' : 'ago'}`;
    if (absDiff < 2592000) return `${Math.floor(absDiff / 86400)} days ${diff < 0 ? 'from now' : 'ago'}`;
    if (absDiff < 31536000) return `${Math.floor(absDiff / 2592000)} months ${diff < 0 ? 'from now' : 'ago'}`;
    return `${Math.floor(absDiff / 31536000)} years ${diff < 0 ? 'from now' : 'ago'}`;
  };

  const parseHumanReadable = (dateString: string): number => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }
      return Math.floor(date.getTime() / 1000);
    } catch (error) {
      throw new Error('Could not parse date');
    }
  };

  const handleTimestampChange = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseInt(value) : value;
    
    if (isNaN(numValue)) {
      setState(prev => ({ ...prev, timestamp: 0, isValid: false }));
      return;
    }

    const timestamp = numValue;
    const humanReadable = formatTimestamp(timestamp, state.format, state.timezone);
    
    setState(prev => ({
      ...prev,
      timestamp,
      humanReadable,
      isValid: true
    }));
  };

  const handleHumanReadableChange = (value: string) => {
    setState(prev => ({ ...prev, humanReadable: value }));
    
    if (!value.trim()) {
      setState(prev => ({ ...prev, isValid: true }));
      return;
    }

    try {
      const timestamp = parseHumanReadable(value);
      setState(prev => ({
        ...prev,
        timestamp,
        isValid: true
      }));
    } catch (error) {
      setState(prev => ({ ...prev, isValid: false }));
    }
  };

  const handleFormatChange = (format: string) => {
    setState(prev => ({
      ...prev,
      format,
      humanReadable: formatTimestamp(prev.timestamp, format, prev.timezone)
    }));
  };

  const handleTimezoneChange = (timezone: string) => {
    setState(prev => ({
      ...prev,
      timezone,
      humanReadable: formatTimestamp(prev.timestamp, prev.format, timezone)
    }));
  };

  const setCurrentTime = () => {
    const now = Math.floor(Date.now() / 1000);
    handleTimestampChange(now);
  };

  const commonTimezones = [
    { value: 'local', label: 'Local Time' },
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Europe/Berlin', label: 'Berlin' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
    { value: 'Asia/Shanghai', label: 'Shanghai' },
    { value: 'Asia/Kolkata', label: 'India' },
    { value: 'Australia/Sydney', label: 'Sydney' }
  ];

  const formatOptions = [
    { value: 'iso', label: 'ISO 8601' },
    { value: 'locale', label: 'Locale String' },
    { value: 'date-only', label: 'Date Only' },
    { value: 'time-only', label: 'Time Only' },
    { value: 'rfc', label: 'RFC 2822' },
    { value: 'relative', label: 'Relative Time' }
  ];

  const quickTimestamps = [
    { label: 'Now', value: state.currentTime },
    { label: '1 Hour Ago', value: state.currentTime - 3600 },
    { label: '1 Day Ago', value: state.currentTime - 86400 },
    { label: '1 Week Ago', value: state.currentTime - 604800 },
    { label: '1 Month Ago', value: state.currentTime - 2592000 },
    { label: 'Unix Epoch', value: 0 },
    { label: 'Y2K', value: 946684800 }
  ];

  // Initialize with current time on mount
  useEffect(() => {
    setCurrentTime();
  }, []);

  return (
    <ToolLayout
      title="Unix Timestamp Converter"
      description="Convert between Unix timestamps and human-readable dates with timezone support"
      actions={
        <Group gap="sm">
          <Button 
            leftSection={<IconClock size={16} />}
            onClick={setCurrentTime}
          >
            Current Time
          </Button>
        </Group>
      }
    >
      <Stack gap="lg">
        {/* Configuration */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>Conversion Settings</Text>
            
            <Group grow>
              <Select
                label="Timezone"
                value={state.timezone}
                onChange={(value) => handleTimezoneChange(value!)}
                data={commonTimezones}
                searchable
              />
              
              <Select
                label="Date Format"
                value={state.format}
                onChange={(value) => handleFormatChange(value!)}
                data={formatOptions}
              />
            </Group>
          </Stack>
        </Card>

        {/* Current Time Display */}
        <Alert icon={<IconClock size={16} />} color="blue">
          <Group justify="space-between">
            <Text size="sm">
              <strong>Current Unix Timestamp:</strong> {state.currentTime}
            </Text>
            <Text size="sm">
              <strong>Current Time:</strong> {formatTimestamp(state.currentTime, state.format, state.timezone)}
            </Text>
          </Group>
        </Alert>

        {/* Input/Output Areas */}
        <Group grow align="flex-start" gap="lg">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500}>Unix Timestamp</Text>
              <MantineCopyButton value={state.timestamp.toString()} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copied!' : 'Copy timestamp'}>
                    <ActionIcon
                      color={copied ? 'teal' : 'gray'}
                      variant="subtle"
                      onClick={() => {
                        copy();
                        notifications.show({
                          title: 'Copied!',
                          message: 'Timestamp copied to clipboard',
                          color: 'green'
                        });
                      }}
                    >
                      {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </MantineCopyButton>
            </Group>
            <NumberInput
              value={state.timestamp}
              onChange={(value) => handleTimestampChange(value)}
              placeholder="Enter Unix timestamp..."
              style={{ fontFamily: 'var(--font-geist-mono)' }}
              step={1}
              hideControls
            />
            <Text size="xs" c="dimmed">
              Seconds since January 1, 1970 (Unix Epoch)
            </Text>
          </Stack>

          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500}>Human Readable Date</Text>
              {state.humanReadable && (
                <MantineCopyButton value={state.humanReadable} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Copied!' : 'Copy date'}>
                      <ActionIcon
                        color={copied ? 'teal' : 'gray'}
                        variant="subtle"
                        onClick={() => {
                          copy();
                          notifications.show({
                            title: 'Copied!',
                            message: 'Date copied to clipboard',
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
            <TextInput
              value={state.humanReadable}
              onChange={(event) => handleHumanReadableChange(event.currentTarget.value)}
              placeholder="Enter date string..."
              style={{ fontFamily: 'var(--font-geist-mono)' }}
              error={!state.isValid ? 'Invalid date format' : undefined}
            />
            <Text size="xs" c="dimmed">
              Try: "2024-01-01", "Jan 1, 2024", "2024-01-01T12:00:00Z"
            </Text>
          </Stack>
        </Group>

        {/* Quick Timestamps */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>Quick Timestamps</Text>
            <Group gap="sm">
              {quickTimestamps.map((item) => (
                <Button
                  key={item.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTimestampChange(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </Group>
          </Stack>
        </Card>

        {/* Detailed Information */}
        {state.isValid && (
          <Card>
            <Stack gap="md">
              <Text fw={600}>Detailed Information</Text>
              <Table>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td fw={500}>Unix Timestamp</Table.Td>
                    <Table.Td style={{ fontFamily: 'var(--font-geist-mono)' }}>
                      {state.timestamp}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={500}>Milliseconds</Table.Td>
                    <Table.Td style={{ fontFamily: 'var(--font-geist-mono)' }}>
                      {state.timestamp * 1000}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={500}>ISO 8601</Table.Td>
                    <Table.Td style={{ fontFamily: 'var(--font-geist-mono)' }}>
                      {formatTimestamp(state.timestamp, 'iso', 'UTC')}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={500}>RFC 2822</Table.Td>
                    <Table.Td style={{ fontFamily: 'var(--font-geist-mono)' }}>
                      {formatTimestamp(state.timestamp, 'rfc', 'UTC')}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={500}>Relative Time</Table.Td>
                    <Table.Td style={{ fontFamily: 'var(--font-geist-mono)' }}>
                      {formatTimestamp(state.timestamp, 'relative', state.timezone)}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={500}>Day of Week</Table.Td>
                    <Table.Td>
                      {new Date(state.timestamp * 1000).toLocaleDateString(undefined, { weekday: 'long' })}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td fw={500}>Day of Year</Table.Td>
                    <Table.Td>
                      {Math.floor((new Date(state.timestamp * 1000).getTime() - new Date(new Date(state.timestamp * 1000).getFullYear(), 0, 0).getTime()) / 86400000)}
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Stack>
          </Card>
        )}

        {/* Information */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>About Unix Timestamps</Text>
            <Text size="sm" c="dimmed">
              Unix timestamp is the number of seconds that have elapsed since January 1, 1970, 00:00:00 UTC (Unix Epoch). 
              It's a widely used standard for representing time in computer systems.
            </Text>
            
            <Group gap="md">
              <Text size="sm" c="dimmed">
                <strong>Range:</strong> -2,147,483,648 to 2,147,483,647 (32-bit)
              </Text>
              <Text size="sm" c="dimmed">
                <strong>Year 2038 Problem:</strong> 32-bit timestamps will overflow on January 19, 2038
              </Text>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </ToolLayout>
  );
}