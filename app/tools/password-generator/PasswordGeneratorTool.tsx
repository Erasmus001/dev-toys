'use client';

import { useState, useCallback } from 'react';
import { 
  Stack, 
  Group, 
  Button, 
  NumberInput,
  Switch,
  Alert,
  CopyButton as MantineCopyButton,
  ActionIcon,
  Tooltip,
  Text,
  Divider,
  Progress,
  List,
  Card,
  TextInput,
  Badge
} from '@mantine/core';
import { IconCopy, IconCheck, IconRefresh, IconShield, IconShieldCheck } from '@tabler/icons-react';
import { ToolLayout } from '../../components/tools/ToolLayout';
import { PasswordGeneratorState, PasswordConfig, PasswordStrength } from '../../lib/types';
import { notifications } from '@mantine/notifications';

export function PasswordGeneratorTool() {
  const [state, setState] = useState<PasswordGeneratorState>({
    config: {
      length: 16,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeSimilar: false,
      customCharset: ''
    },
    generated: [],
    strength: {
      score: 0,
      label: 'Very Weak',
      color: 'red',
      feedback: []
    },
    history: []
  });

  const getCharacterSets = useCallback((config: PasswordConfig) => {
    const sets = {
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
      similar: 'il1Lo0O'
    };

    let charset = '';
    
    if (config.customCharset) {
      charset = config.customCharset;
    } else {
      if (config.includeLowercase) charset += sets.lowercase;
      if (config.includeUppercase) charset += sets.uppercase;
      if (config.includeNumbers) charset += sets.numbers;
      if (config.includeSymbols) charset += sets.symbols;
    }

    if (config.excludeSimilar && !config.customCharset) {
      charset = charset.split('').filter(char => !sets.similar.includes(char)).join('');
    }

    return charset;
  }, []);

  const calculatePasswordStrength = useCallback((password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push('Use at least 8 characters');

    if (password.length >= 12) score += 1;
    else if (password.length >= 8) feedback.push('Consider using 12+ characters for better security');

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Include uppercase letters');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Include numbers');

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('Include special characters');

    // No repeated characters
    if (!/(.)\1{2,}/.test(password)) score += 1;
    else feedback.push('Avoid repeated characters');

    // No common patterns
    if (!/123|abc|qwe|password|admin/i.test(password)) score += 1;
    else feedback.push('Avoid common patterns');

    const strength: PasswordStrength = {
      score,
      label: score >= 7 ? 'Very Strong' : score >= 5 ? 'Strong' : score >= 3 ? 'Medium' : score >= 1 ? 'Weak' : 'Very Weak',
      color: score >= 7 ? 'green' : score >= 5 ? 'blue' : score >= 3 ? 'yellow' : score >= 1 ? 'orange' : 'red',
      feedback
    };

    return strength;
  }, []);

  const generatePassword = useCallback(() => {
    const charset = getCharacterSets(state.config);
    
    if (!charset) {
      notifications.show({
        title: 'Error',
        message: 'No character set available. Please select at least one option.',
        color: 'red'
      });
      return;
    }

    let password = '';
    const crypto = window.crypto || (window as any).msCrypto;
    
    if (crypto && crypto.getRandomValues) {
      const array = new Uint8Array(state.config.length);
      crypto.getRandomValues(array);
      
      for (let i = 0; i < state.config.length; i++) {
        password += charset[array[i] % charset.length];
      }
    } else {
      // Fallback for older browsers
      for (let i = 0; i < state.config.length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
      }
    }

    const strength = calculatePasswordStrength(password);
    
    setState(prev => ({
      ...prev,
      generated: [password],
      strength,
      history: [password, ...prev.history.slice(0, 9)] // Keep last 10
    }));
  }, [state.config, getCharacterSets, calculatePasswordStrength]);

  const generateMultiple = useCallback((count: number = 5) => {
    const passwords: string[] = [];
    const charset = getCharacterSets(state.config);
    
    if (!charset) {
      notifications.show({
        title: 'Error',
        message: 'No character set available. Please select at least one option.',
        color: 'red'
      });
      return;
    }

    const crypto = window.crypto || (window as any).msCrypto;
    
    for (let p = 0; p < count; p++) {
      let password = '';
      
      if (crypto && crypto.getRandomValues) {
        const array = new Uint8Array(state.config.length);
        crypto.getRandomValues(array);
        
        for (let i = 0; i < state.config.length; i++) {
          password += charset[array[i] % charset.length];
        }
      } else {
        for (let i = 0; i < state.config.length; i++) {
          password += charset[Math.floor(Math.random() * charset.length)];
        }
      }
      
      passwords.push(password);
    }

    const strength = calculatePasswordStrength(passwords[0]);
    
    setState(prev => ({
      ...prev,
      generated: passwords,
      strength,
      history: [...passwords, ...prev.history].slice(0, 10)
    }));
  }, [state.config, getCharacterSets, calculatePasswordStrength]);

  const updateConfig = (updates: Partial<PasswordConfig>) => {
    setState(prev => ({
      ...prev,
      config: { ...prev.config, ...updates }
    }));
  };

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate secure passwords with customizable options and strength analysis"
      actions={
        <Group gap="sm">
          <Button 
            leftSection={<IconRefresh size={16} />}
            onClick={generatePassword}
          >
            Generate
          </Button>
          <Button 
            variant="outline" 
            onClick={() => generateMultiple(5)}
          >
            Generate 5
          </Button>
        </Group>
      }
    >
      <Stack gap="lg">
        {/* Configuration */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>Password Configuration</Text>
            
            <Group grow>
              <NumberInput
                label="Length"
                value={state.config.length}
                onChange={(value) => updateConfig({ length: Number(value) || 8 })}
                min={4}
                max={128}
                step={1}
              />
            </Group>

            <Group grow>
              <Switch
                checked={state.config.includeUppercase}
                onChange={(event) => updateConfig({ includeUppercase: event.currentTarget.checked })}
                label="Uppercase (A-Z)"
              />
              <Switch
                checked={state.config.includeLowercase}
                onChange={(event) => updateConfig({ includeLowercase: event.currentTarget.checked })}
                label="Lowercase (a-z)"
              />
            </Group>

            <Group grow>
              <Switch
                checked={state.config.includeNumbers}
                onChange={(event) => updateConfig({ includeNumbers: event.currentTarget.checked })}
                label="Numbers (0-9)"
              />
              <Switch
                checked={state.config.includeSymbols}
                onChange={(event) => updateConfig({ includeSymbols: event.currentTarget.checked })}
                label="Symbols (!@#$...)"
              />
            </Group>

            <Group grow>
              <Switch
                checked={state.config.excludeSimilar}
                onChange={(event) => updateConfig({ excludeSimilar: event.currentTarget.checked })}
                label="Exclude Similar"
                description="Exclude i, l, 1, L, o, 0, O"
              />
            </Group>

            <TextInput
              label="Custom Character Set (Optional)"
              placeholder="Enter custom characters to use..."
              value={state.config.customCharset}
              onChange={(event) => updateConfig({ customCharset: event.currentTarget.value })}
              description="Override default character sets with your own"
            />
          </Stack>
        </Card>

        {/* Generated Passwords */}
        {state.generated.length > 0 && (
          <Stack gap="md">
            <Group justify="space-between">
              <Text fw={600}>Generated Password{state.generated.length > 1 ? 's' : ''}</Text>
              <Badge 
                color={state.strength.color}
                leftSection={<IconShield size={14} />}
              >
                {state.strength.label}
              </Badge>
            </Group>

            {/* Strength Indicator */}
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm">Strength: {state.strength.score}/8</Text>
                <Text size="sm" c={state.strength.color}>
                  {state.strength.label}
                </Text>
              </Group>
              <Progress 
                value={(state.strength.score / 8) * 100} 
                color={state.strength.color}
                size="sm"
              />
              {state.strength.feedback.length > 0 && (
                <List size="sm" c="dimmed">
                  {state.strength.feedback.map((feedback, index) => (
                    <List.Item key={index}>{feedback}</List.Item>
                  ))}
                </List>
              )}
            </Stack>

            {/* Password List */}
            <Stack gap="xs">
              {state.generated.map((password, index) => (
                <Group key={index} justify="space-between" p="sm" 
                       style={{ backgroundColor: 'var(--mantine-color-gray-0)', borderRadius: 'var(--mantine-radius-sm)' }}>
                  <Text 
                    style={{ fontFamily: 'var(--font-geist-mono)', wordBreak: 'break-all' }}
                    flex={1}
                  >
                    {password}
                  </Text>
                  <MantineCopyButton value={password} timeout={2000}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? 'Copied!' : 'Copy password'}>
                        <ActionIcon
                          color={copied ? 'teal' : 'gray'}
                          variant="subtle"
                          onClick={() => {
                            copy();
                            notifications.show({
                              title: 'Copied!',
                              message: 'Password copied to clipboard',
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
              ))}
            </Stack>
          </Stack>
        )}

        {/* Recent History */}
        {state.history.length > 0 && (
          <Stack gap="md">
            <Text fw={600}>Recent Passwords</Text>
            <Stack gap="xs">
              {state.history.slice(0, 5).map((password, index) => (
                <Group key={index} justify="space-between" p="xs" 
                       style={{ backgroundColor: 'var(--mantine-color-gray-0)', borderRadius: 'var(--mantine-radius-sm)' }}>
                  <Text 
                    size="sm"
                    c="dimmed"
                    style={{ fontFamily: 'var(--font-geist-mono)', wordBreak: 'break-all' }}
                    flex={1}
                  >
                    {password}
                  </Text>
                  <MantineCopyButton value={password} timeout={2000}>
                    {({ copied, copy }) => (
                      <ActionIcon
                        size="sm"
                        color={copied ? 'teal' : 'gray'}
                        variant="subtle"
                        onClick={copy}
                      >
                        {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                      </ActionIcon>
                    )}
                  </MantineCopyButton>
                </Group>
              ))}
            </Stack>
          </Stack>
        )}
      </Stack>
    </ToolLayout>
  );
}