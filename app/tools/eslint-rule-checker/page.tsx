import { Metadata } from 'next';
import { ToolLayout } from '@/app/components/tools/ToolLayout';
import ESLintRuleCheckerTool from './ESLintRuleCheckerTool';

export const metadata: Metadata = {
  title: 'ESLint Rule Checker - Dev Tools',
  description: 'Check JavaScript and TypeScript code against ESLint rules with auto-fix support. Validate code quality and style with popular configurations like Airbnb.',
  keywords: ['eslint', 'javascript', 'typescript', 'linting', 'code quality', 'static analysis', 'auto-fix'],
};

export default function ESLintRuleCheckerPage() {
  return (
    <ToolLayout
      title="ESLint Rule Checker"
      description="Check JavaScript and TypeScript code against common linting rules with auto-fix support"
    >
      <ESLintRuleCheckerTool />
    </ToolLayout>
  );
}