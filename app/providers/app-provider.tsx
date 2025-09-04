'use client';

import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AppContextProvider } from '@/app/providers/app-context';

// Mantine theme configuration
const theme = createTheme({
  fontFamily: 'var(--font-geist-sans), sans-serif',
  fontFamilyMonospace: 'var(--font-geist-mono), monospace',
  primaryColor: 'blue',
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        variant: 'filled',
        size: 'md',
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