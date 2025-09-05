'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Stack, Group, Paper, Title, Text, Textarea, Select, Button, Switch,
  Badge, Alert, Tabs, CopyButton, Card, Code, Table, Loader,
} from '@mantine/core';
import {
  IconCheck, IconX, IconCopy, IconDownload, IconRefresh,
  IconAlertTriangle, IconBug, IconCodePlus, IconFileCode,
} from '@tabler/icons-react';
import { Dropzone } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { useDebouncedValue } from '@mantine/hooks';

interface LintMessage {
  line: number;
  column: number;
  ruleId: string | null;
  severity: 1 | 2;
  message: string;
  fix?: { range: [number, number]; text: string; };
}

interface LintResult {
  messages: LintMessage[];
  errorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
}

const RULE_CONFIGS = {
  recommended: {
    name: 'ESLint Recommended',
    description: 'Core ESLint recommended rules',
    rules: {
      'no-unused-vars': 2, 'no-undef': 2, 'no-console': 1, 'no-debugger': 2,
      'no-alert': 1, 'no-var': 2, 'prefer-const': 2, 'eqeqeq': 2, 'curly': 2, 'no-eval': 2,
    }
  },
  airbnb: {
    name: 'Airbnb Style Guide',
    description: 'Airbnb JavaScript Style Guide rules',
    rules: {
      'no-unused-vars': 2, 'no-undef': 2, 'no-console': 1, 'no-debugger': 2,
      'no-alert': 1, 'no-var': 2, 'prefer-const': 2, 'eqeqeq': 2, 'curly': 2, 'no-eval': 2,
      'indent': [2, 2], 'quotes': [2, 'single'], 'semi': [2, 'always'],
      'comma-dangle': [2, 'always-multiline'], 'no-trailing-spaces': 2,
    }
  },
  strict: {
    name: 'Strict Rules',
    description: 'Stricter linting with additional checks',
    rules: {
      'no-unused-vars': 2, 'no-undef': 2, 'no-console': 2, 'no-debugger': 2,
      'no-alert': 2, 'no-var': 2, 'prefer-const': 2, 'eqeqeq': 2, 'curly': 2, 'no-eval': 2,
      'no-magic-numbers': 1, 'complexity': [1, 10], 'max-len': [1, { code: 100 }],
      'no-duplicate-imports': 2, 'no-empty': 2, 'no-unreachable': 2,
    }
  }
};

class SimpleLinter {
  private rules: Record<string, any>;

  constructor(config: Record<string, any>) {
    this.rules = config.rules || {};
  }

  verify(code: string): LintMessage[] {
    const messages: LintMessage[] = [];
    const lines = code.split('\n');

    lines.forEach((line, lineIndex) => {
      const lineNumber = lineIndex + 1;
      this.checkNoConsole(line, lineNumber, messages);
      this.checkNoDebugger(line, lineNumber, messages);
      this.checkNoVar(line, lineNumber, messages);
      this.checkQuotes(line, lineNumber, messages);
      this.checkSemi(line, lineNumber, messages);
      this.checkTrailingSpaces(line, lineNumber, messages);
      this.checkNoAlert(line, lineNumber, messages);
      this.checkEqEqEq(line, lineNumber, messages);
      this.checkMaxLength(line, lineNumber, messages);
    });

    return messages;
  }

  verifyAndFix(code: string): { output: string; messages: LintMessage[] } {
    const messages = this.verify(code);
    let output = code;
    const lines = output.split('\n');

    // Apply fixes
    const fixableMessages = messages.filter(m => m.fix);
    fixableMessages.reverse().forEach(message => {
      const lineIndex = message.line - 1;
      if (message.ruleId === 'no-debugger' && lines[lineIndex]) {
        lines[lineIndex] = lines[lineIndex].replace(/debugger;?/, '').trim();
      } else if (message.ruleId === 'no-var' && lines[lineIndex]) {
        lines[lineIndex] = lines[lineIndex].replace(/\bvar\s+/, 'let ');
      } else if (message.ruleId === 'quotes' && lines[lineIndex]) {
        lines[lineIndex] = lines[lineIndex].replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, "'$1'");
      } else if (message.ruleId === 'semi' && lines[lineIndex]) {
        lines[lineIndex] = lines[lineIndex].trimEnd() + ';';
      } else if (message.ruleId === 'no-trailing-spaces' && lines[lineIndex]) {
        lines[lineIndex] = lines[lineIndex].trimEnd();
      } else if (message.ruleId === 'eqeqeq' && lines[lineIndex]) {
        lines[lineIndex] = lines[lineIndex].replace(/([^!])={2}([^=])/g, '$1===$2').replace(/^={2}([^=])/, '===$1');
        lines[lineIndex] = lines[lineIndex].replace(/([^!])!={1}([^=])/g, '$1!==$2').replace(/^!={1}([^=])/, '!==$1');
      }
    });

    output = lines.join('\n');
    const remainingMessages = messages.filter(m => !m.fix);
    return { output, messages: remainingMessages };
  }

  private checkNoConsole(line: string, lineNumber: number, messages: LintMessage[]) {
    if (!this.isRuleEnabled('no-console')) return;
    const match = line.match(/console\./);
    if (match) {
      messages.push({
        line: lineNumber, column: match.index! + 1, ruleId: 'no-console',
        severity: this.getRuleSeverity('no-console'), message: 'Unexpected console statement.',
      });
    }
  }

  private checkNoDebugger(line: string, lineNumber: number, messages: LintMessage[]) {
    if (!this.isRuleEnabled('no-debugger')) return;
    const match = line.match(/debugger/);
    if (match) {
      messages.push({
        line: lineNumber, column: match.index! + 1, ruleId: 'no-debugger',
        severity: this.getRuleSeverity('no-debugger'), message: 'Unexpected debugger statement.',
        fix: { range: [0, 0], text: '' }
      });
    }
  }

  private checkNoVar(line: string, lineNumber: number, messages: LintMessage[]) {
    if (!this.isRuleEnabled('no-var')) return;
    const match = line.match(/\bvar\s+/);
    if (match) {
      messages.push({
        line: lineNumber, column: match.index! + 1, ruleId: 'no-var',
        severity: this.getRuleSeverity('no-var'), message: 'Unexpected var, use let or const instead.',
        fix: { range: [0, 0], text: '' }
      });
    }
  }

  private checkQuotes(line: string, lineNumber: number, messages: LintMessage[]) {
    if (!this.isRuleEnabled('quotes')) return;
    const rule = this.rules.quotes;
    if (Array.isArray(rule) && rule[1] === 'single') {
      const matches = line.matchAll(/"([^"\\]*(\\.[^"\\]*)*)"/g);
      for (const match of matches) {
        messages.push({
          line: lineNumber, column: match.index! + 1, ruleId: 'quotes',
          severity: this.getRuleSeverity('quotes'), message: 'Strings must use singlequote.',
          fix: { range: [0, 0], text: '' }
        });
      }
    }
  }

  private checkSemi(line: string, lineNumber: number, messages: LintMessage[]) {
    if (!this.isRuleEnabled('semi')) return;
    const rule = this.rules.semi;
    if (Array.isArray(rule) && rule[1] === 'always') {
      const trimmed = line.trim();
      if (trimmed && !trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith('}') &&
          !trimmed.startsWith('//') && !trimmed.startsWith('/*') &&
          !/^(if|for|while|function|class|import|export|const|let|var)/.test(trimmed)) {
        messages.push({
          line: lineNumber, column: line.length, ruleId: 'semi',
          severity: this.getRuleSeverity('semi'), message: 'Missing semicolon.',
          fix: { range: [0, 0], text: '' }
        });
      }
    }
  }

  private checkTrailingSpaces(line: string, lineNumber: number, messages: LintMessage[]) {
    if (!this.isRuleEnabled('no-trailing-spaces')) return;
    const match = line.match(/\s+$/);
    if (match) {
      messages.push({
        line: lineNumber, column: line.length - match[0].length + 1, ruleId: 'no-trailing-spaces',
        severity: this.getRuleSeverity('no-trailing-spaces'), message: 'Trailing spaces not allowed.',
        fix: { range: [0, 0], text: '' }
      });
    }
  }

  private checkNoAlert(line: string, lineNumber: number, messages: LintMessage[]) {
    if (!this.isRuleEnabled('no-alert')) return;
    const match = line.match(/\b(alert|confirm|prompt)\s*\(/);
    if (match) {
      messages.push({
        line: lineNumber, column: match.index! + 1, ruleId: 'no-alert',
        severity: this.getRuleSeverity('no-alert'), message: `Unexpected ${match[1]}.`,
      });
    }
  }

  private checkEqEqEq(line: string, lineNumber: number, messages: LintMessage[]) {
    if (!this.isRuleEnabled('eqeqeq')) return;
    const matches = line.matchAll(/([^!])={2}([^=])|^={2}([^=])/g);
    for (const match of matches) {
      messages.push({
        line: lineNumber, column: match.index! + (match[1] ? 2 : 1), ruleId: 'eqeqeq',
        severity: this.getRuleSeverity('eqeqeq'), message: 'Expected === and instead saw ==.',
        fix: { range: [0, 0], text: '' }
      });
    }
  }

  private checkMaxLength(line: string, lineNumber: number, messages: LintMessage[]) {
    if (!this.isRuleEnabled('max-len')) return;
    const rule = this.rules['max-len'];
    let maxLen = 80;
    
    if (Array.isArray(rule) && rule[1] && typeof rule[1] === 'object') {
      maxLen = rule[1].code || 80;
    } else if (Array.isArray(rule) && typeof rule[1] === 'number') {
      maxLen = rule[1];
    }

    if (line.length > maxLen) {
      messages.push({
        line: lineNumber, column: maxLen + 1, ruleId: 'max-len',
        severity: this.getRuleSeverity('max-len'),
        message: `Line ${lineNumber} exceeds the maximum line length of ${maxLen}.`,
      });
    }
  }

  private isRuleEnabled(ruleId: string): boolean {
    const rule = this.rules[ruleId];
    return rule === 1 || rule === 2 || (Array.isArray(rule) && (rule[0] === 1 || rule[0] === 2));
  }

  private getRuleSeverity(ruleId: string): 1 | 2 {
    const rule = this.rules[ruleId];
    if (rule === 1 || rule === 2) return rule;
    if (Array.isArray(rule)) return rule[0] || 1;
    return 1;
  }
}

export default function ESLintRuleCheckerTool() {
  const [code, setCode] = useState('');
  const [selectedConfig, setSelectedConfig] = useState<keyof typeof RULE_CONFIGS>('recommended');
  const [isTypeScript, setIsTypeScript] = useState(false);
  const [customRules, setCustomRules] = useState('{}');
  const [lintResult, setLintResult] = useState<LintResult | null>(null);
  const [fixedCode, setFixedCode] = useState('');
  const [isLinting, setIsLinting] = useState(false);
  const [autoLint, setAutoLint] = useState(true);
  const [activeTab, setActiveTab] = useState('input');

  const [debouncedCode] = useDebouncedValue(code, 500);
  const linterRef = useRef<SimpleLinter | null>(null);

  useEffect(() => {
    try {
      const baseConfig = RULE_CONFIGS[selectedConfig];
      let mergedRules = { ...baseConfig.rules };

      try {
        const parsedCustomRules = JSON.parse(customRules);
        if (parsedCustomRules && typeof parsedCustomRules === 'object') {
          mergedRules = { ...mergedRules, ...parsedCustomRules };
        }
      } catch {
        // Invalid JSON in custom rules, ignore
      }

      linterRef.current = new SimpleLinter({ rules: mergedRules });
    } catch (error) {
      console.error('Failed to initialize linter:', error);
    }
  }, [selectedConfig, customRules]);

  useEffect(() => {
    if (autoLint && debouncedCode && linterRef.current) {
      runLint();
    }
  }, [debouncedCode, autoLint]);

  const runLint = useCallback(async () => {
    if (!code.trim() || !linterRef.current) {
      setLintResult(null);
      return;
    }

    setIsLinting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const messages = linterRef.current.verify(code);
      const errorCount = messages.filter(m => m.severity === 2).length;
      const warningCount = messages.filter(m => m.severity === 1).length;
      const fixableErrorCount = messages.filter(m => m.severity === 2 && m.fix).length;
      const fixableWarningCount = messages.filter(m => m.severity === 1 && m.fix).length;

      setLintResult({ messages, errorCount, warningCount, fixableErrorCount, fixableWarningCount });
    } catch (error) {
      notifications.show({
        title: 'Linting Error', message: 'An error occurred while linting the code',
        color: 'red', icon: <IconX size={16} />,
      });
    } finally {
      setIsLinting(false);
    }
  }, [code]);

  const applyFixes = useCallback(() => {
    if (!linterRef.current) return;

    try {
      const { output, messages } = linterRef.current.verifyAndFix(code);
      setFixedCode(output);
      
      const errorCount = messages.filter(m => m.severity === 2).length;
      const warningCount = messages.filter(m => m.severity === 1).length;

      setLintResult({ messages, errorCount, warningCount, fixableErrorCount: 0, fixableWarningCount: 0 });
      setActiveTab('fixed');

      notifications.show({
        title: 'Fixes Applied', message: 'Auto-fixable issues have been resolved',
        color: 'green', icon: <IconCheck size={16} />,
      });
    } catch (error) {
      notifications.show({
        title: 'Fix Error', message: 'Failed to apply automatic fixes',
        color: 'red', icon: <IconX size={16} />,
      });
    }
  }, [code]);

  const handleFileUpload = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCode(content);
      setIsTypeScript(file.name.endsWith('.ts') || file.name.endsWith('.tsx'));
    };
    reader.readAsText(file);
  }, []);

  const downloadCode = useCallback((codeToDownload: string, filename: string) => {
    const blob = new Blob([codeToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    notifications.show({
      title: 'Download Complete', message: `File saved as ${filename}`,
      color: 'green', icon: <IconCheck size={16} />,
    });
  }, []);

  const clearCode = () => {
    setCode('');
    setFixedCode('');
    setLintResult(null);
    setActiveTab('input');
  };

  const getSeverityColor = (severity: 1 | 2) => severity === 2 ? 'red' : 'yellow';
  const getSeverityIcon = (severity: 1 | 2) => severity === 2 ? <IconX size={16} /> : <IconAlertTriangle size={16} />;

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <div>
          <Title order={2}>ESLint Rule Checker</Title>
          <Text c="dimmed">
            Check JavaScript and TypeScript code against common linting rules with auto-fix support
          </Text>
        </div>
        <Group>
          <Switch label="Auto-lint" checked={autoLint}
            onChange={(event) => setAutoLint(event.currentTarget.checked)} />
          <Switch label="TypeScript" checked={isTypeScript}
            onChange={(event) => setIsTypeScript(event.currentTarget.checked)} />
        </Group>
      </Group>

      {/* Configuration */}
      <Card withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={4}>Configuration</Title>
            <Button leftSection={<IconRefresh size={16} />} variant="light" onClick={clearCode} size="sm">
              Clear
            </Button>
          </Group>
          
          <Select label="Rule Configuration" value={selectedConfig}
            onChange={(value) => setSelectedConfig(value as keyof typeof RULE_CONFIGS)}
            data={Object.entries(RULE_CONFIGS).map(([key, config]) => ({ value: key, label: config.name }))}
            description={RULE_CONFIGS[selectedConfig].description} />

          <Textarea label="Custom Rules (JSON)" placeholder='{"rule-name": 2, "another-rule": [1, "option"]}'
            value={customRules} onChange={(event) => setCustomRules(event.currentTarget.value)}
            minRows={2} maxRows={4} description="Override or add custom ESLint rules in JSON format" />
        </Stack>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onChange={(value) => value && setActiveTab(value)}>
        <Tabs.List>
          <Tabs.Tab value="input" leftSection={<IconFileCode size={16} />}>Code Input</Tabs.Tab>
          <Tabs.Tab value="results" leftSection={<IconBug size={16} />}>
            Lint Results
            {lintResult && (
              <Badge size="xs" ml="xs" color={lintResult.errorCount > 0 ? 'red' : lintResult.warningCount > 0 ? 'yellow' : 'green'}>
                {lintResult.errorCount + lintResult.warningCount}
              </Badge>
            )}
          </Tabs.Tab>
          <Tabs.Tab value="fixed" leftSection={<IconCodePlus size={16} />}>
            Fixed Code
            {fixedCode && <Badge size="xs" ml="xs" color="green">Available</Badge>}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="input" pt="md">
          <Stack gap="md">
            <Dropzone onDrop={handleFileUpload} accept={['.js', '.ts', '.jsx', '.tsx']} maxFiles={1}>
              <Group justify="center" gap="xl" mih={60} style={{ pointerEvents: 'none' }}>
                <div>
                  <Text size="xl" inline>Drop JavaScript/TypeScript files here or click to select</Text>
                  <Text size="sm" c="dimmed" inline mt={7}>Supported formats: .js, .ts, .jsx, .tsx</Text>
                </div>
              </Group>
            </Dropzone>

            <Textarea label="JavaScript/TypeScript Code"
              placeholder={`// Paste your ${isTypeScript ? 'TypeScript' : 'JavaScript'} code here\nfunction example() {\n  var message = "Hello World"\n  console.log(message)\n}`}
              value={code} onChange={(event) => setCode(event.currentTarget.value)}
              minRows={15} maxRows={25} style={{ fontFamily: 'var(--font-geist-mono)' }} />

            <Group justify="space-between">
              <Group>
                <Button leftSection={isLinting ? <Loader size={16} /> : <IconBug size={16} />}
                  onClick={runLint} disabled={!code.trim() || isLinting} loading={isLinting}>
                  {isLinting ? 'Linting...' : 'Run Lint'}
                </Button>
                
                {lintResult && (lintResult.fixableErrorCount > 0 || lintResult.fixableWarningCount > 0) && (
                  <Button leftSection={<IconCodePlus size={16} />} variant="light" onClick={applyFixes}>
                    Apply Fixes ({lintResult.fixableErrorCount + lintResult.fixableWarningCount})
                  </Button>
                )}
              </Group>

              <CopyButton value={code}>
                {({ copied, copy }) => (
                  <Button leftSection={<IconCopy size={16} />} variant="subtle" onClick={copy} disabled={!code.trim()}>
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                )}
              </CopyButton>
            </Group>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="results" pt="md">
          <Stack gap="md">
            {lintResult && (
              <Group>
                <Badge color={lintResult.errorCount > 0 ? 'red' : 'gray'} size="lg">
                  {lintResult.errorCount} Errors
                </Badge>
                <Badge color={lintResult.warningCount > 0 ? 'yellow' : 'gray'} size="lg">
                  {lintResult.warningCount} Warnings
                </Badge>
                <Badge color="blue" size="lg">
                  {lintResult.fixableErrorCount + lintResult.fixableWarningCount} Fixable
                </Badge>
              </Group>
            )}

            {lintResult && lintResult.messages.length > 0 ? (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Line:Col</Table.Th>
                    <Table.Th>Severity</Table.Th>
                    <Table.Th>Rule</Table.Th>
                    <Table.Th>Message</Table.Th>
                    <Table.Th>Fixable</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {lintResult.messages.map((message, index) => (
                    <Table.Tr key={index}>
                      <Table.Td><Code>{message.line}:{message.column}</Code></Table.Td>
                      <Table.Td>
                        <Badge color={getSeverityColor(message.severity)} leftSection={getSeverityIcon(message.severity)} variant="light">
                          {message.severity === 2 ? 'Error' : 'Warning'}
                        </Badge>
                      </Table.Td>
                      <Table.Td><Code color="blue">{message.ruleId || 'unknown'}</Code></Table.Td>
                      <Table.Td><Text size="sm">{message.message}</Text></Table.Td>
                      <Table.Td>
                        {message.fix ? <IconCheck size={16} color="green" /> : <IconX size={16} color="gray" />}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            ) : lintResult ? (
              <Alert icon={<IconCheck size={16} />} title="Clean Code!" color="green">
                No linting errors or warnings found. Your code looks good!
              </Alert>
            ) : (
              <Alert icon={<IconBug size={16} />} title="No Results" color="blue">
                Run the linter to see results here.
              </Alert>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="fixed" pt="md">
          <Stack gap="md">
            {fixedCode ? (
              <>
                <Group justify="space-between">
                  <Text fw={500}>Auto-Fixed Code</Text>
                  <Group>
                    <CopyButton value={fixedCode}>
                      {({ copied, copy }) => (
                        <Button leftSection={<IconCopy size={16} />} variant="light" onClick={copy}>
                          {copied ? 'Copied!' : 'Copy Fixed Code'}
                        </Button>
                      )}
                    </CopyButton>
                    <Button leftSection={<IconDownload size={16} />} variant="outline"
                      onClick={() => downloadCode(fixedCode, `fixed-code.${isTypeScript ? 'ts' : 'js'}`)}>
                      Download
                    </Button>
                  </Group>
                </Group>

                <Code block style={{ fontFamily: 'var(--font-geist-mono)' }}>{fixedCode}</Code>
              </>
            ) : (
              <Alert icon={<IconCodePlus size={16} />} title="No Fixed Code" color="blue">
                Apply fixes to see the corrected code here.
              </Alert>
            )}
          </Stack>
        </Tabs.Panel>
      </Tabs>

      <Alert icon={<IconBug size={16} />} title="About ESLint Rules" color="blue">
        <Text size="sm">
          This tool performs client-side linting using simplified versions of common ESLint rules:
          <br />• <strong>Recommended:</strong> Core ESLint rules for catching common errors
          <br />• <strong>Airbnb:</strong> Popular style guide with formatting rules
          <br />• <strong>Strict:</strong> Additional rules for code quality and complexity
          <br />All processing happens in your browser - no code is sent to servers.
        </Text>
      </Alert>
    </Stack>
  );
}