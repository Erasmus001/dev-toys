'use client';

import { useState, useMemo } from 'react';
import {
  Modal,
  Stack,
  TextInput,
  SimpleGrid,
  ActionIcon,
  Tooltip,
  Select,
  Group,
  Text,
  Badge,
  ScrollArea,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { ICON_DATABASE, ICON_CATEGORIES } from '../constants';

interface IconPickerProps {
  opened: boolean;
  onClose: () => void;
  onSelectIcon: (iconComponent: any, iconName: string) => void;
}

export function IconPicker({ opened, onClose, onSelectIcon }: IconPickerProps) {
  const [iconSearch, setIconSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Advanced filtering with search and category
  const filteredIcons = useMemo(() => {
    let filtered = ICON_DATABASE;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(icon => icon.category === selectedCategory);
    }

    // Filter by search term (name and keywords)
    if (iconSearch.trim()) {
      const searchLower = iconSearch.toLowerCase().trim();
      filtered = filtered.filter(icon => {
        const nameMatch = icon.name.toLowerCase().includes(searchLower);
        const keywordMatch = icon.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchLower)
        );
        return nameMatch || keywordMatch;
      });
    }

    return filtered;
  }, [iconSearch, selectedCategory]);

  const handleSelectIcon = (iconComponent: any, iconName: string) => {
    onSelectIcon(iconComponent, iconName);
    onClose();
    setIconSearch(''); // Clear search when closing
    setSelectedCategory('all'); // Reset category
  };

  const handleClose = () => {
    onClose();
    setIconSearch(''); // Clear search when closing
    setSelectedCategory('all'); // Reset category
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Pick an icon"
      size="xl"
    >
      <Stack gap="md">
        {/* Search and Filter Controls */}
        <Group>
          <TextInput
            placeholder="Search icons by name or keyword..."
            leftSection={<IconSearch size={16} />}
            value={iconSearch}
            onChange={(e) => setIconSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Category"
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value || 'all')}
            data={ICON_CATEGORIES.map(cat => ({
              value: cat,
              label: cat.charAt(0).toUpperCase() + cat.slice(1)
            }))}
            w={150}
          />
        </Group>

        {/* Results Info */}
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''} found
          </Text>
          {selectedCategory !== 'all' && (
            <Badge variant="light" size="sm">
              {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
            </Badge>
          )}
        </Group>
        
        {/* Icon Grid */}
        <ScrollArea h={400}>
          <SimpleGrid cols={10} spacing="xs">
            {filteredIcons.map((iconData, index) => (
              <Tooltip 
                key={`${iconData.category}-${iconData.name}-${index}`} 
                label={`${iconData.name} (${iconData.category})`}
                position="bottom"
              >
                <ActionIcon
                  size="xl"
                  variant="light"
                  onClick={() => handleSelectIcon(iconData.icon, iconData.name)}
                  style={{ cursor: 'pointer' }}
                >
                  <iconData.icon size={24} />
                </ActionIcon>
              </Tooltip>
            ))}
          </SimpleGrid>
          
          {filteredIcons.length === 0 && (
            <Text ta="center" c="dimmed" py="xl">
              No icons found matching your search criteria.
              <br />
              Try different keywords or select a different category.
            </Text>
          )}
        </ScrollArea>
      </Stack>
    </Modal>
  );
}