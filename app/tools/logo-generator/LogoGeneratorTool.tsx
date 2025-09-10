'use client';

import { useState, useRef } from 'react';
import { Stack, Group, Title, Text, Grid } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconApple } from '@tabler/icons-react';
import { FaApple } from 'react-icons/fa';

// Components
import { IconPicker } from './components/IconPicker';
import { DownloadMenu } from './components/DownloadMenu';
import { ColorPalettePicker } from './components/ColorPalettePicker';
import { ControlPanel } from './components/ControlPanel';
import { LogoCanvas } from './components/LogoCanvas';

// Types and constants
import { LogoConfig } from './types';
import { COLOR_PALETTES } from './constants';
import { LogoExporter } from './LogoExporter';

export default function LogoGeneratorTool() {
  const [config, setConfig] = useState<LogoConfig>({
    selectedIcon: FaApple,
    iconName: 'Apple',
    backgroundType: 'gradient',
    backgroundColor: '#FF6B35',
    gradientFrom: '#FF6B35',
    gradientTo: '#F7931E',
    size: 200,
    rotation: 0,
    borderWidth: 0,
    borderColor: '#000000',
    fillOpacity: 100,
    fillColor: '#FFFFFF',
    canvasSize: 400,
    borderRadius: 20,
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const [iconPickerOpened, { open: openIconPicker, close: closeIconPicker }] = useDisclosure(false);

  // Handle configuration changes
  const updateConfig = (updates: Partial<LogoConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  // Handle icon selection
  const selectIcon = (iconComponent: any, iconName: string) => {
    updateConfig({ selectedIcon: iconComponent, iconName });
  };

  // Handle color palette selection
  const applyColorPalette = (palette: typeof COLOR_PALETTES[0]) => {
    updateConfig({
      backgroundColor: palette.colors[0],
      gradientFrom: palette.colors[1],
      gradientTo: palette.colors[2],
      fillColor: palette.colors[3],
      borderColor: palette.colors[4],
    });
  };

  // Create exporter instance
  const exporter = new LogoExporter(config, canvasRef);

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <div>
          <Title order={2}>Logo Generator</Title>
          <Text c="dimmed">
            Create professional logos with icons, gradients, and customizable styles
          </Text>
        </div>
        <Group>
          <ColorPalettePicker onApplyPalette={applyColorPalette} />
          <DownloadMenu
            onExportPNG={() => exporter.exportAsPNG()}
            onExportJPEG={() => exporter.exportAsJPEG()}
            onExportSVG={() => exporter.exportAsSVG()}
            onExportFavicon={() => exporter.exportAsFavicon()}
          />
        </Group>
      </Group>

      <Grid>
        {/* Left Control Panel */}
        <Grid.Col span={{ base: 12, lg: 3 }}>
          <ControlPanel
            config={config}
            onUpdateConfig={updateConfig}
            onOpenIconPicker={openIconPicker}
          />
        </Grid.Col>

        {/* Center Canvas Area */}
        <Grid.Col span={{ base: 12, lg: 9 }}>
          <LogoCanvas ref={canvasRef} config={config} />
        </Grid.Col>
      </Grid>

      {/* Icon Picker Modal */}
      <IconPicker
        opened={iconPickerOpened}
        onClose={closeIconPicker}
        onSelectIcon={selectIcon}
      />
    </Stack>
  );
}