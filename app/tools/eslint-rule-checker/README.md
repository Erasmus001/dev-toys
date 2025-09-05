# ESLint Rule Checker

A comprehensive browser-based ESLint rule checker that validates JavaScript and TypeScript code against common linting rules with auto-fix support. This tool processes all code locally without any server transmission.

## Features

### 🔍 Code Analysis
- **Multi-language Support**: JavaScript and TypeScript code validation
- **File Upload**: Drag-and-drop support for .js, .ts, .jsx, .tsx files
- **Real-time Linting**: Auto-lint with debouncing for performance
- **Custom Rules**: JSON-based custom rule configuration

### 📋 Rule Configurations
- **ESLint Recommended**: Core ESLint rules for catching common errors
- **Airbnb Style Guide**: Popular JavaScript style guide rules
- **Strict Rules**: Enhanced rules with complexity and quality checks
- **Custom Override**: JSON input for custom rule definitions

### 🔧 Auto-Fix Support
- **Automatic Fixes**: Apply fixes for auto-fixable rules
- **Fix Preview**: See fixed code before applying changes
- **Selective Fixing**: Choose which fixes to apply
- **Download Fixed**: Export corrected code as files

### 📊 Detailed Results
- **Error/Warning Counts**: Clear categorization of issues
- **Line/Column Tracking**: Precise issue locations
- **Rule Information**: Detailed rule ID and descriptions
- **Fixable Indicators**: Visual markers for auto-fixable issues

## Supported Rules

### Core Rules
- `no-unused-vars`: Detect unused variables
- `no-undef`: Flag undefined variables
- `no-console`: Warn about console statements
- `no-debugger`: Prevent debugger statements
- `no-var`: Prefer let/const over var
- `prefer-const`: Use const when possible

### Style Rules
- `quotes`: Enforce quote style (single/double)
- `semi`: Require or disallow semicolons
- `indent`: Enforce consistent indentation
- `no-trailing-spaces`: Disallow trailing whitespace
- `comma-dangle`: Require trailing commas

### Quality Rules
- `eqeqeq`: Require strict equality operators
- `max-len`: Enforce maximum line length
- `complexity`: Limit cyclomatic complexity
- `no-magic-numbers`: Disallow magic numbers
- `no-empty`: Disallow empty blocks

## Technology Stack

- **Framework**: Next.js 15.5.2 with App Router
- **UI Library**: Mantine 8.2.8 (Textarea, Tabs, Dropzone, Table)
- **Linting Engine**: Custom SimpleLinter class for browser compatibility
- **File Processing**: FileReader API for client-side file handling
- **Performance**: useDebouncedValue for optimized auto-linting

## Usage Guide

### Getting Started
1. **Select Configuration**: Choose from Recommended, Airbnb, or Strict rules
2. **Input Code**: Paste code or upload JavaScript/TypeScript files
3. **Review Results**: Check errors, warnings, and fixable issues
4. **Apply Fixes**: Automatically fix common issues

### Configuration Options
- **Auto-lint**: Toggle automatic linting on code changes
- **TypeScript Mode**: Enable TypeScript-specific handling
- **Custom Rules**: Add or override rules with JSON configuration

### Working with Results
1. **Lint Results Tab**: View all detected issues in a detailed table
2. **Fixed Code Tab**: See auto-corrected code after applying fixes
3. **Export Options**: Copy fixed code or download as files

## Browser Implementation

### Client-Side Processing
The tool uses a custom `SimpleLinter` class that implements common ESLint rules:

```typescript
class SimpleLinter {
  verify(code: string): LintMessage[]
  verifyAndFix(code: string): { output: string; messages: LintMessage[] }
}
```

### Rule Implementation
Each rule is implemented as a method that:
- Analyzes code line by line using regex patterns
- Generates lint messages with precise locations
- Provides auto-fix suggestions where applicable

### Performance Optimizations
- **Debounced Updates**: 500ms delay for auto-linting
- **Async Processing**: Non-blocking UI during linting
- **Efficient Parsing**: Line-based analysis for speed

## Integration with Dev Tools

This tool seamlessly integrates with the existing Dev Tools ecosystem:

- **Consistent UI**: Uses the same Mantine components and design system
- **File Processing**: Follows client-side processing approach
- **Export Features**: Matches download/copy patterns of other tools
- **Theme Support**: Respects light/dark mode preferences

## Privacy & Security

- **Client-Side Only**: All linting happens in your browser
- **No Data Transmission**: Code never leaves your device
- **Offline Capable**: Works without internet connection
- **No Tracking**: Zero analytics or user data collection

## Limitations

### Browser-Based Constraints
- Simplified rule implementations compared to full ESLint
- Limited to pattern-matching for complex semantic rules
- No support for plugins or complex configurations
- Reduced TypeScript-specific rule support

### Rule Coverage
The tool covers the most common and useful ESLint rules but doesn't implement:
- Advanced semantic analysis rules
- Plugin-specific rules (React, Vue, etc.)
- Complex dependency tracking
- Full AST-based analysis

## Future Enhancements

- **Enhanced TypeScript Support**: More TS-specific rules
- **Plugin System**: Support for popular ESLint plugins
- **Code Formatting**: Integration with Prettier-like formatting
- **Rule Explanations**: Detailed explanations for each rule
- **Batch Processing**: Handle multiple files simultaneously
- **Configuration Export**: Save and share rule configurations

## Technical Implementation

### Rule Detection Engine
```typescript
// Example rule implementation
private checkNoVar(line: string, lineNumber: number, messages: LintMessage[]) {
  const match = line.match(/\bvar\s+/);
  if (match) {
    messages.push({
      line: lineNumber,
      column: match.index! + 1,
      ruleId: 'no-var',
      severity: 2,
      message: 'Unexpected var, use let or const instead.',
      fix: { range: [0, 0], text: '' }
    });
  }
}
```

### Auto-Fix Implementation
Auto-fixes are applied by:
1. Identifying fixable rules during analysis
2. Collecting fix instructions for each issue
3. Applying fixes in reverse order to maintain positions
4. Re-running analysis on fixed code

## Contributing

This tool is part of the Dev Tools collection. Follow the established patterns:

1. **Component Structure**: Main tool component + page wrapper + README
2. **Rule Implementation**: Add new rules to SimpleLinter class
3. **Testing**: Verify rule detection and auto-fix functionality
4. **Documentation**: Update this README with new features