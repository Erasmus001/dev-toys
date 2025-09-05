import { ToolDefinition } from './types';

// Application metadata
export const APP_CONFIG = {
  name: 'Dev Tools',
  description: 'A comprehensive web-based developer utility application with 19 essential tools',
  version: '1.0.0',
  author: 'Erasmus Mensah',
  url: 'https://devtools-mini.vercel.app'
} as const;

// All 17 tool definitions for the 5x5 grid
export const TOOLS: ToolDefinition[] = [
  // Row 1
  {
    id: 'base64-image',
    name: 'Base64 Image',
    description: 'Convert images to/from Base64 encoding with preview',
    icon: '🖼️',
    category: 'file-processing',
    path: '/tools/base64-image',
    tags: ['base64', 'image', 'encoder', 'decoder', 'conversion']
  },
  {
    id: 'base64-text',
    name: 'Base64 Text',
    description: 'Encode and decode text to/from Base64 format',
    icon: '📝',
    category: 'text-processing',
    path: '/tools/base64-text',
    tags: ['base64', 'text', 'encoder', 'decoder', 'encoding'],
    featured: true
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, and beautify JSON data',
    icon: '🔧',
    category: 'text-processing',
    path: '/tools/json-formatter',
    tags: ['json', 'formatter', 'validator', 'prettify', 'minify'],
    featured: true
  },
  {
    id: 'jwt-codec',
    name: 'JWT Encoder/Decoder',
    description: 'Encode and decode JSON Web Tokens with verification',
    icon: '🔐',
    category: 'text-processing',
    path: '/tools/jwt-codec',
    tags: ['jwt', 'token', 'security', 'authentication', 'decoder']
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure passwords with customizable options',
    icon: '🔑',
    category: 'generation',
    path: '/tools/password-generator',
    tags: ['password', 'security', 'random', 'generator', 'strength'],
    featured: true
  },

  // Row 2
  {
    id: 'timestamp-converter',
    name: 'Unix Timestamp',
    description: 'Convert between Unix timestamps and human-readable dates',
    icon: '⏰',
    category: 'data-conversion',
    path: '/tools/timestamp-converter',
    tags: ['timestamp', 'unix', 'date', 'time', 'converter']
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate UUIDs in various formats (v1, v4, v5)',
    icon: '🆔',
    category: 'generation',
    path: '/tools/uuid-generator',
    tags: ['uuid', 'guid', 'random', 'generator', 'identifier']
  },
  {
    id: 'cron-parser',
    name: 'CRON Parser',
    description: 'Parse CRON expressions and show next execution times',
    icon: '📅',
    category: 'utilities',
    path: '/tools/cron-parser',
    tags: ['cron', 'schedule', 'parser', 'time', 'automation']
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA1, SHA256, SHA512 hashes',
    icon: '#️⃣',
    category: 'generation',
    path: '/tools/hash-generator',
    tags: ['hash', 'md5', 'sha', 'checksum', 'security']
  },
  {
    id: 'image-converter',
    name: 'Image Converter',
    description: 'Convert between JPEG, PNG, WebP formats',
    icon: '🔄',
    category: 'file-processing',
    path: '/tools/image-converter',
    tags: ['image', 'convert', 'jpeg', 'png', 'webp']
  },

  // Row 3
  {
    id: 'json-yaml',
    name: 'JSON ↔ YAML',
    description: 'Convert between JSON and YAML formats',
    icon: '🔀',
    category: 'data-conversion',
    path: '/tools/json-yaml',
    tags: ['json', 'yaml', 'convert', 'format', 'data']
  },
  {
    id: 'markdown-preview',
    name: 'Markdown Preview',
    description: 'Live preview of Markdown with split-pane editor',
    icon: '📋',
    category: 'file-processing',
    path: '/tools/markdown-preview',
    tags: ['markdown', 'preview', 'editor', 'html', 'documentation']
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress PNG and JPEG images with quality control',
    icon: '🗜️',
    category: 'file-processing',
    path: '/tools/image-compressor',
    tags: ['image', 'compress', 'optimize', 'quality', 'size']
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test regular expressions with match highlighting',
    icon: '🎯',
    category: 'utilities',
    path: '/tools/regex-tester',
    tags: ['regex', 'pattern', 'match', 'test', 'validation']
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and beautify SQL queries with syntax highlighting',
    icon: '🗃️',
    category: 'text-processing',
    path: '/tools/sql-formatter',
    tags: ['sql', 'format', 'query', 'database', 'beautify']
  },

  // Row 4
  {
    id: 'url-codec',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs and query parameters',
    icon: '🌐',
    category: 'text-processing',
    path: '/tools/url-codec',
    tags: ['url', 'encode', 'decode', 'query', 'web']
  },
  {
    id: 'json-typescript',
    name: 'JSON → TypeScript',
    description: 'Generate TypeScript interfaces from JSON data',
    icon: '📘',
    category: 'data-conversion',
    path: '/tools/json-typescript',
    tags: ['json', 'typescript', 'interface', 'type', 'generator']
  },
  {  
    id: 'json-csv',
    name: 'JSON ↔ CSV',
    description: 'Convert between JSON and CSV formats with bidirectional conversion',
    icon: '📊',
    category: 'data-conversion',
    path: '/tools/json-csv',
    tags: ['json', 'csv', 'convert', 'data', 'table', 'spreadsheet']
  },
  {
    id: 'mock-api-generator',
    name: 'Mock API Generator',
    description: 'Generate realistic mock API responses from JSON schemas',
    icon: '🎭',
    category: 'generation',
    path: '/tools/mock-api-generator',
    tags: ['api', 'mock', 'json', 'schema', 'faker', 'testing']
  }
];

// Tool categories for filtering
export const TOOL_CATEGORIES = [
  { id: 'text-processing', name: 'Text Processing', count: 5 },
  { id: 'data-conversion', name: 'Data Conversion', count: 4 },
  { id: 'generation', name: 'Generation', count: 4 },
  { id: 'file-processing', name: 'File Processing', count: 4 },
  { id: 'utilities', name: 'Utilities', count: 2 }
] as const;

// Grid layout configuration for 5x5 display
export const GRID_CONFIG = {
  rows: 5,
  cols: 5,
  totalCells: 25,
  toolsCount: 19,
  emptyCells: 6
} as const;

// Default placeholder for empty grid cells
export const EMPTY_TOOL_PLACEHOLDER: ToolDefinition = {
  id: 'coming-soon',
  name: 'Coming Soon',
  description: 'More tools will be added in future updates',
  icon: '⭐',
  category: 'utilities',
  path: '#',
  tags: ['placeholder', 'future']
};

// Navigation routes
export const ROUTES = {
  home: '/',
  tools: {
    baseRoute: '/tools',
    ...TOOLS.reduce((acc, tool) => {
      acc[tool.id] = tool.path;
      return acc;
    }, {} as Record<string, string>)
  }
} as const;

// Theme configuration
export const THEME_CONFIG = {
  defaultTheme: 'light' as const,
  themes: ['light', 'dark'] as const,
  storageKey: 'devtools-theme'
} as const;

// File upload limits
export const FILE_LIMITS = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  maxFiles: 10,
  imageFormats: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  textFormats: ['text/plain', 'application/json', 'text/csv']
} as const;

// Performance constants
export const PERFORMANCE = {
  debounceDelay: 300,
  animationDuration: 200,
  loadingDelay: 100
} as const;

// Error messages
export const ERROR_MESSAGES = {
  invalidInput: 'Please provide valid input',
  fileTooLarge: 'File size exceeds the maximum limit',
  unsupportedFormat: 'This file format is not supported',
  processingError: 'An error occurred while processing',
  clipboardError: 'Failed to copy to clipboard',
  networkError: 'Network request failed'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  copied: 'Copied to clipboard!',
  saved: 'File saved successfully',
  processed: 'Processing completed',
  exported: 'Data exported successfully'
} as const;