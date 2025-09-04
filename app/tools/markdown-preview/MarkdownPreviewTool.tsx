'use client';

import { useState, useEffect } from 'react';
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
  SegmentedControl,
  Paper,
  ScrollArea
} from '@mantine/core';
import { IconCopy, IconCheck, IconAlertCircle, IconEye, IconEdit, IconColumns } from '@tabler/icons-react';
import { ToolLayout } from '../../components/tools/ToolLayout';
import { MarkdownPreviewState } from '../../lib/types';
import { notifications } from '@mantine/notifications';
import { marked } from 'marked';

export function MarkdownPreviewTool() {
  const [state, setState] = useState<MarkdownPreviewState>({
    input: '',
    output: '',
    isValid: true,
    error: undefined,
    viewMode: 'split',
    theme: 'light'
  });

  const sampleMarkdown = `# Markdown Preview Demo

This is a **sample markdown** document to demonstrate the preview functionality.

## Features

- **Bold text**
- *Italic text*
- \`inline code\`
- [Links](https://example.com)

### Code Block

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Lists

1. First item
2. Second item
3. Third item

- Unordered item
- Another item
  - Nested item

### Table

| Feature | Status |
|---------|--------|
| Preview | ✅ |
| Editor | ✅ |
| Export | ⏳ |

### Blockquote

> This is a blockquote example.
> It can span multiple lines.

---

That's all for now!`;

  useEffect(() => {
    if (state.input.trim()) {
      processMarkdown(state.input);
    } else {
      setState(prev => ({ ...prev, output: '', isValid: true, error: undefined }));
    }
  }, [state.input]);

  const processMarkdown = async (markdown: string) => {
    try {
      // Configure marked options
      marked.setOptions({
        breaks: true,
        gfm: true
      });

      const html = await marked.parse(markdown);
      
      setState(prev => ({
        ...prev,
        output: html,
        isValid: true,
        error: undefined
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse markdown';
      setState(prev => ({
        ...prev,
        output: '',
        isValid: false,
        error: errorMessage
      }));
    }
  };

  const handleInputChange = (value: string) => {
    setState(prev => ({ ...prev, input: value }));
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
    setState(prev => ({ ...prev, input: sampleMarkdown }));
  };

  const copyMarkdown = () => {
    navigator.clipboard.writeText(state.input);
    notifications.show({
      title: 'Copied!',
      message: 'Markdown copied to clipboard',
      color: 'green'
    });
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(state.output);
    notifications.show({
      title: 'Copied!',
      message: 'HTML copied to clipboard',
      color: 'green'
    });
  };

  const renderPreview = () => (
    <ScrollArea h={500}>
      <Paper p="md" style={{ minHeight: '500px' }}>
        {state.output ? (
          <div 
            dangerouslySetInnerHTML={{ __html: state.output }}
            style={{
              lineHeight: 1.6,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          />
        ) : (
          <Text c="dimmed" ta="center" mt="xl">
            Preview will appear here...
          </Text>
        )}
      </Paper>
    </ScrollArea>
  );

  const renderEditor = () => (
    <Textarea
      value={state.input}
      onChange={(event) => handleInputChange(event.currentTarget.value)}
      placeholder="Enter your markdown here..."
      minRows={20}
      maxRows={25}
      style={{ fontFamily: 'var(--font-geist-mono)' }}
    />
  );

  return (
    <ToolLayout
      title="Markdown Preview"
      description="Live preview of Markdown with split-pane editor"
      actions={
        <Group gap="sm">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="outline" onClick={loadSample}>
            Load Sample
          </Button>
          {state.input && (
            <Button onClick={copyMarkdown} leftSection={<IconCopy size={16} />}>
              Copy Markdown
            </Button>
          )}
          {state.output && (
            <Button onClick={copyHtml} leftSection={<IconCopy size={16} />}>
              Copy HTML
            </Button>
          )}
        </Group>
      }
    >
      <Stack gap="lg">
        {/* View Mode Selector */}
        <Card>
          <Group justify="space-between">
            <Text fw={600}>View Mode</Text>
            <SegmentedControl
              value={state.viewMode}
              onChange={(value) => setState(prev => ({ ...prev, viewMode: value as any }))}
              data={[
                { label: 'Editor', value: 'editor' },
                { label: 'Split', value: 'split' },
                { label: 'Preview', value: 'preview' }
              ]}
            />
          </Group>
        </Card>

        {/* Error Display */}
        {state.error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            <Text fw={500}>Parsing Error</Text>
            <Text size="sm">{state.error}</Text>
          </Alert>
        )}

        {/* Main Content Area */}
        {state.viewMode === 'split' && (
          <Group grow align="flex-start" gap="lg">
            <Stack gap="xs">
              <Group justify="space-between">
                <Text fw={500}>Markdown Editor</Text>
                {state.input && (
                  <MantineCopyButton value={state.input} timeout={2000}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? 'Copied!' : 'Copy markdown'}>
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
              {renderEditor()}
            </Stack>

            <Stack gap="xs">
              <Group justify="space-between">
                <Text fw={500}>Preview</Text>
                {state.output && (
                  <MantineCopyButton value={state.output} timeout={2000}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? 'Copied!' : 'Copy HTML'}>
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
              {renderPreview()}
            </Stack>
          </Group>
        )}

        {state.viewMode === 'editor' && (
          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500}>Markdown Editor</Text>
              {state.input && (
                <MantineCopyButton value={state.input} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Copied!' : 'Copy markdown'}>
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
            {renderEditor()}
          </Stack>
        )}

        {state.viewMode === 'preview' && (
          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500}>Preview</Text>
              {state.output && (
                <MantineCopyButton value={state.output} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Copied!' : 'Copy HTML'}>
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
            {renderPreview()}
          </Stack>
        )}

        {/* Markdown Reference */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>Markdown Reference</Text>
            <Stack gap="sm">
              <Group gap="md">
                <Text size="sm"><strong>Headers:</strong> # ## ###</Text>
                <Text size="sm"><strong>Bold:</strong> **text**</Text>
                <Text size="sm"><strong>Italic:</strong> *text*</Text>
              </Group>
              <Group gap="md">
                <Text size="sm"><strong>Code:</strong> `code`</Text>
                <Text size="sm"><strong>Link:</strong> [text](url)</Text>
                <Text size="sm"><strong>Image:</strong> ![alt](url)</Text>
              </Group>
              <Group gap="md">
                <Text size="sm"><strong>List:</strong> - item</Text>
                <Text size="sm"><strong>Quote:</strong> {`>`} text</Text>
                <Text size="sm"><strong>Table:</strong> | col1 | col2 |</Text>
              </Group>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </ToolLayout>
  );
}