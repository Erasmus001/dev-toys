'use client';

import { 
  Group, 
  Text, 
  ActionIcon, 
  TextInput, 
  Box
} from '@mantine/core';
import { 
  IconSearch, 
  IconSun, 
  IconMoon
} from '@tabler/icons-react';
import { useMantineColorScheme } from '@mantine/core';
import { useAppContext } from '@/app/providers/app-context';
import { APP_CONFIG } from '@/app/lib/constants';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showThemeToggle?: boolean;
  onSearchChange?: (query: string) => void;
}

export function Header({ 
  title,
  showSearch = true, 
  showThemeToggle = true,
  onSearchChange 
}: HeaderProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { searchQuery, setSearchQuery } = useAppContext();
  const [mounted, setMounted] = useState(false);

  // Ensure this component only renders theme-dependent content after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  const displayTitle = title || APP_CONFIG.name;

  return (
    <Box 
      component="header" 
      style={{
        borderBottom: '1px solid var(--mantine-color-gray-3)',
        background: 'var(--background)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
      p="md"
    >
      <Group justify="space-between" align="center">
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Group align="center" gap="xs">
            <Text size="xl" fw={700} c="blue">🛠️</Text>
            <Text size="xl" fw={700}>{displayTitle}</Text>
          </Group>
        </Link>

        <Group align="center" gap="md">
          {showSearch && (
            <TextInput
              placeholder="Search tools..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(event) => handleSearchChange(event.currentTarget.value)}
              style={{ minWidth: 200 }}
              size="sm"
            />
          )}
          
          {showThemeToggle && mounted && (
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={() => toggleColorScheme()}
              title={`Switch to ${colorScheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {colorScheme === 'dark' ? (
                <IconSun size={18} />
              ) : (
                <IconMoon size={18} />
              )}
            </ActionIcon>
          )}
        </Group>
      </Group>
    </Box>
  );
}