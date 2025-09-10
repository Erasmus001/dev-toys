'use client';

import { Card, Stack, Group, Text, Slider } from '@mantine/core';
import { LogoConfig } from '../types';

interface RotationSectionProps {
  config: LogoConfig;
  onUpdateConfig: (updates: Partial<LogoConfig>) => void;
}

export function RotationSection({ config, onUpdateConfig }: RotationSectionProps) {
  return (
    <Card withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={500}>Rotate</Text>
          <Text size="sm" c="dimmed">{config.rotation}°</Text>
        </Group>
        <Slider
          value={config.rotation}
          onChange={(value) => onUpdateConfig({ rotation: value })}
          min={-180}
          max={180}
          step={15}
          marks={[
            { value: -180, label: '-180°' },
            { value: 0, label: '0°' },
            { value: 180, label: '180°' },
          ]}
        />
      </Stack>
    </Card>
  );
}