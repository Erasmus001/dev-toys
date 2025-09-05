'use client';

import { Container, Title, Text, Stack, Button, Paper } from '@mantine/core';
import { Header } from '@/app/components/layout/Header';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';

interface ComingSoonProps {
  toolName: string;
  description: string;
}

export function ComingSoon({ toolName, description }: ComingSoonProps) {
  return (
    <>
      <Header title={`${toolName} - Dev Tools`} />
      
      <Container size="md" py="xl">
        <Paper p="xl" radius="lg" style={{ textAlign: 'center' }}>
          <Stack gap="lg" align="center">
            <Text size="4rem">🚧</Text>
            
            <Title order={1} size="2rem">
              {toolName}
            </Title>
            
            <Text size="lg" c="dimmed" maw={500}>
              {description}
            </Text>
            
            <Text size="md" c="dimmed">
              This tool is coming soon! We're working hard to bring you the best developer utilities.
            </Text>
            
            <Button
              component={Link}
              href="/"
              leftSection={<IconArrowLeft size={16} />}
              size="md"
            >
              Back to Home
            </Button>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}