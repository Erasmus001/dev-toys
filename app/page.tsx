'use client';

import { Container, Title, Text, Stack } from '@mantine/core';
import { Header } from './components/layout/Header';
import { ToolGrid } from './components/layout/ToolGrid';
import { useAppContext } from './providers/app-context';
import { APP_CONFIG } from './lib/constants';

export default function HomePage() {
  const { searchQuery } = useAppContext();

  return (
    <>
      <Header />
      
      <Container size="xl" py="xl">
        <Stack gap="xl">
          {/* Hero Section */}
          <Stack align="center" gap="md" ta="center">
            <Title 
              order={1} 
              size="3rem" 
              fw={800}
              style={{
                background: 'linear-gradient(45deg, var(--mantine-color-blue-6), var(--mantine-color-cyan-6))',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              {APP_CONFIG.name}
            </Title>
            
            <Text 
              size="xl" 
              c="dimmed" 
              maw={600} 
              mx="auto"
            >
              {APP_CONFIG.description}
            </Text>
            
            <Text size="md" c="dimmed">
              Choose from 17 essential developer tools
            </Text>
          </Stack>

          {/* Tools Grid */}
          <ToolGrid searchQuery={searchQuery} />
          
          {/* Footer Info */}
          <Stack align="center" gap="xs" mt="xl">
            <Text size="sm" c="dimmed" ta="center">
              All tools process data locally in your browser. No data is transmitted or stored.
            </Text>
            <Text size="xs" c="dimmed">
              Version {APP_CONFIG.version} • Built with Next.js & Mantine
            </Text>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
