'use client';

import { Card, Text, Group, Badge, Stack, Box } from '@mantine/core';
import { ToolDefinition } from '@/app/lib/types';
import { useAppContext } from '@/app/providers/app-context';
import Link from 'next/link';

interface ToolCardProps {
  tool: ToolDefinition;
  isHighlighted?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ToolCard({ tool, isHighlighted, onClick, className }: ToolCardProps) {
  const { addRecentTool } = useAppContext();

  const handleClick = () => {
    addRecentTool(tool.id);
    onClick?.();
  };

  if (tool.id.startsWith('coming-soon')) {
    return (
      <Card
        className={`tool-card ${className || ''}`}
        style={{ 
          opacity: 0.5,
          cursor: 'not-allowed',
          height: '160px',
          border: '2px dashed var(--mantine-color-gray-4)'
        }}
        p="md"
      >
        <Stack align="center" justify="center" h="100%">
          <Text size="2rem">{tool.icon}</Text>
          <Text size="sm" ta="center" c="dimmed">{tool.name}</Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card
      component={Link}
      href={tool.path}
      className={`tool-card ${className || ''} ${isHighlighted ? 'highlighted' : ''}`}
      style={{ 
        textDecoration: 'none',
        color: 'inherit',
        height: '180px',
        cursor: 'pointer',
        border: isHighlighted ? '3px solid var(--mantine-color-blue-6)' : undefined
      }}
      p="md"
      onClick={handleClick}
      shadow={isHighlighted ? 'md' : 'sm'}
    >
      <Stack gap="xs" h="100%">
        <Group justify="space-between" align="flex-start">
          <Text size="2rem">{tool.icon}</Text>
          {tool.featured && (
            <Badge size="xs" variant="light" color="yellow">
              Featured
            </Badge>
          )}
        </Group>
        
        <Box flex={1}>
          <Text fw={600} size="sm" lineClamp={1}>
            {tool.name}
          </Text>
          <Text size="xs" c="dimmed" lineClamp={2} mt={4}>
            {tool.description}
          </Text>
        </Box>
        
        <Badge 
          size="xs" 
          variant="outline" 
          color="gray"
          style={{ alignSelf: 'flex-start' }}
        >
          {tool.category.replace('-', ' ')}
        </Badge>
      </Stack>
    </Card>
  );
}