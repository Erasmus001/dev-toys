'use client';

import { Stack } from '@mantine/core';
import { IconSection } from './IconSection';
import { BackgroundSection } from './BackgroundSection';
import { SizeSection } from './SizeSection';
import { RotationSection } from './RotationSection';
import { BorderSection } from './BorderSection';
import { FillSection } from './FillSection';
import { LogoConfig } from '../types';

interface ControlPanelProps {
  config: LogoConfig;
  onUpdateConfig: (updates: Partial<LogoConfig>) => void;
  onOpenIconPicker: () => void;
}

export function ControlPanel({ config, onUpdateConfig, onOpenIconPicker }: ControlPanelProps) {
  return (
    <Stack gap="md">
      <IconSection config={config} onOpenIconPicker={onOpenIconPicker} />
      <BackgroundSection config={config} onUpdateConfig={onUpdateConfig} />
      <SizeSection config={config} onUpdateConfig={onUpdateConfig} />
      <RotationSection config={config} onUpdateConfig={onUpdateConfig} />
      <BorderSection config={config} onUpdateConfig={onUpdateConfig} />
      <FillSection config={config} onUpdateConfig={onUpdateConfig} />
    </Stack>
  );
}