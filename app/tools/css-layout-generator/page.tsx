import { ToolLayout } from '../../components/tools/ToolLayout';
import CssLayoutGeneratorTool from './CssLayoutGeneratorTool';

export default function CssLayoutGeneratorPage() {
  return (
    <ToolLayout
      title="CSS Layout Generator"
      description="Generate Flexbox and Grid layouts with Tailwind support and accessibility checks"
    >
      <CssLayoutGeneratorTool />
    </ToolLayout>
  );
}