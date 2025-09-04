'use client';

import { 
  Container, 
  Title, 
  Text, 
  Stack, 
  Group, 
  ActionIcon,
  Breadcrumbs,
  Anchor
} from '@mantine/core';
import { IconArrowLeft, IconHome } from '@tabler/icons-react';
import { Header } from '../layout/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  showBackButton?: boolean;
}

export function ToolLayout({ 
  title, 
  description, 
  children, 
  actions, 
  showBackButton = true 
}: ToolLayoutProps) {
  const router = useRouter();

  const breadcrumbItems = [
    { title: 'Home', href: '/' },
    { title: title, href: '#' },
  ].map((item, index) => (
    <Anchor 
      component={Link}
      href={item.href} 
      key={index}
      size="sm"
    >
      {item.title}
    </Anchor>
  ));

  return (
    <>
      <Header title={`${title} - DevTools Mini`} />
      
      <Container size="xl" py="lg" mt={"md"}>
        <Stack gap="lg">
          {/* Breadcrumbs */}
          <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>
          
          {/* Tool Header */}
          <Group justify="space-between" align="flex-start">
            <Stack gap="xs">
              <Group align="center" gap="md">
                {showBackButton && (
                  <ActionIcon
                    variant="subtle"
                    size="lg"
                    onClick={() => router.back()}
                    title="Go back"
                  >
                    <IconArrowLeft size={18} />
                  </ActionIcon>
                )}
                
                <Title order={1} size="2rem">
                  {title}
                </Title>
              </Group>
              
              <Text size="lg" c="dimmed" maw={600}>
                {description}
              </Text>
            </Stack>
            
            {actions && (
              <Group gap="sm">
                {actions}
              </Group>
            )}
          </Group>
          
          {/* Tool Content */}
          {children}
        </Stack>
      </Container>
    </>
  );
}