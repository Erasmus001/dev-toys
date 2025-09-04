'use client';

import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AppContextProvider } from '@/app/providers/app-context';

// Simplified theme configuration for strict black/white contrast
const theme = createTheme({
  fontFamily: 'var(--font-geist-sans), sans-serif',
  fontFamilyMonospace: 'var(--font-geist-mono), monospace',
  primaryColor: 'blue',
  defaultRadius: 'md',
  
  // Strict color definitions
  white: '#ffffff',
  black: '#000000',
  
  colors: {
    // Override dark colors for proper theming
    dark: [
      '#ffffff', // 0 - white for light mode text
      '#f8f9fa', // 1
      '#e9ecef', // 2
      '#dee2e6', // 3
      '#ced4da', // 4
      '#adb5bd', // 5
      '#6c757d', // 6
      '#495057', // 7
      '#343a40', // 8
      '#000000'  // 9 - black for dark mode backgrounds
    ]
  },
  
  // Component defaults with proper theming
  components: {
    Button: {
      defaultProps: {
        variant: 'filled',
        size: 'sm',
      },
    },
    TextInput: {
      defaultProps: {
        size: 'md',
      },
    },
    Textarea: {
      defaultProps: {
        size: 'md',
        autosize: true,
        minRows: 3,
      },
    },
    Card: {
      defaultProps: {
        shadow: 'sm',
        padding: 'lg',
      },
    },
    Modal: {
      defaultProps: {
        centered: true,
        size: 'md',
      },
    },
  },
  
  headings: {
    fontFamily: 'var(--font-geist-sans), sans-serif',
  },
});

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Notifications position="top-right" limit={5} />
      <AppContextProvider>
        {children}
      </AppContextProvider>
    </MantineProvider>
  );
}