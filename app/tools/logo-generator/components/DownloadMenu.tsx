'use client';

import { Button, Menu, rem } from '@mantine/core';
import {
  IconDownload,
  IconChevronDown,
  IconPhoto,
  IconFileTypeSvg,
  IconDeviceDesktop,
} from '@tabler/icons-react';

interface DownloadMenuProps {
  onExportPNG: () => void;
  onExportJPEG: () => void;
  onExportSVG: () => void;
  onExportFavicon: () => void;
}

export function DownloadMenu({ 
  onExportPNG, 
  onExportJPEG, 
  onExportSVG, 
  onExportFavicon 
}: DownloadMenuProps) {
  return (
    <Menu shadow="md" width={180}>
      <Menu.Target>
        <Button
          leftSection={<IconDownload size={16} />}
          rightSection={<IconChevronDown size={13} />}
          size="sm"
        >
          Export
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconPhoto size={13} />}
          onClick={onExportPNG}
          fz="sm"
        >
          PNG
        </Menu.Item>
        <Menu.Item
          leftSection={<IconPhoto size={13} />}
          onClick={onExportJPEG}
          fz="sm"
        >
          JPEG
        </Menu.Item>
        <Menu.Item
          leftSection={<IconFileTypeSvg size={13} />}
          onClick={onExportSVG}
          fz="sm"
        >
          SVG
        </Menu.Item>
        <Menu.Item
          leftSection={<IconDeviceDesktop size={13} />}
          onClick={onExportFavicon}
          fz="sm"
        >
          Favicon
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}