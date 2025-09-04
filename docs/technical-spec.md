# DevTools Mini - Technical Specification Document

## 1. System Architecture Overview

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 15 App Router                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Layout    │  │    Pages    │  │     Components      │  │
│  │ Components  │  │   (Tools)   │  │    (Shared/Tool)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Tailwind CSS│  │  Mantine UI │  │    TypeScript       │  │
│  │   Styling   │  │ Components  │  │   Type Safety       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                     Browser APIs                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │    File     │  │ Clipboard   │  │   Local Storage     │  │
│  │     API     │  │     API     │  │       API           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack Details

#### Core Framework
- **Next.js 15.5.2**: React framework with App Router
- **React 19.1.0**: Component library and state management
- **TypeScript 5**: Static type checking and enhanced DX

#### Styling & UI
- **Tailwind CSS 4**: Utility-first CSS framework
- **Mantine UI**: React components library for complex UI elements
- **PostCSS**: CSS processing and optimization
- **Geist Fonts**: Optimized typography (Sans & Mono)

#### Build & Development
- **Turbopack**: Next-generation bundler for faster builds
- **ESLint**: Code quality and consistency
- **TypeScript Compiler**: Type checking and compilation

## 2. Project Structure

### Directory Organization
```
dev-toys/
├── app/                          # Next.js App Router directory
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Homepage with tool grid
│   ├── components/              # Shared components
│   │   ├── ui/                  # Basic UI components
│   │   ├── layout/              # Layout-specific components
│   │   └── tools/               # Tool-specific components
│   ├── tools/                   # Individual tool pages
│   │   ├── base64-image/        # Base64 Image tool
│   │   ├── base64-text/         # Base64 Text tool
│   │   ├── json-formatter/      # JSON Formatter tool
│   │   └── [...17 tools total]
│   ├── lib/                     # Utility functions and helpers
│   │   ├── utils.ts             # Common utility functions
│   │   ├── constants.ts         # Application constants
│   │   └── types.ts             # TypeScript type definitions
│   └── hooks/                   # Custom React hooks
├── public/                      # Static assets
│   ├── icons/                   # Tool icons and favicons
│   └── images/                  # Static images
├── docs/                        # Documentation
│   ├── PRD.md                   # Product Requirements Document
│   ├── technical-spec.md        # This document
│   └── api-reference.md         # Component API documentation
└── [config files]              # Various configuration files
```

### Component Architecture

#### Layout Components
```typescript
// app/layout.tsx - Root Layout
interface RootLayoutProps {
  children: React.ReactNode;
}

// app/components/layout/Header.tsx
interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showThemeToggle?: boolean;
}

// app/components/layout/Navigation.tsx
interface NavigationProps {
  currentTool?: string;
  showBreadcrumbs?: boolean;
}
```

#### Tool Components
```typescript
// Base tool interface
interface ToolComponentProps {
  initialInput?: string;
  onOutputChange?: (output: string) => void;
  className?: string;
}

// Shared tool layout
interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}
```

## 3. Routing Strategy

### App Router Structure
```typescript
// Route mapping
const routes = {
  home: '/',
  tools: {
    base64Image: '/tools/base64-image',
    base64Text: '/tools/base64-text',
    jsonFormatter: '/tools/json-formatter',
    jwtCodec: '/tools/jwt-codec',
    passwordGenerator: '/tools/password-generator',
    timestampConverter: '/tools/timestamp-converter',
    uuidGenerator: '/tools/uuid-generator',
    cronParser: '/tools/cron-parser',
    hashGenerator: '/tools/hash-generator',
    imageConverter: '/tools/image-converter',
    jsonYaml: '/tools/json-yaml',
    markdownPreview: '/tools/markdown-preview',
    imageCompressor: '/tools/image-compressor',
    regexTester: '/tools/regex-tester',
    sqlFormatter: '/tools/sql-formatter',
    urlCodec: '/tools/url-codec',
    jsonTypescript: '/tools/json-typescript'
  }
} as const;
```

### Dynamic Routing Features
- **Deep Linking**: Support for tool-specific URLs with state
- **Breadcrumb Navigation**: Automatic breadcrumb generation
- **Tool Discovery**: Search and filter functionality
- **Recent Tools**: Track and display recently used tools

## 4. State Management

### Global State (React Context)
```typescript
interface AppContextType {
  // Theme management
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  // User preferences
  recentTools: ToolId[];
  addRecentTool: (toolId: ToolId) => void;
  
  // Tool history
  toolHistory: ToolHistoryEntry[];
  saveToolState: (toolId: ToolId, state: any) => void;
  
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}
```

### Local State Management
- **Tool-Specific State**: Each tool manages its own input/output state
- **Form State**: Mantine's form hooks for complex forms
- **File Upload State**: Progress tracking and error handling
- **Processing State**: Loading indicators and error states

### Persistent Storage
```typescript
// Local storage keys
const STORAGE_KEYS = {
  THEME: 'devtools-theme',
  RECENT_TOOLS: 'devtools-recent-tools',
  USER_PREFERENCES: 'devtools-preferences',
  TOOL_HISTORY: 'devtools-tool-history'
} as const;

// Custom hooks for persistence
function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void];
function useToolHistory(): ToolHistoryHook;
function useRecentTools(): RecentToolsHook;
```

## 5. Component Library Integration

### Mantine UI Configuration
```typescript
// app/lib/mantine-theme.ts
import { MantineTheme, createTheme } from '@mantine/core';

export const theme: MantineTheme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Geist Sans, sans-serif',
  fontFamilyMonospace: 'Geist Mono, monospace',
  components: {
    Button: {
      defaultProps: {
        variant: 'filled',
      },
    },
    TextInput: {
      defaultProps: {
        size: 'md',
      },
    },
    // ... component customizations
  },
});
```

### Component Usage Strategy
- **Form Components**: Mantine forms for complex inputs
- **Layout Components**: Mantine Grid, Stack, Group for layouts
- **Feedback Components**: Notifications, modals, loading states
- **Data Display**: Tables, code highlights, progress indicators

## 6. Tool Implementation Specifications

### Text Processing Tools

#### Base64 Text Encoder/Decoder
```typescript
interface Base64TextToolProps {
  initialMode?: 'encode' | 'decode';
}

// Implementation features
- Real-time encoding/decoding
- Input validation and error handling
- Copy to clipboard functionality
- URL-safe Base64 options
- Bulk text processing
```

#### JSON Formatter
```typescript
interface JSONFormatterProps {
  initialJson?: string;
  validationMode?: 'strict' | 'relaxed';
}

// Implementation features
- Syntax highlighting with Monaco Editor
- Format validation and error reporting
- Minify/beautify options
- Tree view for large JSON objects
- Schema validation support
```

### File Processing Tools

#### Base64 Image Encoder/Decoder
```typescript
interface Base64ImageToolProps {
  maxFileSize?: number; // in bytes
  allowedFormats?: string[];
}

// Implementation features
- Drag and drop file upload
- Image preview before/after conversion
- Multiple format support (JPEG, PNG, WebP, etc.)
- Progress indicators for large files
- Download converted files
```

#### Image Converter
```typescript
interface ImageConverterProps {
  supportedFormats: ImageFormat[];
  qualityControl?: boolean;
}

// Implementation features
- Format conversion (JPEG ↔ PNG ↔ WebP)
- Quality adjustment sliders
- Batch processing capabilities
- Before/after comparison
- Metadata preservation options
```

### Generation Tools

#### Password Generator
```typescript
interface PasswordGeneratorConfig {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

// Implementation features
- Cryptographically secure random generation
- Strength indicator and scoring
- Customizable character sets
- Bulk generation with CSV export
- Password history (optional)
```

#### UUID Generator
```typescript
interface UUIDGeneratorProps {
  version: 1 | 4 | 5;
  namespace?: string; // for v5
  name?: string; // for v5
}

// Implementation features
- Support for UUID v1, v4, and v5
- Bulk generation capabilities
- Format validation
- Namespace/name inputs for v5
- Copy individual or bulk UUIDs
```

## 7. Performance Optimization

### Bundle Optimization
- **Code Splitting**: Route-based splitting for tools
- **Tree Shaking**: Eliminate unused code
- **Dynamic Imports**: Load tool libraries on demand
- **Asset Optimization**: Image and font optimization

### Runtime Performance
- **Memoization**: React.memo and useMemo for expensive operations
- **Virtual Scrolling**: For large data sets
- **Web Workers**: Offload heavy processing (image compression, etc.)
- **Debouncing**: Input handling for real-time tools

### Caching Strategy
```typescript
// Service Worker for offline capability
interface CacheStrategy {
  staticAssets: 'cache-first';
  apiResponses: 'network-first';
  toolStates: 'indexeddb';
}
```

## 8. Error Handling & Validation

### Error Boundaries
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// Tool-specific error handling
interface ToolErrorHandler {
  validateInput: (input: any) => ValidationResult;
  handleProcessingError: (error: Error) => ErrorResponse;
  recoverFromError: () => void;
}
```

### Input Validation
- **Type Checking**: Runtime type validation
- **Format Validation**: Tool-specific format checks
- **Size Limits**: File size and text length limits
- **Security Validation**: XSS and injection prevention

## 9. Testing Strategy

### Unit Testing
```typescript
// Jest + React Testing Library
describe('Base64TextTool', () => {
  it('should encode text correctly', () => {
    // Test implementation
  });
  
  it('should handle invalid input gracefully', () => {
    // Error handling test
  });
});
```

### Integration Testing
- **Tool Functionality**: End-to-end tool operations
- **Navigation**: Routing and page transitions
- **State Management**: Context and local storage
- **File Operations**: Upload, download, and processing

### Performance Testing
- **Lighthouse**: Automated performance auditing
- **Bundle Analysis**: Size and composition analysis
- **Load Testing**: Heavy file processing scenarios

## 10. Deployment & CI/CD

### Build Configuration
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    turbopack: true, // Use Turbopack for faster builds
  },
  output: 'standalone', // For containerized deployments
  images: {
    domains: [], // No external image domains needed
  },
};
```

### Deployment Pipeline
1. **Development**: Local development with hot reload
2. **Staging**: Preview deployments for testing
3. **Production**: Optimized build with CDN distribution

### Environment Configuration
```typescript
// Environment variables
interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_ANALYTICS_ID?: string;
}
```

## 11. Security Considerations

### Client-Side Security
- **Content Security Policy**: Strict CSP headers
- **Input Sanitization**: XSS prevention
- **File Upload Security**: Type and size validation
- **No Data Transmission**: All processing stays local

### Privacy Protection
- **No Tracking**: No analytics or user tracking
- **Local Storage Only**: Data stays on user's device
- **Secure Processing**: Cryptographic operations in browser

## 12. Accessibility Implementation

### WCAG 2.1 AA Compliance
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels
- **Color Contrast**: Meet contrast ratio requirements
- **Focus Management**: Logical focus order

### Implementation Details
```typescript
// Accessibility helpers
interface A11yProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: string;
  tabIndex?: number;
}

// Focus management
function useFocusManagement(): {
  setFocus: (elementId: string) => void;
  trapFocus: (containerRef: RefObject<HTMLElement>) => void;
};
```

---

*This technical specification serves as the implementation guide for the DevTools Mini project and should be updated as the architecture evolves.*