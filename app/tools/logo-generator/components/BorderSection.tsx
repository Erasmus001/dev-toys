'use client';

import { Card, Stack, Group, Text, Slider, ColorPicker } from '@mantine/core';
import { LogoConfig } from '../types';

interface BorderSectionProps {
  config: LogoConfig;
  onUpdateConfig: (updates: Partial<LogoConfig>) => void;
}

export function BorderSection({ config, onUpdateConfig }: BorderSectionProps) {
  return (
    <Card withBorder>
      <Stack gap="md">
        <Text fw={500}>Border</Text>
        
        <Group justify="space-between">
          <Text size="sm">Width</Text>
          <Text size="sm" c="dimmed">{config.borderWidth}px</Text>
        </Group>
        <Slider
          value={config.borderWidth}
          onChange={(value) => onUpdateConfig({ borderWidth: value })}
          min={0}
          max={20}
          step={1}
        />

        <Stack gap="xs">
          <Text size="sm">Color</Text>
          <ColorPicker
            value={config.borderColor}
            onChange={(color) => onUpdateConfig({ borderColor: color })}
            format="hex"
            size="sm"
          />
        </Stack>
      </Stack>
    </Card>
  );
}