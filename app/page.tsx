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
      
      <div className='w-full max-w-7xl mx-auto px-4' style={{ backgroundColor: 'transparent' }}>
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-10' style={{ backgroundColor: 'transparent' }}>
          <div className='w-full flex items-center justify-center flex-col gap-y-4 text-center'>
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
          </div>

          {/* Tools Grid */}
          <ToolGrid searchQuery={searchQuery} />
          
          {/* Footer Info */}
          <div className='w-full text-center space-y-4' style={{ color: 'var(--foreground)' }}>
            <Text size="sm" c="dimmed" ta="center">
              All tools process data locally in your browser. No data is transmitted or stored.
            </Text>
            <Text size="xs" c="dimmed">
              Version {APP_CONFIG.version} • Built with Next.js & Mantine
            </Text>
          </div>
        </div>
      </div>
    </>
  );
}
