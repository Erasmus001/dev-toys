'use client';

import { useState, useRef } from 'react';
import { 
  Stack, 
  Group, 
  Button, 
  Alert,
  Text,
  Card,
  Badge,
  FileButton,
  Image,
  Progress,
  Select,
  NumberInput,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import { IconUpload, IconDownload, IconAlertCircle, IconPhoto, IconTrash } from '@tabler/icons-react';
import { ToolLayout } from '../../components/tools/ToolLayout';
import { ImageConverterState, ConvertedImage, ImageFormat } from '../../lib/types';
import { notifications } from '@mantine/notifications';

export function ImageConverterTool() {
  const [state, setState] = useState<ImageConverterState>({
    files: [],
    convertedImages: [],
    targetFormat: 'jpeg',
    quality: 90,
    isProcessing: false,
    error: undefined
  });

  const resetRef = useRef<() => void>(null);

  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  const formatOptions = [
    { value: 'jpeg', label: 'JPEG' },
    { value: 'png', label: 'PNG' },
    { value: 'webp', label: 'WebP' }
  ];

  const handleFileUpload = async (files: File[]) => {
    const validFiles = files.filter(file => supportedFormats.includes(file.type));
    
    if (validFiles.length === 0) {
      notifications.show({
        title: 'Invalid File Type',
        message: 'Please upload valid image files (JPEG, PNG, WebP, GIF)',
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

    setState(prev => ({ ...prev, files: validFiles, convertedImages: [] }));
  };

  const convertImage = async (file: File, targetFormat: ImageFormat, quality: number): Promise<ConvertedImage> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // For PNG target, use white background to avoid transparency issues
        if (targetFormat === 'png') {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);
        
        const mimeType = `image/${targetFormat}`;
        const qualityValue = targetFormat === 'png' ? undefined : quality / 100;
        
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to convert image'));
            return;
          }

          const reader = new FileReader();
          reader.onload = () => {
            const convertedDataUrl = reader.result as string;
            const compressionRatio = ((file.size - blob.size) / file.size) * 100;
            
            resolve({
              originalFile: file,
              convertedBlob: blob,
              convertedDataUrl,
              originalSize: file.size,
              convertedSize: blob.size,
              compressionRatio: Math.max(0, compressionRatio)
            });
          };
          reader.readAsDataURL(blob);
        }, mimeType, qualityValue);
      };

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${file.name}`));
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleConvert = async () => {
    if (state.files.length === 0) return;

    setState(prev => ({ ...prev, isProcessing: true, error: undefined }));

    try {
      const convertedImages: ConvertedImage[] = [];
      
      for (let i = 0; i < state.files.length; i++) {
        const file = state.files[i];
        try {
          const converted = await convertImage(file, state.targetFormat, state.quality);
          convertedImages.push(converted);
        } catch (error) {
          console.error(`Error converting ${file.name}:`, error);
          notifications.show({
            title: 'Conversion Error',
            message: `Failed to convert ${file.name}`,
            color: 'red'
          });
        }
      }

      setState(prev => ({ 
        ...prev, 
        convertedImages,
        isProcessing: false 
      }));

      if (convertedImages.length > 0) {
        notifications.show({
          title: 'Conversion Complete',
          message: `Successfully converted ${convertedImages.length} image(s)`,
          color: 'green'
        });
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Conversion failed'
      }));
    }
  };

  const downloadImage = (convertedImage: ConvertedImage) => {
    const link = document.createElement('a');
    link.href = convertedImage.convertedDataUrl;
    const originalName = convertedImage.originalFile.name.split('.')[0];
    link.download = `${originalName}_converted.${state.targetFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    state.convertedImages.forEach(convertedImage => {
      setTimeout(() => downloadImage(convertedImage), 100);
    });
  };

  const handleClear = () => {
    setState({
      files: [],
      convertedImages: [],
      targetFormat: 'jpeg',
      quality: 90,
      isProcessing: false,
      error: undefined
    });
    
    if (resetRef.current) {
      resetRef.current();
    }
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
      title="Image Converter"
      description="Convert images between JPEG, PNG, and WebP formats"
      actions={
        <Group gap="sm">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          {state.convertedImages.length > 0 && (
            <Button onClick={downloadAll} leftSection={<IconDownload size={16} />}>
              Download All
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
                resetRef={resetRef}
              >
                {(props) => (
                  <Button {...props} leftSection={<IconUpload size={16} />}>
                    Upload Images
                  </Button>
                )}
              </FileButton>
              <Text size="sm" c="dimmed">
                Supports: JPEG, PNG, WebP, GIF
              </Text>
            </Group>
          </Stack>
        </Card>

        {/* Conversion Settings */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>Conversion Settings</Text>
            <Group grow>
              <Select
                label="Target Format"
                value={state.targetFormat}
                onChange={(value) => setState(prev => ({ ...prev, targetFormat: value as ImageFormat }))}
                data={formatOptions}
              />
              {state.targetFormat !== 'png' && (
                <NumberInput
                  label="Quality (%)"
                  value={state.quality}
                  onChange={(value) => setState(prev => ({ ...prev, quality: value as number }))}
                  min={1}
                  max={100}
                  step={5}
                />
              )}
            </Group>
            
            {state.files.length > 0 && (
              <Button 
                onClick={handleConvert} 
                loading={state.isProcessing}
                disabled={state.files.length === 0}
                leftSection={<IconPhoto size={16} />}
              >
                Convert {state.files.length} Image(s)
              </Button>
            )}
          </Stack>
        </Card>

        {/* Error Display */}
        {state.error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            <Text fw={500}>Conversion Error</Text>
            <Text size="sm">{state.error}</Text>
          </Alert>
        )}

        {/* Processing Progress */}
        {state.isProcessing && (
          <Card>
            <Stack gap="sm">
              <Text fw={500}>Converting Images...</Text>
              <Progress value={100} animated />
            </Stack>
          </Card>
        )}

        {/* Original Files Preview */}
        {state.files.length > 0 && (
          <Card>
            <Stack gap="md">
              <Text fw={600}>Original Images ({state.files.length})</Text>
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
                    <Badge variant="light">{file.type.split('/')[1].toUpperCase()}</Badge>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Card>
        )}

        {/* Converted Images */}
        {state.convertedImages.length > 0 && (
          <Card>
            <Stack gap="md">
              <Text fw={600}>Converted Images ({state.convertedImages.length})</Text>
              <Stack gap="md">
                {state.convertedImages.map((convertedImage, index) => (
                  <Group key={index} align="flex-start" gap="md" p="md" style={{ backgroundColor: 'var(--mantine-color-gray-0)', borderRadius: '8px' }}>
                    <Image
                      src={convertedImage.convertedDataUrl}
                      alt={convertedImage.originalFile.name}
                      w={80}
                      h={80}
                      fit="cover"
                      radius="sm"
                    />
                    
                    <Stack gap="xs" style={{ flex: 1 }}>
                      <Group justify="space-between">
                        <Text fw={500}>{convertedImage.originalFile.name}</Text>
                        <Group gap="xs">
                          <Badge color="blue">{state.targetFormat.toUpperCase()}</Badge>
                          <Tooltip label="Download converted image">
                            <ActionIcon 
                              onClick={() => downloadImage(convertedImage)}
                              variant="light"
                            >
                              <IconDownload size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Group>
                      
                      <Group gap="md">
                        <Text size="sm">
                          <strong>Original:</strong> {formatFileSize(convertedImage.originalSize)}
                        </Text>
                        <Text size="sm">
                          <strong>Converted:</strong> {formatFileSize(convertedImage.convertedSize)}
                        </Text>
                        <Text size="sm" c={convertedImage.compressionRatio > 0 ? 'green' : 'orange'}>
                          <strong>Savings:</strong> {convertedImage.compressionRatio.toFixed(1)}%
                        </Text>
                      </Group>
                    </Stack>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Card>
        )}

        {/* Format Information */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>Format Information</Text>
            <Group gap="md">
              <Stack gap="xs">
                <Text size="sm" fw={500}>JPEG:</Text>
                <Text size="xs">• Best for photos</Text>
                <Text size="xs">• Small file sizes</Text>
                <Text size="xs">• Quality adjustable</Text>
                <Text size="xs">• No transparency</Text>
              </Stack>
              
              <Stack gap="xs">
                <Text size="sm" fw={500}>PNG:</Text>
                <Text size="xs">• Best for graphics</Text>
                <Text size="xs">• Lossless compression</Text>
                <Text size="xs">• Supports transparency</Text>
                <Text size="xs">• Larger file sizes</Text>
              </Stack>

              <Stack gap="xs">
                <Text size="sm" fw={500}>WebP:</Text>
                <Text size="xs">• Modern format</Text>
                <Text size="xs">• Superior compression</Text>
                <Text size="xs">• Supports transparency</Text>
                <Text size="xs">• Not universally supported</Text>
              </Stack>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </ToolLayout>
  );
}