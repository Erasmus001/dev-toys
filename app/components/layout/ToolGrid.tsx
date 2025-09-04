'use client';

import { SimpleGrid, Text, Center, Stack } from '@mantine/core';
import { ToolDefinition } from '@/app/lib/types';
import { TOOLS, EMPTY_TOOL_PLACEHOLDER, GRID_CONFIG } from '@/app/lib/constants';
import { ToolCard } from '../tools/ToolCard';
import { useMemo } from 'react';

interface ToolGridProps {
  tools?: ToolDefinition[];
  searchQuery?: string;
  onToolSelect?: (toolId: string) => void;
  className?: string;
}

export function ToolGrid({ 
  tools = TOOLS, 
  searchQuery = '', 
  onToolSelect, 
  className 
}: ToolGridProps) {
  
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) {
      return tools;
    }
    
    const query = searchQuery.toLowerCase();
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.tags.some(tag => tag.toLowerCase().includes(query)) ||
      tool.category.toLowerCase().includes(query)
    );
  }, [tools, searchQuery]);

  // Create grid with empty cells for 5x5 layout
  const gridItems = useMemo(() => {
    const items: (ToolDefinition | null)[] = [];
    
    if (searchQuery.trim()) {
      // When searching, show only filtered results
      return filteredTools;
    }
    
    // For main grid, fill 25 slots (5x5)
    for (let i = 0; i < GRID_CONFIG.totalCells; i++) {
      if (i < filteredTools.length) {
        items.push(filteredTools[i]);
      } else {
        // Create unique placeholder for each empty slot
        items.push({
          ...EMPTY_TOOL_PLACEHOLDER,
          id: `coming-soon-${i}`
        });
      }
    }
    
    return items;
  }, [filteredTools, searchQuery]);

  if (searchQuery.trim() && filteredTools.length === 0) {
    return (
      <Center h={300}>
        <Stack align="center" gap="md">
          <Text size="xl">🔍</Text>
          <Text size="lg" fw={500}>No tools found</Text>
          <Text size="sm" c="dimmed" ta="center">
            Try adjusting your search query or browse all tools
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <SimpleGrid
      cols={{ base: 2, xs: 3, sm: 4, md: 4, lg: 4 }}
      spacing="md"
      className={className}
    >
      {gridItems.map((tool, index) => (
        <ToolCard
          key={tool?.id || `empty-${index}`}
          tool={tool || EMPTY_TOOL_PLACEHOLDER}
          isHighlighted={
            Boolean(
              searchQuery.trim() !== '' && 
              tool?.id && !tool.id.startsWith('coming-soon') &&
              (tool?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               tool?.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
            )
          }
          onClick={() => tool?.id && !tool.id.startsWith('coming-soon') && onToolSelect?.(tool.id)}
        />
      ))}
    </SimpleGrid>
  );
}