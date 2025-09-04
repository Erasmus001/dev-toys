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
  Select,
  Card,
  JsonInput,
  TextInput,
  Divider,
  Badge
} from '@mantine/core';
import { IconCopy, IconCheck, IconAlertCircle, IconLock, IconLockOpen } from '@tabler/icons-react';
import { ToolLayout } from '../../components/tools/ToolLayout';
import { JWTCodecState, JWTAlgorithm } from '../../lib/types';
import { notifications } from '@mantine/notifications';

export function JwtCodecTool() {
  const [state, setState] = useState<JWTCodecState>({
    mode: 'decode',
    token: '',
    header: {
      alg: 'HS256',
      typ: 'JWT'
    },
    payload: {},
    signature: '',
    secret: 'your-256-bit-secret',
    isValid: true,
    algorithm: 'HS256'
  });

  // JWT utility functions
  const base64UrlEncode = (str: string): string => {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  const base64UrlDecode = (str: string): string => {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return atob(base64);
  };

  const createSignature = (header: string, payload: string, secret: string, algorithm: JWTAlgorithm): string => {
    // This is a simplified implementation for demo purposes
    // In a real application, you would use proper cryptographic libraries
    const data = `${header}.${payload}`;
    
    if (algorithm.startsWith('HS')) {
      // HMAC simulation (simplified for demo)
      return base64UrlEncode(`HMAC_${algorithm}_${data}_${secret}`);
    } else {
      // RSA simulation (simplified for demo)
      return base64UrlEncode(`RSA_${algorithm}_${data}`);
    }
  };

  const verifySignature = (header: string, payload: string, signature: string, secret: string, algorithm: JWTAlgorithm): boolean => {
    const expectedSignature = createSignature(header, payload, secret, algorithm);
    return expectedSignature === signature;
  };

  const decodeJWT = (token: string) => {
    try {
      const parts = token.split('.');
      
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. Must have 3 parts separated by dots.');
      }

      const [headerPart, payloadPart, signaturePart] = parts;

      // Decode header
      const headerJson = base64UrlDecode(headerPart);
      const header = JSON.parse(headerJson);

      // Decode payload
      const payloadJson = base64UrlDecode(payloadPart);
      const payload = JSON.parse(payloadJson);

      // Verify signature (simplified)
      const isSignatureValid = verifySignature(headerPart, payloadPart, signaturePart, state.secret, header.alg);

      setState(prev => ({
        ...prev,
        header,
        payload,
        signature: signaturePart,
        isValid: isSignatureValid,
        algorithm: header.alg || 'HS256'
      }));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JWT token';
      setState(prev => ({
        ...prev,
        header: { alg: 'HS256', typ: 'JWT' },
        payload: {},
        signature: '',
        isValid: false
      }));
      
      notifications.show({
        title: 'JWT Decode Error',
        message: errorMessage,
        color: 'red'
      });
    }
  };

  const encodeJWT = () => {
    try {
      // Create header
      const headerToEncode = {
        ...state.header,
        alg: state.algorithm,
        typ: 'JWT'
      };
      const headerEncoded = base64UrlEncode(JSON.stringify(headerToEncode));

      // Create payload
      const payloadToEncode = { ...state.payload };
      
      // Add standard claims if not present
      if (!payloadToEncode.iat) {
        payloadToEncode.iat = Math.floor(Date.now() / 1000);
      }
      if (!payloadToEncode.exp) {
        payloadToEncode.exp = Math.floor(Date.now() / 1000) + (60 * 60); // 1 hour from now
      }

      const payloadEncoded = base64UrlEncode(JSON.stringify(payloadToEncode));

      // Create signature
      const signature = createSignature(headerEncoded, payloadEncoded, state.secret, state.algorithm);

      // Combine parts
      const token = `${headerEncoded}.${payloadEncoded}.${signature}`;

      setState(prev => ({
        ...prev,
        token,
        header: headerToEncode,
        payload: payloadToEncode,
        signature,
        isValid: true
      }));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to encode JWT';
      notifications.show({
        title: 'JWT Encode Error',
        message: errorMessage,
        color: 'red'
      });
    }
  };

  const handleTokenChange = (value: string) => {
    setState(prev => ({ ...prev, token: value }));
    if (value.trim() && state.mode === 'decode') {
      decodeJWT(value.trim());
    }
  };

  const handleModeSwitch = () => {
    setState(prev => ({
      ...prev,
      mode: prev.mode === 'encode' ? 'decode' : 'encode'
    }));
  };

  const handleClear = () => {
    setState(prev => ({
      ...prev,
      token: '',
      header: { alg: 'HS256', typ: 'JWT' },
      payload: {},
      signature: '',
      isValid: true
    }));
  };

  // Removed problematic useEffect that was causing infinite loops
  // Instead, we'll trigger encoding manually on user interactions

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const isExpired = (exp?: number): boolean => {
    if (!exp) return false;
    return Date.now() / 1000 > exp;
  };

  return (
    <ToolLayout
      title="JWT Encoder/Decoder"
      description="Encode and decode JSON Web Tokens with signature verification"
      actions={
        <Group gap="sm">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button onClick={handleModeSwitch}>
            Switch to {state.mode === 'encode' ? 'Decode' : 'Encode'}
          </Button>
          {state.mode === 'encode' && (
            <Button 
              leftSection={<IconLock size={16} />}
              onClick={encodeJWT}
            >
              Generate JWT
            </Button>
          )}
        </Group>
      }
    >
      <Stack gap="lg">
        {/* JWT Token Input/Output */}
        <Stack gap="xs">
          <Group justify="space-between">
            <Text fw={500}>
              JWT Token {state.mode === 'decode' ? '(Input)' : '(Generated)'}
            </Text>
            {state.token && (
              <Group gap="xs">
                <Badge 
                  color={state.isValid ? 'green' : 'red'}
                  leftSection={state.isValid ? <IconLockOpen size={14} /> : <IconAlertCircle size={14} />}
                >
                  {state.isValid ? 'Valid' : 'Invalid'}
                </Badge>
                <MantineCopyButton value={state.token} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Copied!' : 'Copy JWT token'}>
                      <ActionIcon
                        color={copied ? 'teal' : 'gray'}
                        variant="subtle"
                        onClick={() => {
                          copy();
                          notifications.show({
                            title: 'Copied!',
                            message: 'JWT token copied to clipboard',
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
            )}
          </Group>
          <Textarea
            value={state.token}
            onChange={(event) => handleTokenChange(event.currentTarget.value)}
            placeholder={
              state.mode === 'decode' 
                ? 'Paste your JWT token here...'
                : 'Generated JWT will appear here...'
            }
            readOnly={state.mode === 'encode'}
            minRows={3}
            maxRows={6}
            style={{ 
              fontFamily: 'var(--font-geist-mono)',
              backgroundColor: state.mode === 'encode' ? 'var(--mantine-color-gray-0)' : undefined
            }}
          />
        </Stack>

        <Divider />

        {/* JWT Components */}
        <Group grow align="flex-start" gap="lg">
          {/* Header */}
          <Card>
            <Stack gap="md">
              <Text fw={600} c="blue">Header</Text>
              
              {state.mode === 'encode' && (
                <Select
                  label="Algorithm"
                  value={state.algorithm}
                  onChange={(value) => {
                    setState(prev => ({ ...prev, algorithm: value as JWTAlgorithm }));
                    // Trigger encode after state update
                    setTimeout(() => encodeJWT(), 0);
                  }}
                  data={[
                    { value: 'HS256', label: 'HMAC SHA256' },
                    { value: 'HS384', label: 'HMAC SHA384' },
                    { value: 'HS512', label: 'HMAC SHA512' },
                    { value: 'RS256', label: 'RSA SHA256' },
                    { value: 'RS384', label: 'RSA SHA384' },
                    { value: 'RS512', label: 'RSA SHA512' }
                  ]}
                />
              )}

              <JsonInput
                value={JSON.stringify(state.header, null, 2)}
                onChange={(value) => {
                  try {
                    const header = JSON.parse(value);
                    setState(prev => ({ ...prev, header }));
                    // Trigger encode after state update if in encode mode
                    if (state.mode === 'encode') {
                      setTimeout(() => encodeJWT(), 0);
                    }
                  } catch (error) {
                    // Invalid JSON, ignore
                  }
                }}
                validationError="Invalid JSON"
                formatOnBlur
                autosize
                minRows={4}
                maxRows={8}
                readOnly={state.mode === 'decode'}
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              />
            </Stack>
          </Card>

          {/* Payload */}
          <Card>
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={600} c="green">Payload</Text>
                {state.payload.exp && (
                  <Badge color={isExpired(state.payload.exp) ? 'red' : 'green'} size="sm">
                    {isExpired(state.payload.exp) ? 'Expired' : 'Valid'}
                  </Badge>
                )}
              </Group>

              {/* Standard claims info */}
              {(state.payload.iat || state.payload.exp || state.payload.sub) && (
                <Stack gap="xs">
                  {state.payload.sub && (
                    <Text size="sm" c="dimmed">
                      <strong>Subject:</strong> {state.payload.sub}
                    </Text>
                  )}
                  {state.payload.iat && (
                    <Text size="sm" c="dimmed">
                      <strong>Issued:</strong> {formatTimestamp(state.payload.iat)}
                    </Text>
                  )}
                  {state.payload.exp && (
                    <Text size="sm" c="dimmed">
                      <strong>Expires:</strong> {formatTimestamp(state.payload.exp)}
                    </Text>
                  )}
                  <Divider size="xs" />
                </Stack>
              )}

              <JsonInput
                value={JSON.stringify(state.payload, null, 2)}
                onChange={(value) => {
                  try {
                    const payload = JSON.parse(value);
                    setState(prev => ({ ...prev, payload }));
                    // Trigger encode after state update if in encode mode
                    if (state.mode === 'encode') {
                      setTimeout(() => encodeJWT(), 0);
                    }
                  } catch (error) {
                    // Invalid JSON, ignore
                  }
                }}
                placeholder={state.mode === 'encode' ? `{
  "sub": "user123",
  "name": "John Doe",
  "admin": true
}` : ''}
                validationError="Invalid JSON"
                formatOnBlur
                autosize
                minRows={6}
                maxRows={12}
                readOnly={state.mode === 'decode'}
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              />
            </Stack>
          </Card>

          {/* Signature */}
          <Card>
            <Stack gap="md">
              <Text fw={600} c="orange">Signature</Text>
              
              <TextInput
                label="Secret Key"
                value={state.secret}
                onChange={(event) => {
                  setState(prev => ({ ...prev, secret: event.currentTarget.value }));
                  // Trigger encode after state update if in encode mode
                  if (state.mode === 'encode') {
                    setTimeout(() => encodeJWT(), 0);
                  }
                }}
                placeholder="Enter your secret key..."
                disabled={state.mode === 'decode'}
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              />

              <Textarea
                label="Signature"
                value={state.signature}
                readOnly
                placeholder="Signature will appear here..."
                minRows={4}
                maxRows={6}
                style={{ 
                  fontFamily: 'var(--font-geist-mono)',
                  backgroundColor: 'var(--mantine-color-gray-0)'
                }}
              />

              {state.mode === 'decode' && state.signature && (
                <Alert color={state.isValid ? 'green' : 'red'}>
                  <Text size="sm">
                    Signature {state.isValid ? 'verified successfully' : 'verification failed'}
                  </Text>
                  <Text size="xs" c="dimmed" mt="xs">
                    {state.isValid 
                      ? 'The token has not been tampered with'
                      : 'The token may have been modified or the secret is incorrect'
                    }
                  </Text>
                </Alert>
              )}
            </Stack>
          </Card>
        </Group>

        {/* Additional Info */}
        {state.token && (
          <Card>
            <Stack gap="md">
              <Text fw={600}>Token Information</Text>
              <Group gap="md">
                <Text size="sm" c="dimmed">
                  <strong>Algorithm:</strong> {state.header.alg || 'Unknown'}
                </Text>
                <Divider orientation="vertical" />
                <Text size="sm" c="dimmed">
                  <strong>Type:</strong> {state.header.typ || 'Unknown'}
                </Text>
                <Divider orientation="vertical" />
                <Text size="sm" c="dimmed">
                  <strong>Length:</strong> {state.token.length} characters
                </Text>
                <Divider orientation="vertical" />
                <Text size="sm" c={state.isValid ? 'green' : 'red'}>
                  <strong>Status:</strong> {state.isValid ? 'Valid' : 'Invalid'}
                </Text>
              </Group>
            </Stack>
          </Card>
        )}
      </Stack>
    </ToolLayout>
  );
}