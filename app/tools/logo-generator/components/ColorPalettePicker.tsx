'use client';

import { Group, ActionIcon, Tooltip } from '@mantine/core';
import { COLOR_PALETTES } from '../constants';

interface ColorPalettePickerProps {
  onApplyPalette: (palette: typeof COLOR_PALETTES[0]) => void;
}

export function ColorPalettePicker({ onApplyPalette }: ColorPalettePickerProps) {
  return (
    <Group>
      {COLOR_PALETTES.map((palette, index) => (
        <Tooltip key={index} label={palette.name}>
          <ActionIcon
            size="lg"
            variant="outline"
            onClick={() => onApplyPalette(palette)}
            style={{
              background: `linear-gradient(45deg, ${palette.colors[1]}, ${palette.colors[2]})`,
              border: 'none',
            }}
          />
        </Tooltip>
      ))}
    </Group>
  );
}