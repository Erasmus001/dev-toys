'use client';

import { useState, useMemo } from 'react';
import { 
  Stack, 
  Group, 
  Button, 
  TextInput,
  Textarea,
  Alert,
  CopyButton as MantineCopyButton,
  ActionIcon,
  Tooltip,
  Text,
  Switch,
  Card,
  Badge,
  Table,
  ScrollArea,
  Code
} from '@mantine/core';
import { IconCopy, IconCheck, IconAlertCircle, IconSearch } from '@tabler/icons-react';
import { ToolLayout } from '../../components/tools/ToolLayout';
import { RegexTesterState, RegexMatch } from '../../lib/types';
import { notifications } from '@mantine/notifications';

export function RegexTesterTool() {
  const [state, setState] = useState<RegexTesterState>({
    pattern: '',
    testString: '',
    flags: {
      global: true,
      ignoreCase: false,
      multiline: false,
      dotAll: false,
      unicode: false,
      sticky: false
    },
    matches: [],
    replacePattern: '',
    replaceResult: '',
    isValid: true,
    explanation: '',
    error: undefined
  });

  const testRegex = useMemo(() => {
    if (!state.pattern) {
      setState(prev => ({ ...prev, matches: [], isValid: true, error: undefined }));
      return null;
    }

    try {
      const flagsString = Object.entries(state.flags)
        .filter(([, enabled]) => enabled)
        .map(([flag]) => {
          switch (flag) {
            case 'global': return 'g';
            case 'ignoreCase': return 'i';
            case 'multiline': return 'm';
            case 'dotAll': return 's';
            case 'unicode': return 'u';
            case 'sticky': return 'y';
            default: return '';
          }
        })
        .join('');

      const regex = new RegExp(state.pattern, flagsString);
      
      if (!state.testString) {
        setState(prev => ({ ...prev, matches: [], isValid: true, error: undefined }));
        return regex;
      }

      const matches: RegexMatch[] = [];
      
      if (state.flags.global) {
        let match;
        const globalRegex = new RegExp(state.pattern, flagsString);
        while ((match = globalRegex.exec(state.testString)) !== null) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: Array.from(match).slice(1)
          });
          
          // Prevent infinite loop on empty matches
          if (match.index === globalRegex.lastIndex) {
            globalRegex.lastIndex++;
          }
        }
      } else {
        const match = regex.exec(state.testString);
        if (match) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: Array.from(match).slice(1)
          });
        }
      }

      setState(prev => ({ ...prev, matches, isValid: true, error: undefined }));
      return regex;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid regular expression';
      setState(prev => ({ 
        ...prev, 
        matches: [], 
        isValid: false, 
        error: errorMessage 
      }));
      return null;
    }
  }, [state.pattern, state.testString, state.flags]);

  const handlePatternChange = (value: string) => {
    setState(prev => ({ ...prev, pattern: value }));
  };

  const handleTestStringChange = (value: string) => {
    setState(prev => ({ ...prev, testString: value }));
  };

  const handleFlagChange = (flag: keyof typeof state.flags) => {
    setState(prev => ({
      ...prev,
      flags: { ...prev.flags, [flag]: !prev.flags[flag] }
    }));
  };

  const handleClear = () => {
    setState(prev => ({
      ...prev,
      pattern: '',
      testString: '',
      matches: [],
      isValid: true,
      error: undefined
    }));
  };

  const getHighlightedText = (): Array<{ text: string; isMatch: boolean; index?: number }> => {
    if (!state.testString || state.matches.length === 0) {
      return [{ text: state.testString, isMatch: false }];
    }

    const parts: Array<{ text: string; isMatch: boolean; index?: number }> = [];
    let lastIndex = 0;

    // Sort matches by index to handle overlapping matches
    const sortedMatches = [...state.matches].sort((a, b) => a.index - b.index);

    sortedMatches.forEach((match, matchIndex) => {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push({
          text: state.testString.slice(lastIndex, match.index),
          isMatch: false
        });
      }

      // Add match
      parts.push({
        text: match.match,
        isMatch: true,
        index: matchIndex
      });

      lastIndex = match.index + match.match.length;
    });

    // Add remaining text
    if (lastIndex < state.testString.length) {
      parts.push({
        text: state.testString.slice(lastIndex),
        isMatch: false
      });
    }

    return parts;
  };

  const commonRegexPatterns = [
    { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', description: 'Basic email validation' },
    { name: 'Phone', pattern: '\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})', description: 'US phone number' },
    { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)', description: 'URL validation' },
    { name: 'IPv4', pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b', description: 'IPv4 address' },
    { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}', description: 'ISO date format' },
    { name: 'Time (HH:MM)', pattern: '([01]?[0-9]|2[0-3]):[0-5][0-9]', description: '24-hour time format' },
    { name: 'Hex Color', pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})', description: 'Hexadecimal color codes' },
    { name: 'Credit Card', pattern: '\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}', description: 'Credit card number format' }
  ];

  const flagDescriptions = {
    global: 'Find all matches rather than stopping after the first match',
    ignoreCase: 'Case-insensitive matching',
    multiline: '^$ match line breaks',
    dotAll: '. matches newline characters',
    unicode: 'Unicode matching',
    sticky: 'Matches only from the index indicated by lastIndex'
  };

  return (
    <ToolLayout
      title="Regex Tester"
      description="Test regular expressions with real-time matching and detailed analysis"
      actions={
        <Group gap="sm">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
        </Group>
      }
    >
      <Stack gap="lg">
        {/* Pattern Input */}
        <Stack gap="xs">
          <Text fw={500}>Regular Expression Pattern</Text>
          <Group gap="xs" align="flex-end">
            <Text>/</Text>
            <TextInput
              value={state.pattern}
              onChange={(event) => handlePatternChange(event.currentTarget.value)}
              placeholder="Enter your regex pattern..."
              style={{ fontFamily: 'var(--font-geist-mono)', flex: 1 }}
              error={state.error}
            />
            <Text>/</Text>
            <Text style={{ fontFamily: 'var(--font-geist-mono)' }}>
              {Object.entries(state.flags)
                .filter(([, enabled]) => enabled)
                .map(([flag]) => {
                  switch (flag) {
                    case 'global': return 'g';
                    case 'ignoreCase': return 'i';
                    case 'multiline': return 'm';
                    case 'dotAll': return 's';
                    case 'unicode': return 'u';
                    case 'sticky': return 'y';
                    default: return '';
                  }
                })
                .join('')}
            </Text>
          </Group>
        </Stack>

        {/* Flags */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>Regex Flags</Text>
            <Group gap="md">
              {Object.entries(state.flags).map(([flag, enabled]) => (
                <Switch
                  key={flag}
                  checked={enabled}
                  onChange={() => handleFlagChange(flag as keyof typeof state.flags)}
                  label={flag.charAt(0).toUpperCase() + flag.slice(1)}
                  description={flagDescriptions[flag as keyof typeof flagDescriptions]}
                />
              ))}
            </Group>
          </Stack>
        </Card>

        {/* Error Display */}
        {state.error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            <Text fw={500}>Regex Error</Text>
            <Text size="sm">{state.error}</Text>
          </Alert>
        )}

        {/* Test String Input */}
        <Stack gap="xs">
          <Text fw={500}>Test String</Text>
          <Textarea
            value={state.testString}
            onChange={(event) => handleTestStringChange(event.currentTarget.value)}
            placeholder="Enter text to test against your regex..."
            minRows={6}
            maxRows={12}
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          />
        </Stack>

        {/* Highlighted Results */}
        {state.testString && state.isValid && (
          <Card>
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={600}>Match Results</Text>
                <Badge color={state.matches.length > 0 ? 'green' : 'gray'}>
                  {state.matches.length} match{state.matches.length !== 1 ? 'es' : ''}
                </Badge>
              </Group>
              
              <ScrollArea.Autosize mah={200}>
                <Text
                  style={{ 
                    fontFamily: 'var(--font-geist-mono)',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6
                  }}
                  size="sm"
                >
                  {getHighlightedText().map((part, index) => 
                    part.isMatch ? (
                      <span
                        key={index}
                        style={{
                          backgroundColor: 'var(--mantine-color-yellow-2)',
                          color: 'var(--mantine-color-dark-9)',
                          padding: '2px 4px',
                          borderRadius: '3px',
                          fontWeight: 600
                        }}
                        title={`Match ${(part.index || 0) + 1}`}
                      >
                        {part.text}
                      </span>
                    ) : (
                      <span key={index}>{part.text}</span>
                    )
                  )}
                </Text>
              </ScrollArea.Autosize>
            </Stack>
          </Card>
        )}

        {/* Match Details */}
        {state.matches.length > 0 && (
          <Card>
            <Stack gap="md">
              <Text fw={600}>Match Details</Text>
              <ScrollArea.Autosize mah={300}>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Match</Table.Th>
                      <Table.Th>Position</Table.Th>
                      <Table.Th>Length</Table.Th>
                      <Table.Th>Groups</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {state.matches.map((match, index) => (
                      <Table.Tr key={index}>
                        <Table.Td>
                          <Code style={{ fontFamily: 'var(--font-geist-mono)' }}>
                            {match.match}
                          </Code>
                        </Table.Td>
                        <Table.Td>{match.index}</Table.Td>
                        <Table.Td>{match.match.length}</Table.Td>
                        <Table.Td>
                          {match.groups.length > 0 ? (
                            <Stack gap="xs">
                              {match.groups.map((group, groupIndex) => (
                                <Code key={groupIndex}>
                                  ${groupIndex + 1}: {group || '(empty)'}
                                </Code>
                              ))}
                            </Stack>
                          ) : (
                            <Text size="sm" c="dimmed">No groups</Text>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <MantineCopyButton value={match.match} timeout={2000}>
                            {({ copied, copy }) => (
                              <Tooltip label={copied ? 'Copied!' : 'Copy match'}>
                                <ActionIcon
                                  color={copied ? 'teal' : 'gray'}
                                  variant="subtle"
                                  size="sm"
                                  onClick={() => {
                                    copy();
                                    notifications.show({
                                      title: 'Copied!',
                                      message: 'Match copied to clipboard',
                                      color: 'green'
                                    });
                                  }}
                                >
                                  {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                                </ActionIcon>
                              </Tooltip>
                            )}
                          </MantineCopyButton>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea.Autosize>
            </Stack>
          </Card>
        )}

        {/* Common Patterns */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>Common Regex Patterns</Text>
            <ScrollArea.Autosize mah={300}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Pattern</Table.Th>
                    <Table.Th>Regex</Table.Th>
                    <Table.Th>Description</Table.Th>
                    <Table.Th>Action</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {commonRegexPatterns.map((item) => (
                    <Table.Tr key={item.name}>
                      <Table.Td fw={500}>{item.name}</Table.Td>
                      <Table.Td>
                        <Code style={{ fontFamily: 'var(--font-geist-mono)' }}>
                          {item.pattern}
                        </Code>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">{item.description}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Button
                          size="xs"
                          variant="outline"
                          leftSection={<IconSearch size={14} />}
                          onClick={() => handlePatternChange(item.pattern)}
                        >
                          Use
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea.Autosize>
          </Stack>
        </Card>

        {/* Regex Information */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>Regex Reference</Text>
            <Group gap="md">
              <Stack gap="xs">
                <Text fw={500} size="sm">Character Classes</Text>
                <Text size="xs" c="dimmed">. - Any character except newline</Text>
                <Text size="xs" c="dimmed">\\d - Digit [0-9]</Text>
                <Text size="xs" c="dimmed">\\w - Word character [A-Za-z0-9_]</Text>
                <Text size="xs" c="dimmed">\\s - Whitespace</Text>
              </Stack>
              <Stack gap="xs">
                <Text fw={500} size="sm">Quantifiers</Text>
                <Text size="xs" c="dimmed">* - 0 or more</Text>
                <Text size="xs" c="dimmed">+ - 1 or more</Text>
                <Text size="xs" c="dimmed">? - 0 or 1</Text>
                <Text size="xs" c="dimmed">{'{n,m}'} - Between n and m</Text>
              </Stack>
              <Stack gap="xs">
                <Text fw={500} size="sm">Anchors</Text>
                <Text size="xs" c="dimmed">^ - Start of line</Text>
                <Text size="xs" c="dimmed">$ - End of line</Text>
                <Text size="xs" c="dimmed">\\b - Word boundary</Text>
              </Stack>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </ToolLayout>
  );
}