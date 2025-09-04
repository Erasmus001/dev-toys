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
  NumberInput,
  ActionIcon,
  Tooltip,
  Switch,
  Slider
} from '@mantine/core';
import { IconUpload, IconDownload, IconAlertCircle, IconPhoto, IconFileZip } from '@tabler/icons-react';
import { ToolLayout } from '../../components/tools/ToolLayout';
import { ImageCompressorState, CompressedImage } from '../../lib/types';
import { notifications } from '@mantine/notifications';

export function ImageCompressorTool() {
  const [state, setState] = useState<ImageCompressorState>({
    files: [],
    compressedImages: [],
    quality: 80,
    maxWidth: undefined,
    maxHeight: undefined,
    isProcessing: false,
    error: undefined
  });

  const [resizeEnabled, setResizeEnabled] = useState(false);
  const resetRef = useRef<() => void>(null);

  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const handleFileUpload = async (files: File[]) => {
    const validFiles = files.filter(file => supportedFormats.includes(file.type));
    
    if (validFiles.length === 0) {
      notifications.show({
        title: 'Invalid File Type',
        message: 'Please upload valid image files (JPEG, PNG, WebP)',
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

    setState(prev => ({ ...prev, files: validFiles, compressedImages: [] }));
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const compressImage = async (
    file: File, 
    quality: number, 
    maxWidth?: number, 
    maxHeight?: number
  ): Promise<CompressedImage> => {
    return new Promise(async (resolve, reject) => {
      try {
        const originalDimensions = await getImageDimensions(file);
        
        const img = new window.Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        img.onload = () => {
          let { width, height } = originalDimensions;
          
          // Calculate new dimensions if resize is enabled
          if (resizeEnabled && (maxWidth || maxHeight)) {
            if (maxWidth && width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
            if (maxHeight && height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          // Set image smoothing for better quality during resize
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(img, 0, 0, width, height);
          
          const mimeType = file.type;
          const qualityValue = quality / 100;
          
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            const reader = new FileReader();
            reader.onload = () => {
              const compressedDataUrl = reader.result as string;
              const compressionRatio = ((file.size - blob.size) / file.size) * 100;
              
              resolve({
                originalFile: file,
                compressedBlob: blob,
                compressedDataUrl,
                originalSize: file.size,
                compressedSize: blob.size,
                compressionRatio: Math.max(0, compressionRatio),
                originalDimensions,
                compressedDimensions: { width: Math.round(width), height: Math.round(height) }
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
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleCompress = async () => {
    if (state.files.length === 0) return;

    setState(prev => ({ ...prev, isProcessing: true, error: undefined }));

    try {
      const compressedImages: CompressedImage[] = [];
      
      for (let i = 0; i < state.files.length; i++) {
        const file = state.files[i];
        try {
          const compressed = await compressImage(
            file, 
            state.quality, 
            state.maxWidth, 
            state.maxHeight
          );
          compressedImages.push(compressed);
        } catch (error) {
          console.error(`Error compressing ${file.name}:`, error);
          notifications.show({
            title: 'Compression Error',
            message: `Failed to compress ${file.name}`,
            color: 'red'
          });
        }
      }

      setState(prev => ({ 
        ...prev, 
        compressedImages,
        isProcessing: false 
      }));

      if (compressedImages.length > 0) {
        const totalSavings = compressedImages.reduce((sum, img) => sum + img.compressionRatio, 0) / compressedImages.length;
        notifications.show({
          title: 'Compression Complete',
          message: `Successfully compressed ${compressedImages.length} image(s) with ${totalSavings.toFixed(1)}% average savings`,
          color: 'green'
        });
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Compression failed'
      }));
    }
  };

  const downloadImage = (compressedImage: CompressedImage) => {
    const link = document.createElement('a');
    link.href = compressedImage.compressedDataUrl;
    const originalName = compressedImage.originalFile.name.split('.')[0];
    const extension = compressedImage.originalFile.name.split('.').pop();
    link.download = `${originalName}_compressed.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    state.compressedImages.forEach(compressedImage => {
      setTimeout(() => downloadImage(compressedImage), 100);
    });
  };

  const handleClear = () => {
    setState({
      files: [],
      compressedImages: [],
      quality: 80,
      maxWidth: undefined,
      maxHeight: undefined,
      isProcessing: false,
      error: undefined
    });
    setResizeEnabled(false);
    
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

  const getTotalSavings = () => {
    if (state.compressedImages.length === 0) return { originalSize: 0, compressedSize: 0, savings: 0 };
    
    const originalSize = state.compressedImages.reduce((sum, img) => sum + img.originalSize, 0);
    const compressedSize = state.compressedImages.reduce((sum, img) => sum + img.compressedSize, 0);
    const savings = ((originalSize - compressedSize) / originalSize) * 100;
    
    return { originalSize, compressedSize, savings };
  };

  return (
    <ToolLayout
      title="Image Compressor"
      description="Compress images with quality control and optional resizing"
      actions={
        <Group gap="sm">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          {state.compressedImages.length > 0 && (
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
                Supports: JPEG, PNG, WebP
              </Text>
            </Group>
          </Stack>
        </Card>

        {/* Compression Settings */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>Compression Settings</Text>
            
            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm" fw={500}>Quality: {state.quality}%</Text>
                <Text size="xs" c="dimmed">Lower = Smaller file, Higher = Better quality</Text>
              </Group>
              <Slider
                value={state.quality}
                onChange={(value) => setState(prev => ({ ...prev, quality: value }))}
                min={1}
                max={100}
                step={1}
                marks={[
                  { value: 20, label: '20%' },
                  { value: 50, label: '50%' },
                  { value: 80, label: '80%' },
                  { value: 100, label: '100%' }
                ]}
              />
            </Stack>

            <Switch
              checked={resizeEnabled}
              onChange={(event) => setResizeEnabled(event.currentTarget.checked)}
              label="Enable Image Resizing"
              description="Resize images to reduce file size further"
            />

            {resizeEnabled && (
              <Group grow>
                <NumberInput
                  label="Max Width (px)"
                  value={state.maxWidth}
                  onChange={(value) => setState(prev => ({ ...prev, maxWidth: value as number || undefined }))}
                  placeholder="Optional"
                  min={100}
                  max={4000}
                />
                <NumberInput
                  label="Max Height (px)"
                  value={state.maxHeight}
                  onChange={(value) => setState(prev => ({ ...prev, maxHeight: value as number || undefined }))}
                  placeholder="Optional"
                  min={100}
                  max={4000}
                />
              </Group>
            )}
            
            {state.files.length > 0 && (
              <Button 
                onClick={handleCompress} 
                loading={state.isProcessing}
                disabled={state.files.length === 0}
                leftSection={<IconFileZip size={16} />}
              >
                Compress {state.files.length} Image(s)
              </Button>
            )}
          </Stack>
        </Card>

        {/* Total Savings Summary */}
        {state.compressedImages.length > 0 && (
          <Card>
            <Stack gap="sm">
              <Text fw={600}>Compression Summary</Text>
              <Group gap="md">
                <Text size="sm">
                  <strong>Original Total:</strong> {formatFileSize(getTotalSavings().originalSize)}
                </Text>
                <Text size="sm">
                  <strong>Compressed Total:</strong> {formatFileSize(getTotalSavings().compressedSize)}
                </Text>
                <Text size="sm" c="green" fw={500}>
                  <strong>Total Savings:</strong> {getTotalSavings().savings.toFixed(1)}%
                </Text>
              </Group>
            </Stack>
          </Card>
        )}

        {/* Error Display */}
        {state.error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            <Text fw={500}>Compression Error</Text>
            <Text size="sm">{state.error}</Text>
          </Alert>
        )}

        {/* Processing Progress */}
        {state.isProcessing && (
          <Card>
            <Stack gap="sm">
              <Text fw={500}>Compressing Images...</Text>
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

        {/* Compressed Images */}
        {state.compressedImages.length > 0 && (
          <Card>
            <Stack gap="md">
              <Text fw={600}>Compressed Images ({state.compressedImages.length})</Text>
              <Stack gap="md">
                {state.compressedImages.map((compressedImage, index) => (
                  <Group key={index} align="flex-start" gap="md" p="md" style={{ backgroundColor: 'var(--mantine-color-gray-0)', borderRadius: '8px' }}>
                    <Image
                      src={compressedImage.compressedDataUrl}
                      alt={compressedImage.originalFile.name}
                      w={80}
                      h={80}
                      fit="cover"
                      radius="sm"
                    />
                    
                    <Stack gap="xs" style={{ flex: 1 }}>
                      <Group justify="space-between">
                        <Text fw={500}>{compressedImage.originalFile.name}</Text>
                        <Group gap="xs">
                          <Badge color="green">-{compressedImage.compressionRatio.toFixed(1)}%</Badge>
                          <Tooltip label="Download compressed image">
                            <ActionIcon 
                              onClick={() => downloadImage(compressedImage)}
                              variant="light"
                            >
                              <IconDownload size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Group>
                      
                      <Group gap="md">
                        <Text size="sm">
                          <strong>Original:</strong> {formatFileSize(compressedImage.originalSize)}
                        </Text>
                        <Text size="sm">
                          <strong>Compressed:</strong> {formatFileSize(compressedImage.compressedSize)}
                        </Text>
                      </Group>

                      <Group gap="md">
                        <Text size="sm">
                          <strong>Original Size:</strong> {compressedImage.originalDimensions.width}×{compressedImage.originalDimensions.height}
                        </Text>
                        <Text size="sm">
                          <strong>Final Size:</strong> {compressedImage.compressedDimensions.width}×{compressedImage.compressedDimensions.height}
                        </Text>
                      </Group>
                    </Stack>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Card>
        )}

        {/* Compression Tips */}
        <Card>
          <Stack gap="md">
            <Text fw={600}>Compression Tips</Text>
            <Group gap="md">
              <Stack gap="xs">
                <Text size="sm" fw={500}>Quality Settings:</Text>
                <Text size="xs">• 90-100%: Highest quality, larger files</Text>
                <Text size="xs">• 70-89%: Good quality, balanced size</Text>
                <Text size="xs">• 50-69%: Medium quality, smaller files</Text>
                <Text size="xs">• 1-49%: Lower quality, smallest files</Text>
              </Stack>
              
              <Stack gap="xs">
                <Text size="sm" fw={500}>Best Practices:</Text>
                <Text size="xs">• JPEG: Best for photos and complex images</Text>
                <Text size="xs">• PNG: Use for graphics, logos, transparency</Text>
                <Text size="xs">• WebP: Modern format with better compression</Text>
                <Text size="xs">• Consider resizing for web use (max 1920px)</Text>
              </Stack>

              <Stack gap="xs">
                <Text size="sm" fw={500}>File Size Targets:</Text>
                <Text size="xs">• Web thumbnails: 10-50 KB</Text>
                <Text size="xs">• Social media: 100-500 KB</Text>
                <Text size="xs">• Print quality: 1-5 MB</Text>
                <Text size="xs">• High resolution: 5+ MB</Text>
              </Stack>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </ToolLayout>
  );
}