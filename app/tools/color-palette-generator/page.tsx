import { Metadata } from 'next';
import { ToolLayout } from '@/app/components/tools/ToolLayout';
import ColorPaletteGeneratorTool from './ColorPaletteGeneratorTool';

export const metadata: Metadata = {
  title: 'Color Palette Generator - Dev Tools',
  description: 'Generate color palettes with accessibility checks and WCAG compliance. Create monochromatic, analogous, complementary, and other color schemes with real-time contrast ratio analysis.',
  keywords: ['color palette', 'color schemes', 'accessibility', 'WCAG', 'contrast ratio', 'color generator', 'design tools'],
};

export default function ColorPaletteGeneratorPage() {
  return (
    <ToolLayout
      title="Color Palette Generator"
      description="Generate beautiful color palettes with accessibility checks and WCAG compliance"
    >
      <ColorPaletteGeneratorTool />
    </ToolLayout>
  );
}