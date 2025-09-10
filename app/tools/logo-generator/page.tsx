import { Metadata } from 'next';
import { ToolLayout } from '@/app/components/tools/ToolLayout';
import LogoGeneratorTool from './LogoGeneratorTool';

export const metadata: Metadata = {
  title: 'Logo Generator - Dev Tools',
  description: 'Create professional logos with icons, gradients, and customizable styles. Generate logos fast with our intuitive logo maker tool.',
  keywords: ['logo generator', 'logo maker', 'icon generator', 'brand design', 'logo design', 'graphics', 'branding'],
};

export default function LogoGeneratorPage() {
  return (
    <ToolLayout
      title="Logo Generator"
      description="Create professional logos with icons, gradients, and customizable styles"
    >
      <LogoGeneratorTool />
    </ToolLayout>
  );
}