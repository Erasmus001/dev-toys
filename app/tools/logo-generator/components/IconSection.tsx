'use client';

import { Card, Stack, Group, Text, Badge, Button } from '@mantine/core';
import { LogoConfig } from '../types';

interface IconSectionProps {
  config: LogoConfig;
  onOpenIconPicker: () => void;
}

export function IconSection({ config, onOpenIconPicker }: IconSectionProps) {
  return (
    <Card withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={500}>Icon</Text>
          <Badge variant="light">{config.iconName}</Badge>
        </Group>
        
        <Button
          variant="light"
          leftSection={<config.selectedIcon size={20} />}
          onClick={onOpenIconPicker}
          fullWidth
        >
          {config.iconName}
        </Button>
      </Stack>
    </Card>
  );
}