'use client';

import { Card, Stack, Group, Text, Slider } from '@mantine/core';
import { LogoConfig } from '../types';

interface SizeSectionProps {
  config: LogoConfig;
  onUpdateConfig: (updates: Partial<LogoConfig>) => void;
}

export function SizeSection({ config, onUpdateConfig }: SizeSectionProps) {
  return (
    <Card withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={500}>Size</Text>
          <Text size="sm" c="dimmed">{config.size}px</Text>
        </Group>
        <Slider
          value={config.size}
          onChange={(value) => onUpdateConfig({ size: value })}
          min={50}
          max={300}
          step={10}
          marks={[
            { value: 50, label: '50px' },
            { value: 150, label: '150px' },
            { value: 300, label: '300px' },
          ]}
        />
      </Stack>
    </Card>
  );
}