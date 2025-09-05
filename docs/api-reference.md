# Dev Tools - Component API Reference

## Core Layout Components

### RootLayout
**File**: `app/layout.tsx`

Root layout component that wraps the entire application.

```typescript
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element
```

**Features**:
- Global font configuration (Geist Sans & Mono)
- Metadata management
- Theme provider wrapper
- Global CSS imports

---

### Header
**File**: `app/components/layout/Header.tsx`

Main navigation header with search and theme toggle.

```typescript
interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showThemeToggle?: boolean;
  onSearchChange?: (query: string) => void;
}

export function Header(props: HeaderProps): JSX.Element
```

**Props**:
- `title` - Custom title (defaults to "Dev Tools")
- `showSearch` - Show/hide search functionality
- `showThemeToggle` - Show/hide theme toggle button
- `onSearchChange` - Callback for search query changes

---

### ToolGrid
**File**: `app/components/layout/ToolGrid.tsx`

5x5 grid layout for displaying all tools on the homepage.

```typescript
interface ToolGridProps {
  tools: ToolDefinition[];
  searchQuery?: string;
  onToolSelect?: (toolId: string) => void;
  className?: string;
}

export function ToolGrid(props: ToolGridProps): JSX.Element
```

**Props**:
- `tools` - Array of tool definitions
- `searchQuery` - Filter tools by search query
- `onToolSelect` - Callback when tool is selected
- `className` - Additional CSS classes

## Tool Components

### ToolCard
**File**: `app/components/tools/ToolCard.tsx`

Individual tool card component for the grid layout.

```typescript
interface ToolCardProps {
  tool: ToolDefinition;
  isHighlighted?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ToolCard(props: ToolCardProps): JSX.Element
```

**Props**:
- `tool` - Tool definition object
- `isHighlighted` - Highlight card (for search results)
- `onClick` - Click handler
- `className` - Additional CSS classes

---

### ToolLayout
**File**: `app/components/tools/ToolLayout.tsx`

Shared layout wrapper for individual tool pages.

```typescript
interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  showBackButton?: boolean;
}

export function ToolLayout(props: ToolLayoutProps): JSX.Element
```

**Props**:
- `title` - Tool name/title
- `description` - Tool description
- `children` - Tool-specific content
- `actions` - Additional action buttons
- `showBackButton` - Show navigation back to home

## Text Processing Tools

### Base64TextTool
**File**: `app/components/tools/Base64TextTool.tsx`

Encode and decode text to/from Base64 format.

```typescript
interface Base64TextToolProps {
  initialMode?: 'encode' | 'decode';
  initialInput?: string;
  onOutputChange?: (output: string) => void;
  urlSafe?: boolean;
}

export function Base64TextTool(props: Base64TextToolProps): JSX.Element
```

**Props**:
- `initialMode` - Default operation mode
- `initialInput` - Pre-filled input text
- `onOutputChange` - Callback for output changes
- `urlSafe` - Use URL-safe Base64 encoding

**Features**:
- Real-time encoding/decoding
- Input validation and error handling
- Copy to clipboard functionality
- URL-safe Base64 options

---

### JSONFormatter
**File**: `app/components/tools/JSONFormatter.tsx`

Format, validate, and beautify JSON data.

```typescript
interface JSONFormatterProps {
  initialJson?: string;
  validationMode?: 'strict' | 'relaxed';
  onValidationChange?: (isValid: boolean) => void;
  showLineNumbers?: boolean;
}

export function JSONFormatter(props: JSONFormatterProps): JSX.Element
```

**Props**:
- `initialJson` - Pre-filled JSON content
- `validationMode` - Validation strictness
- `onValidationChange` - Validation status callback
- `showLineNumbers` - Display line numbers

**Features**:
- Syntax highlighting
- Format validation and error reporting
- Minify/beautify options
- Tree view for large JSON objects

---

### JWTCodec
**File**: `app/components/tools/JWTCodec.tsx`

Encode and decode JWT (JSON Web Tokens).

```typescript
interface JWTCodecProps {
  initialMode?: 'encode' | 'decode';
  initialToken?: string;
  onTokenChange?: (token: string) => void;
  verifySignature?: boolean;
}

export function JWTCodec(props: JWTCodecProps): JSX.Element
```

**Props**:
- `initialMode` - Default operation mode
- `initialToken` - Pre-filled JWT token
- `onTokenChange` - Token change callback
- `verifySignature` - Enable signature verification

**Features**:
- Decode JWT to view header/payload
- Encode JSON to JWT with secret
- Signature verification
- Algorithm selection

## Generation Tools

### PasswordGenerator
**File**: `app/components/tools/PasswordGenerator.tsx`

Generate secure passwords with customizable options.

```typescript
interface PasswordGeneratorConfig {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

interface PasswordGeneratorProps {
  initialConfig?: Partial<PasswordGeneratorConfig>;
  onPasswordGenerated?: (password: string) => void;
  showStrengthIndicator?: boolean;
}

export function PasswordGenerator(props: PasswordGeneratorProps): JSX.Element
```

**Props**:
- `initialConfig` - Default generator configuration
- `onPasswordGenerated` - Password generation callback
- `showStrengthIndicator` - Display password strength

**Features**:
- Cryptographically secure random generation
- Strength indicator and scoring
- Customizable character sets
- Bulk generation options

---

### UUIDGenerator
**File**: `app/components/tools/UUIDGenerator.tsx`

Generate UUIDs in various formats (v1, v4, v5).

```typescript
interface UUIDGeneratorProps {
  version?: 1 | 4 | 5;
  namespace?: string; // for v5
  name?: string; // for v5
  onUUIDGenerated?: (uuid: string) => void;
  bulkCount?: number;
}

export function UUIDGenerator(props: UUIDGeneratorProps): JSX.Element
```

**Props**:
- `version` - UUID version (1, 4, or 5)
- `namespace` - Namespace for v5 UUIDs
- `name` - Name for v5 UUIDs
- `onUUIDGenerated` - UUID generation callback
- `bulkCount` - Number of UUIDs to generate in bulk

**Features**:
- Support for UUID v1, v4, and v5
- Bulk generation capabilities
- Format validation
- Copy individual or bulk UUIDs

## File Processing Tools

### Base64ImageTool
**File**: `app/components/tools/Base64ImageTool.tsx`

Convert images to/from Base64 encoding.

```typescript
interface Base64ImageToolProps {
  initialMode?: 'encode' | 'decode';
  maxFileSize?: number; // in bytes
  allowedFormats?: string[];
  onConversionComplete?: (result: string | File) => void;
}

export function Base64ImageTool(props: Base64ImageToolProps): JSX.Element
```

**Props**:
- `initialMode` - Default operation mode
- `maxFileSize` - Maximum allowed file size
- `allowedFormats` - Supported image formats
- `onConversionComplete` - Conversion completion callback

**Features**:
- Drag and drop file upload
- Image preview before/after conversion
- Multiple format support
- Progress indicators for large files

---

### ImageConverter
**File**: `app/components/tools/ImageConverter.tsx`

Convert between different image formats.

```typescript
interface ImageConverterProps {
  supportedFormats: ImageFormat[];
  qualityControl?: boolean;
  onConversionComplete?: (convertedFile: File) => void;
  maxFileSize?: number;
}

export function ImageConverter(props: ImageConverterProps): JSX.Element
```

**Props**:
- `supportedFormats` - Array of supported image formats
- `qualityControl` - Enable quality adjustment
- `onConversionComplete` - Conversion completion callback
- `maxFileSize` - Maximum file size limit

**Features**:
- Format conversion (JPEG ↔ PNG ↔ WebP)
- Quality adjustment sliders
- Before/after comparison
- Batch processing capabilities

## Utility Components

### InputOutputPanel
**File**: `app/components/ui/InputOutputPanel.tsx`

Reusable input/output panel for tools.

```typescript
interface InputOutputPanelProps {
  inputLabel: string;
  outputLabel: string;
  inputValue: string;
  outputValue: string;
  onInputChange: (value: string) => void;
  inputPlaceholder?: string;
  outputPlaceholder?: string;
  allowFileUpload?: boolean;
  onFileUpload?: (file: File) => void;
  showCopyButton?: boolean;
  showDownloadButton?: boolean;
}

export function InputOutputPanel(props: InputOutputPanelProps): JSX.Element
```

**Props**:
- `inputLabel` - Label for input section
- `outputLabel` - Label for output section
- `inputValue` - Current input value
- `outputValue` - Current output value
- `onInputChange` - Input change handler
- `inputPlaceholder` - Input placeholder text
- `outputPlaceholder` - Output placeholder text
- `allowFileUpload` - Enable file upload
- `onFileUpload` - File upload handler
- `showCopyButton` - Show copy to clipboard button
- `showDownloadButton` - Show download button

---

### CopyButton
**File**: `app/components/ui/CopyButton.tsx`

Button component for copying text to clipboard.

```typescript
interface CopyButtonProps {
  text: string;
  onCopy?: () => void;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function CopyButton(props: CopyButtonProps): JSX.Element
```

**Props**:
- `text` - Text to copy to clipboard
- `onCopy` - Callback after successful copy
- `children` - Button content (defaults to "Copy")
- `variant` - Button style variant
- `size` - Button size

---

### FileUpload
**File**: `app/components/ui/FileUpload.tsx`

Drag-and-drop file upload component.

```typescript
interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
}

export function FileUpload(props: FileUploadProps): JSX.Element
```

**Props**:
- `onFileSelect` - File selection callback
- `accept` - Accepted file types (MIME types)
- `multiple` - Allow multiple file selection
- `maxSize` - Maximum file size per file
- `maxFiles` - Maximum number of files
- `disabled` - Disable file upload

## Custom Hooks

### useClipboard
**File**: `app/hooks/useClipboard.ts`

Hook for clipboard operations.

```typescript
interface UseClipboardReturn {
  copy: (text: string) => Promise<void>;
  paste: () => Promise<string>;
  copied: boolean;
  error: Error | null;
}

export function useClipboard(): UseClipboardReturn
```

**Returns**:
- `copy` - Function to copy text to clipboard
- `paste` - Function to read from clipboard
- `copied` - Boolean indicating recent copy success
- `error` - Any clipboard operation errors

---

### useLocalStorage
**File**: `app/hooks/useLocalStorage.ts`

Hook for persistent local storage.

```typescript
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void]
```

**Parameters**:
- `key` - Local storage key
- `defaultValue` - Default value if not found

**Returns**:
- `[value, setValue]` - Current value and setter function

---

### useFileProcessing
**File**: `app/hooks/useFileProcessing.ts`

Hook for file processing operations.

```typescript
interface UseFileProcessingReturn {
  processFile: (file: File, processor: FileProcessor) => Promise<ProcessResult>;
  progress: number;
  error: Error | null;
  isProcessing: boolean;
}

export function useFileProcessing(): UseFileProcessingReturn
```

**Returns**:
- `processFile` - Function to process files
- `progress` - Processing progress (0-100)
- `error` - Processing errors
- `isProcessing` - Boolean indicating active processing

## Type Definitions

### ToolDefinition
**File**: `app/lib/types.ts`

Core tool definition interface.

```typescript
interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  path: string;
  tags: string[];
  featured?: boolean;
}

type ToolCategory = 
  | 'text-processing'
  | 'data-conversion'
  | 'generation'
  | 'file-processing'
  | 'utilities';
```

### ProcessingResult
**File**: `app/lib/types.ts`

Result interface for processing operations.

```typescript
interface ProcessingResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
}
```

---

*This API reference provides comprehensive documentation for all components, hooks, and types used in the Dev Tools application.*