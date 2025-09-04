'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMantineColorScheme } from '@mantine/core';
import { AppContextType, STORAGE_KEYS } from '@/app/lib/types';

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextProviderProps {
  children: React.ReactNode;
}

export function AppContextProvider({ children }: AppContextProviderProps) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [recentTools, setRecentTools] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load recent tools from localStorage on mount
  useEffect(() => {
    const savedRecentTools = localStorage.getItem(STORAGE_KEYS.RECENT_TOOLS);
    if (savedRecentTools) {
      try {
        setRecentTools(JSON.parse(savedRecentTools));
      } catch (error) {
        console.error('Failed to parse recent tools from localStorage:', error);
      }
    }
  }, []);

  // Save recent tools to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECENT_TOOLS, JSON.stringify(recentTools));
  }, [recentTools]);

  const addRecentTool = (toolId: string) => {
    setRecentTools((prev) => {
      const filtered = prev.filter(id => id !== toolId);
      const updated = [toolId, ...filtered].slice(0, 10); // Keep only last 10
      return updated;
    });
  };

  const setTheme = (theme: 'light' | 'dark') => {
    setColorScheme(theme);
  };

  const contextValue: AppContextType = {
    theme: colorScheme as 'light' | 'dark',
    setTheme,
    recentTools,
    addRecentTool,
    searchQuery,
    setSearchQuery,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}