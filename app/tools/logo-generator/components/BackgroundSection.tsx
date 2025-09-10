'use client';

import { Card, Stack, Text, Select, ColorPicker } from '@mantine/core';
import { LogoConfig } from '../types';

export type BackgroundType = 'solid' | 'gradient';

interface BackgroundSectionProps {
  config: LogoConfig;
  onUpdateConfig: (updates: Partial<LogoConfig>) => void;
}

export function BackgroundSection({ config, onUpdateConfig }: BackgroundSectionProps) {
  return (
    <Card withBorder>
      <Stack gap="md">
        <Text fw={500}>Background</Text>
        
        <Select
          label="Type"
          value={config.backgroundType}
          onChange={(value) => onUpdateConfig({ backgroundType: value as BackgroundType })}
          data={[
            { value: 'solid', label: 'Solid Color' },
            { value: 'gradient', label: 'Gradient' },
          ]}
        />

        {config.backgroundType === 'solid' ? (
          <Stack gap="xs">
            <Text size="sm">Color</Text>
            <ColorPicker
              value={config.backgroundColor}
              onChange={(color) => onUpdateConfig({ backgroundColor: color })}
              format="hex"
              size="sm"
            />
          </Stack>
        ) : (
          <Stack gap="xs">
            <Text size="sm">From Color</Text>
            <ColorPicker
              value={config.gradientFrom}
              onChange={(color) => onUpdateConfig({ gradientFrom: color })}
              format="hex"
              size="sm"
            />
            <Text size="sm">To Color</Text>
            <ColorPicker
              value={config.gradientTo}
              onChange={(color) => onUpdateConfig({ gradientTo: color })}
              format="hex"
              size="sm"
            />
          </Stack>
        )}
      </Stack>
    </Card>
  );
}