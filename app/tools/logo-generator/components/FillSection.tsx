'use client';

import { Card, Stack, Group, Text, Slider, ColorPicker } from '@mantine/core';
import { LogoConfig } from '../types';

interface FillSectionProps {
  config: LogoConfig;
  onUpdateConfig: (updates: Partial<LogoConfig>) => void;
}

export function FillSection({ config, onUpdateConfig }: FillSectionProps) {
  return (
    <Card withBorder>
      <Stack gap="md">
        <Text fw={500}>Fill</Text>
        
        <Group justify="space-between">
          <Text size="sm">Opacity</Text>
          <Text size="sm" c="dimmed">{config.fillOpacity}%</Text>
        </Group>
        <Slider
          value={config.fillOpacity}
          onChange={(value) => onUpdateConfig({ fillOpacity: value })}
          min={0}
          max={100}
          step={5}
          marks={[
            { value: 0, label: '0%' },
            { value: 50, label: '50%' },
            { value: 100, label: '100%' },
          ]}
        />

        <Stack gap="xs">
          <Text size="sm">Color</Text>
          <ColorPicker
            value={config.fillColor}
            onChange={(color) => onUpdateConfig({ fillColor: color })}
            format="hex"
            size="sm"
          />
        </Stack>
      </Stack>
    </Card>
  );
}