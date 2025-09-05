'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Stack,
  Group,
  Paper,
  Title,
  Text,
  ColorPicker,
  Select,
  NumberInput,
  Button,
  Grid,
  ColorSwatch,
  Badge,
  Table,
  Textarea,
  CopyButton,
  Alert,
  Divider,
  Tabs,
  ActionIcon,
  Tooltip,
  Card,
  Switch,
  RangeSlider,
  Slider,
  Box,
} from '@mantine/core';
import {
  IconDownload,
  IconCopy,
  IconRefresh,
  IconPalette,
  IconCheck,
  IconX,
  IconInfoCircle,
  IconColorSwatch,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import chroma from 'chroma-js';

// Types for palette schemes
type PaletteScheme = 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'split-complementary';
type ExportFormat = 'css' | 'scss' | 'json' | 'tailwind';
type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'rgba' | 'hsla';

interface ColorInfo {
  color: string;
  hex: string;
  rgb: string;
  hsl: string;
  contrastWithWhite: number;
  contrastWithBlack: number;
  wcagAAWhite: boolean;
  wcagAAAWhite: boolean;
  wcagAABlack: boolean;
  wcagAAABlack: boolean;
}

interface PaletteConfig {
  baseColor: string;
  scheme: PaletteScheme;
  colorCount: number;
  lightnessRange: [number, number];
  saturationAdjust: number;
}

const SCHEME_DESCRIPTIONS = {
  monochromatic: 'Uses different shades, tints, and tones of a single hue',
  analogous: 'Uses colors that are adjacent to each other on the color wheel',
  complementary: 'Uses colors that are directly opposite on the color wheel',
  triadic: 'Uses three colors evenly spaced around the color wheel',
  tetradic: 'Uses four colors forming a rectangle on the color wheel',
  'split-complementary': 'Uses a base color and two adjacent to its complement',
};

export default function ColorPaletteGeneratorTool() {
  const [config, setConfig] = useState<PaletteConfig>({
    baseColor: '#3b82f6',
    scheme: 'monochromatic',
    colorCount: 5,
    lightnessRange: [0.2, 0.8],
    saturationAdjust: 0,
  });
  
  const [palette, setPalette] = useState<ColorInfo[]>([]);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('css');
  const [colorFormat, setColorFormat] = useState<ColorFormat>('hex');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [exportedCode, setExportedCode] = useState('');

  // Generate palette based on current configuration
  const generatePalette = useCallback((currentConfig: PaletteConfig): ColorInfo[] => {
    const { baseColor, scheme, colorCount, lightnessRange, saturationAdjust } = currentConfig;
    
    try {
      const base = chroma(baseColor);
      let colors: chroma.Color[] = [];

      switch (scheme) {
        case 'monochromatic':
          colors = chroma
            .scale([
              base.set('hsl.l', lightnessRange[0]),
              base,
              base.set('hsl.l', lightnessRange[1]),
            ])
            .mode('hsl')
            .colors(colorCount)
            .map(c => chroma(c));
          break;

        case 'analogous':
          const analogousHues = Array.from({ length: colorCount }, (_, i) => {
            const hueShift = (i - Math.floor(colorCount / 2)) * (60 / colorCount);
            return base.set('hsl.h', `+${hueShift}`);
          });
          colors = analogousHues;
          break;

        case 'complementary':
          if (colorCount <= 2) {
            colors = [base, base.set('hsl.h', '+180')];
          } else {
            const complement = base.set('hsl.h', '+180');
            const baseShades = chroma.scale([
              base.set('hsl.l', lightnessRange[0]),
              base.set('hsl.l', lightnessRange[1])
            ]).colors(Math.ceil(colorCount / 2)).map(c => chroma(c));
            const complementShades = chroma.scale([
              complement.set('hsl.l', lightnessRange[0]),
              complement.set('hsl.l', lightnessRange[1])
            ]).colors(Math.floor(colorCount / 2)).map(c => chroma(c));
            colors = [...baseShades, ...complementShades];
          }
          break;

        case 'triadic':
          colors = [
            base,
            base.set('hsl.h', '+120'),
            base.set('hsl.h', '+240'),
          ];
          // Fill remaining slots with variations
          while (colors.length < colorCount) {
            const randomBase = colors[Math.floor(Math.random() * 3)];
            colors.push(randomBase.set('hsl.l', Math.random() * 0.6 + 0.2));
          }
          break;

        case 'tetradic':
          colors = [
            base,
            base.set('hsl.h', '+90'),
            base.set('hsl.h', '+180'),
            base.set('hsl.h', '+270'),
          ];
          // Fill remaining slots with variations
          while (colors.length < colorCount) {
            const randomBase = colors[Math.floor(Math.random() * 4)];
            colors.push(randomBase.set('hsl.l', Math.random() * 0.6 + 0.2));
          }
          break;

        case 'split-complementary':
          colors = [
            base,
            base.set('hsl.h', '+150'),
            base.set('hsl.h', '+210'),
          ];
          // Fill remaining slots with variations
          while (colors.length < colorCount) {
            const randomBase = colors[Math.floor(Math.random() * 3)];
            colors.push(randomBase.set('hsl.l', Math.random() * 0.6 + 0.2));
          }
          break;

        default:
          colors = [base];
      }

      // Apply saturation adjustment
      if (saturationAdjust !== 0) {
        colors = colors.map(color => 
          color.set('hsl.s', Math.max(0, Math.min(1, color.get('hsl.s') + saturationAdjust / 100)))
        );
      }

      // Convert to ColorInfo objects with accessibility data
      return colors.slice(0, colorCount).map(color => {
        const hex = color.hex();
        const rgb = color.rgb();
        const hsl = color.hsl();
        
        const contrastWithWhite = chroma.contrast(color, 'white');
        const contrastWithBlack = chroma.contrast(color, 'black');

        return {
          color: hex,
          hex,
          rgb: `rgb(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])})`,
          hsl: `hsl(${Math.round(hsl[0] || 0)}, ${Math.round((hsl[1] || 0) * 100)}%, ${Math.round((hsl[2] || 0) * 100)}%)`,
          contrastWithWhite,
          contrastWithBlack,
          wcagAAWhite: contrastWithWhite >= 4.5,
          wcagAAAWhite: contrastWithWhite >= 7,
          wcagAABlack: contrastWithBlack >= 4.5,
          wcagAAABlack: contrastWithBlack >= 7,
        };
      });
    } catch (error) {
      console.error('Error generating palette:', error);
      return [];
    }
  }, []);

  // Update palette when configuration changes
  useEffect(() => {
    const newPalette = generatePalette(config);
    setPalette(newPalette);
  }, [config, generatePalette]);

  // Generate export code
  useEffect(() => {
    if (palette.length === 0) return;

    let code = '';
    
    switch (exportFormat) {
      case 'css':
        code = ':root {\n';
        palette.forEach((color, index) => {
          code += `  --color-${index + 1}: ${getColorValue(color)};\n`;
        });
        code += '}';
        break;

      case 'scss':
        palette.forEach((color, index) => {
          code += `$color-${index + 1}: ${getColorValue(color)};\n`;
        });
        break;

      case 'json':
        const jsonColors = palette.reduce((acc, color, index) => {
          acc[`color${index + 1}`] = getColorValue(color);
          return acc;
        }, {} as Record<string, string>);
        code = JSON.stringify(jsonColors, null, 2);
        break;

      case 'tailwind':
        code = '// Add to your tailwind.config.js theme.colors\n{\n';
        palette.forEach((color, index) => {
          code += `  'custom-${index + 1}': '${getColorValue(color)}',\n`;
        });
        code += '}';
        break;
    }
    
    setExportedCode(code);
  }, [palette, exportFormat, colorFormat]);

  const getColorValue = (color: ColorInfo): string => {
    switch (colorFormat) {
      case 'hex': return color.hex;
      case 'rgb': return color.rgb;
      case 'hsl': return color.hsl;
      case 'rgba': return color.rgb.replace('rgb', 'rgba').replace(')', ', 1)');
      case 'hsla': return color.hsl.replace('hsl', 'hsla').replace(')', ', 1)');
      default: return color.hex;
    }
  };

  const handleConfigChange = (updates: Partial<PaletteConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const downloadExport = () => {
    if (!exportedCode) return;

    const extensions = { css: 'css', scss: 'scss', json: 'json', tailwind: 'js' };
    const extension = extensions[exportFormat];
    const filename = `color-palette.${extension}`;
    
    const blob = new Blob([exportedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    notifications.show({
      title: 'Download Complete',
      message: `Palette exported as ${filename}`,
      color: 'green',
      icon: <IconCheck size={16} />,
    });
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    notifications.show({
      title: 'Copied',
      message: `Color ${color} copied to clipboard`,
      color: 'green',
      icon: <IconCheck size={16} />,
    });
  };

  const randomizeColors = () => {
    const randomHue = Math.floor(Math.random() * 360);
    const randomColor = chroma.hsl(randomHue, 0.7, 0.5).hex();
    handleConfigChange({ baseColor: randomColor });
  };

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <div>
          <Title order={2}>Color Palette Generator</Title>
          <Text c="dimmed">
            Generate color palettes with accessibility checks and WCAG compliance
          </Text>
        </div>
        <Button
          leftSection={<IconRefresh size={16} />}
          variant="light"
          onClick={randomizeColors}
        >
          Random Color
        </Button>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          {/* Configuration Panel */}
          <Card withBorder>
            <Stack gap="md">
              <Title order={4}>Configuration</Title>
              
              {/* Base Color Picker */}
              <Stack gap="xs">
                <Text size="sm" fw={500}>Base Color</Text>
                <ColorPicker
                  value={config.baseColor}
                  onChange={(color) => handleConfigChange({ baseColor: color })}
                  format="hex"
                  size="lg"
                  swatches={[
                    '#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2',
                    '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e',
                    '#fab005', '#fd7e14', '#ff6b35', '#ff8cc8', '#ff6b9d', '#f783ac'
                  ]}
                />
                <Text size="xs" c="dimmed">
                  Click on the color picker or use the swatches below
                </Text>
              </Stack>

              {/* Palette Scheme */}
              <Select
                label="Color Scheme"
                value={config.scheme}
                onChange={(value) => handleConfigChange({ scheme: value as PaletteScheme })}
                data={[
                  { value: 'monochromatic', label: 'Monochromatic' },
                  { value: 'analogous', label: 'Analogous' },
                  { value: 'complementary', label: 'Complementary' },
                  { value: 'triadic', label: 'Triadic' },
                  { value: 'tetradic', label: 'Tetradic' },
                  { value: 'split-complementary', label: 'Split Complementary' },
                ]}
                description={SCHEME_DESCRIPTIONS[config.scheme]}
              />

              {/* Color Count */}
              <NumberInput
                label="Number of Colors"
                value={config.colorCount}
                onChange={(value) => handleConfigChange({ colorCount: Number(value) || 5 })}
                min={2}
                max={12}
                step={1}
              />

              {/* Advanced Options */}
              <Switch
                label="Advanced Options"
                checked={showAdvanced}
                onChange={(event) => setShowAdvanced(event.currentTarget.checked)}
              />

              {showAdvanced && (
                <Stack gap="xs">
                  <Text size="sm" fw={500}>Lightness Range</Text>
                  <Box px="sm">
                    <RangeSlider
                      min={0}
                      max={100}
                      step={5}
                      defaultValue={[config.lightnessRange[0] * 100, config.lightnessRange[1] * 100]}
                      onChangeEnd={(value) => {
                        handleConfigChange({ 
                          lightnessRange: [value[0] / 100, value[1] / 100] 
                        });
                      }}
                      marks={[
                        { value: 0, label: '0%' },
                        { value: 50, label: '50%' },
                        { value: 100, label: '100%' },
                      ]}
                    />
                  </Box>

                  <Text size="sm" fw={500}>Saturation Adjustment</Text>
                  <Box px="sm">
                    <Slider
                      value={config.saturationAdjust}
                      onChangeEnd={(value) => {
                        handleConfigChange({ saturationAdjust: value });
                      }}
                      min={-50}
                      max={50}
                      step={5}
                      marks={[
                        { value: -50, label: '-50%' },
                        { value: 0, label: '0%' },
                        { value: 50, label: '+50%' },
                      ]}
                    />
                  </Box>
                </Stack>
              )}
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          {/* Palette Display */}
          <Stack gap="md">
            <Paper withBorder p="md">
              <Title order={4} mb="md">Generated Palette</Title>
              <Grid>
                {palette.map((color, index) => (
                  <Grid.Col span={{ base: 6, sm: 4, md: 3 }} key={index}>
                    <Stack align="center" gap="xs">
                      <Tooltip label={`Click to copy ${color.hex}`}>
                        <ColorSwatch
                          color={color.color}
                          size={60}
                          style={{ cursor: 'pointer' }}
                          onClick={() => copyColor(getColorValue(color))}
                        />
                      </Tooltip>
                      <Stack align="center" gap={2}>
                        <Text size="xs" fw={500}>{color.hex}</Text>
                        <Text size="xs" c="dimmed">{color.rgb}</Text>
                        <Text size="xs" c="dimmed">{color.hsl}</Text>
                      </Stack>
                    </Stack>
                  </Grid.Col>
                ))}
              </Grid>
            </Paper>

            {/* Accessibility Report */}
            <Paper withBorder p="md">
              <Group justify="space-between" mb="md">
                <Title order={4}>Accessibility Report</Title>
                <Group gap="xs">
                  <Badge color="green" size="sm">WCAG AA: 4.5:1</Badge>
                  <Badge color="blue" size="sm">WCAG AAA: 7:1</Badge>
                </Group>
              </Group>
              
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Color</Table.Th>
                    <Table.Th>Contrast vs White</Table.Th>
                    <Table.Th>Contrast vs Black</Table.Th>
                    <Table.Th>WCAG Compliance</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {palette.map((color, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>
                        <Group gap="xs">
                          <ColorSwatch color={color.color} size={20} />
                          <Text size="sm">{color.hex}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{color.contrastWithWhite.toFixed(2)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{color.contrastWithBlack.toFixed(2)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          {color.wcagAAWhite && <Badge color="green" size="xs">AA White</Badge>}
                          {color.wcagAAAWhite && <Badge color="blue" size="xs">AAA White</Badge>}
                          {color.wcagAABlack && <Badge color="green" size="xs">AA Black</Badge>}
                          {color.wcagAAABlack && <Badge color="blue" size="xs">AAA Black</Badge>}
                          {!color.wcagAAWhite && !color.wcagAABlack && (
                            <Badge color="red" size="xs">No Compliance</Badge>
                          )}
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>

            {/* Export Options */}
            <Paper withBorder p="md">
              <Title order={4} mb="md">Export Palette</Title>
              
              <Group mb="md">
                <Select
                  label="Export Format"
                  value={exportFormat}
                  onChange={(value) => setExportFormat(value as ExportFormat)}
                  data={[
                    { value: 'css', label: 'CSS Variables' },
                    { value: 'scss', label: 'SCSS Variables' },
                    { value: 'json', label: 'JSON' },
                    { value: 'tailwind', label: 'Tailwind Config' },
                  ]}
                  style={{ flex: 1 }}
                />
                <Select
                  label="Color Format"
                  value={colorFormat}
                  onChange={(value) => setColorFormat(value as ColorFormat)}
                  data={[
                    { value: 'hex', label: 'HEX' },
                    { value: 'rgb', label: 'RGB' },
                    { value: 'hsl', label: 'HSL' },
                    { value: 'rgba', label: 'RGBA' },
                    { value: 'hsla', label: 'HSLA' },
                  ]}
                  style={{ flex: 1 }}
                />
              </Group>

              <Textarea
                value={exportedCode}
                readOnly
                minRows={6}
                maxRows={12}
                mb="md"
              />

              <Group>
                <CopyButton value={exportedCode}>
                  {({ copied, copy }) => (
                    <Button
                      leftSection={<IconCopy size={16} />}
                      variant={copied ? 'light' : 'filled'}
                      color={copied ? 'teal' : 'blue'}
                      onClick={copy}
                    >
                      {copied ? 'Copied!' : 'Copy Code'}
                    </Button>
                  )}
                </CopyButton>
                <Button
                  leftSection={<IconDownload size={16} />}
                  variant="outline"
                  onClick={downloadExport}
                >
                  Download
                </Button>
              </Group>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Info Alert */}
      <Alert icon={<IconInfoCircle size={16} />} title="About WCAG Compliance" color="blue">
        <Text size="sm">
          WCAG (Web Content Accessibility Guidelines) defines contrast ratios for text readability:
          <br />• <strong>AA Standard:</strong> Minimum 4.5:1 for normal text, 3:1 for large text
          <br />• <strong>AAA Standard:</strong> Minimum 7:1 for normal text, 4.5:1 for large text
          <br />Colors with better contrast ratios are more accessible to users with visual impairments.
        </Text>
      </Alert>
    </Stack>
  );
}