'use client';

import { useState, useRef } from 'react';
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
  Badge,
  FileButton,
  Image,
  ScrollArea,
  Divider
} from '@mantine/core';
import { IconCopy, IconCheck, IconAlertCircle, IconUpload, IconPhoto, IconDownload } from '@tabler/icons-react';
import { ToolLayout } from '../../components/tools/ToolLayout';
import { Base64ImageState, ImageMetadata } from '../../lib/types';
import { notifications } from '@mantine/notifications';

export function Base64ImageTool() {
  const [state, setState] = useState<Base64ImageState>({
    mode: 'encode',
    files: [],
    base64Data: '',
    base64String: '',
    previewUrl: '',
    metadata: [],
    progress: 0,
    isValid: true,
    error: undefined
  });

  const resetButtonRef = useRef<HTMLButtonElement>(null);

  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

  const handleFileUpload = async (files: File[]) => {
    const validFiles = files.filter(file => supportedFormats.includes(file.type));
    
    if (validFiles.length === 0) {
      notifications.show({
        title: 'Invalid File Type',
        message: 'Please upload valid image files (JPEG, PNG, GIF, WebP, SVG)',
        color: 'red'
      });
      return;
    }

    if (validFiles.length !== files.length) {
      notifications.show({
        title: 'Some Files Skipped',
        message: `${files.length - validFiles.length} file(s) were skipped due to unsupported format`,
        color: 'orange'
      });
    }

    try {
      const metadata: ImageMetadata[] = [];
      let base64String = '';

      if (validFiles.length === 1) {
        const file = validFiles[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const result = e.target?.result as string;
          base64String = result;
          
          metadata.push({
            filename: file.name,
            size: file.size,
            type: file.type,
            format: file.type.split('/')[1],
            dimensions: null // Will be populated when image loads
          });

          setState(prev => ({
            ...prev,
            files: validFiles,
            base64String,
            metadata,
            isValid: true,
            error: undefined
          }));
        };

        reader.onerror = () => {
          setState(prev => ({
            ...prev,
            isValid: false,
            error: 'Failed to read file'
          }));
        };

        reader.readAsDataURL(file);
      } else {
        // Multiple files - create metadata for each
        for (const file of validFiles) {
          metadata.push({
            filename: file.name,
            size: file.size,
            type: file.type,
            format: file.type.split('/')[1],
            dimensions: null
          });
        }

        setState(prev => ({
          ...prev,
          files: validFiles,
          metadata,
          base64String: '',
          isValid: true,
          error: undefined
        }));

        notifications.show({
          title: 'Multiple Files',
          message: `${validFiles.length} files uploaded. Select individual files to view Base64.`,
          color: 'blue'
        });
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isValid: false,
        error: 'Failed to process files'
      }));
    }
  };

  const handleBase64Input = (value: string) => {
    setState(prev => ({ ...prev, base64String: value }));
    
    if (!value.trim()) {
      setState(prev => ({
        ...prev,
        files: [],
        metadata: [],
        isValid: true,
        error: undefined
      }));
      return;
    }

    try {
      // Validate base64 format
      const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/;
      
      if (!base64Pattern.test(value)) {
        throw new Error('Invalid Base64 image format. Must start with "data:image/[type];base64,"');
      }

      // Extract metadata from base64
      const matches = value.match(/^data:image\/([^;]+);base64,(.+)$/);
      if (matches) {
        const [, type, data] = matches;
        const byteLength = Math.ceil(data.length * 3 / 4);
        
        const metadata: ImageMetadata = {
          filename: `decoded-image.${type === 'svg+xml' ? 'svg' : type}`,
          size: byteLength,
          type: `image/${type}`,
          format: type === 'svg+xml' ? 'svg' : type,
          dimensions: null
        };

        setState(prev => ({
          ...prev,
          metadata: [metadata],
          files: [],
          isValid: true,
          error: undefined
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid Base64 string';
      setState(prev => ({
        ...prev,
        isValid: false,
        error: errorMessage,
        metadata: [],
        files: []
      }));
    }
  };

  const convertFileToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const downloadImage = () => {
    if (!state.base64String || !state.metadata[0]) return;

    try {
      // Convert base64 to blob
      const byteCharacters = atob(state.base64String.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: state.metadata[0].type });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = state.metadata[0].filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      notifications.show({
        title: 'Downloaded!',
        message: 'Image downloaded successfully',
        color: 'green'
      });
    } catch (error) {
      notifications.show({
        title: 'Download Failed',
        message: 'Failed to download image',
        color: 'red'
      });
    }
  };

  const handleClear = () => {
    setState(prev => ({
      ...prev,
      files: [],
      base64String: '',
      metadata: [],
      isValid: true,
      error: undefined
    }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ToolLayout
      title="Base64 Image Converter"
      description="Convert images to/from Base64 encoding with preview and metadata"
      actions={
        <Group gap="sm">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          {state.base64String && state.metadata[0] && (
            <Button 
              leftSection={<IconDownload size={16} />}
              onClick={downloadImage}
            >
              Download Image
            </Button>
          )}
        </Group>
      }
    >
      <Stack gap="lg">
        {/* Upload Section */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>Upload Images</Text>
            <Group gap="md">
              <FileButton 
                onChange={handleFileUpload} 
                accept="image/*" 
                multiple
              >
                {(props) => (
                  <Button {...props} leftSection={<IconUpload size={16} />}>
                    Upload Images
                  </Button>
                )}
              </FileButton>
              <Text size="sm" c="dimmed">
                Supports: JPEG, PNG, GIF, WebP, SVG
              </Text>
            </Group>
          </Stack>
        </Card>

        {/* Error Display */}
        {state.error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            <Text fw={500}>Error</Text>
            <Text size="sm">{state.error}</Text>
          </Alert>
        )}

        {/* File Preview and Metadata */}
        {state.files.length > 0 && (
          <Card>
            <Stack gap="md">
              <Text fw={600}>Uploaded Files</Text>
              <Stack gap="sm">
                {state.files.map((file, index) => (
                  <Group key={index} justify="space-between" p="sm" style={{ backgroundColor: 'var(--mantine-color-gray-0)', borderRadius: '4px' }}>
                    <Group gap="sm">
                      <IconPhoto size={20} />
                      <Stack gap={0}>
                        <Text size="sm" fw={500}>{file.name}</Text>
                        <Text size="xs" c="dimmed">
                          {formatFileSize(file.size)} • {file.type}
                        </Text>
                      </Stack>
                    </Group>
                    <Button 
                      size="xs" 
                      onClick={async () => {
                        const base64 = await convertFileToBase64(file);
                        setState(prev => ({ ...prev, base64String: base64 }));
                      }}
                    >
                      Convert
                    </Button>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Card>
        )}

        {/* Image Preview */}
        {state.base64String && state.isValid && (
          <Card>
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={600}>Image Preview</Text>
                {state.metadata[0] && (
                  <Badge color="blue">
                    {state.metadata[0].type} • {formatFileSize(state.metadata[0].size)}
                  </Badge>
                )}
              </Group>
              
              <Group justify="center">
                <Image
                  src={state.base64String}
                  alt="Base64 Image Preview"
                  style={{ maxWidth: '100%', maxHeight: '400px' }}
                  fit="contain"
                />
              </Group>
            </Stack>
          </Card>
        )}

        {/* Base64 Input/Output */}
        <Group grow align="flex-start" gap="lg">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500}>Base64 String</Text>
              {state.base64String && (
                <MantineCopyButton value={state.base64String} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Copied!' : 'Copy Base64'}>
                      <ActionIcon
                        color={copied ? 'teal' : 'gray'}
                        variant="subtle"
                        onClick={() => {
                          copy();
                          notifications.show({
                            title: 'Copied!',
                            message: 'Base64 string copied to clipboard',
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
              value={state.base64String}
              onChange={(event) => handleBase64Input(event.currentTarget.value)}
              placeholder="Paste Base64 image string here or upload an image above..."
              minRows={8}
              maxRows={15}
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            />
            <Text size="xs" c="dimmed">
              Format: data:image/[type];base64,[data]
            </Text>
          </Stack>
        </Group>

        {/* Metadata Details */}
        {state.metadata.length > 0 && (
          <Card>
            <Stack gap="md">
              <Text fw={600}>Image Metadata</Text>
              {state.metadata.map((meta, index) => (
                <Stack key={index} gap="xs">
                  <Group gap="md">
                    <Text size="sm"><strong>Filename:</strong> {meta.filename}</Text>
                    <Divider orientation="vertical" />
                    <Text size="sm"><strong>Size:</strong> {formatFileSize(meta.size)}</Text>
                    <Divider orientation="vertical" />
                    <Text size="sm"><strong>Type:</strong> {meta.type}</Text>
                  </Group>
                </Stack>
              ))}
            </Stack>
          </Card>
        )}

        {/* Information */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>About Base64 Image Encoding</Text>
            <Text size="sm" c="dimmed">
              Base64 encoding converts binary image data into ASCII text format, making it possible to embed images directly in HTML, CSS, or JSON. 
              This is useful for small images, icons, or when you need to include images inline without separate file references.
            </Text>
            
            <Group gap="md">
              <Text size="sm" c="dimmed">
                <strong>Pros:</strong> Self-contained, no external requests, works in any text context
              </Text>
              <Text size="sm" c="dimmed">
                <strong>Cons:</strong> ~33% larger than original, not cached separately
              </Text>
            </Group>
            
            <Text size="sm" c="dimmed">
              <strong>Best for:</strong> Small images (&lt;10KB), icons, inline SVGs, email templates
            </Text>
          </Stack>
        </Card>
      </Stack>
    </ToolLayout>
  );
}