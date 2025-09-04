# DevTools Mini - Tool Specifications

## Overview
This document provides detailed specifications for all 17 tools in the DevTools Mini application. Each tool includes functional requirements, technical implementation details, and user interface specifications.

---

## Text Processing Tools

### 1. Base64 Text Encoder/Decoder

#### Functional Requirements
- **Primary Function**: Convert text to/from Base64 encoding
- **Input**: Plain text or Base64 encoded string
- **Output**: Converted text with format validation
- **Mode Toggle**: Switch between encode/decode operations

#### Features
- Real-time conversion as user types
- Auto-detection of input format
- URL-safe Base64 encoding option
- Bulk text processing support
- Character encoding validation
- Copy to clipboard functionality

#### Technical Implementation
```typescript
interface Base64TextToolState {
  mode: 'encode' | 'decode';
  input: string;
  output: string;
  urlSafe: boolean;
  isValid: boolean;
  error?: string;
}

// Core functions
function encodeBase64(text: string, urlSafe: boolean): string;
function decodeBase64(encoded: string): string;
function validateBase64(input: string): boolean;
```

#### UI Components
- Mode toggle (Encode/Decode)
- Text input area with line numbers
- Output display area (read-only)
- URL-safe option checkbox
- Copy button with success feedback
- Clear/reset button

#### Error Handling
- Invalid Base64 characters in decode mode
- Non-UTF8 text handling
- Empty input validation
- Large text size warnings

---

### 2. JSON Formatter

#### Functional Requirements
- **Primary Function**: Format, validate, and beautify JSON data
- **Input**: Raw JSON string or file upload
- **Output**: Formatted JSON with syntax highlighting
- **Validation**: Real-time JSON schema validation

#### Features
- Syntax highlighting with color coding
- Minify/beautify toggle
- JSON validation with error location
- Tree view for complex objects
- Line numbers and folding
- Search and replace within JSON
- Export formatted JSON

#### Technical Implementation
```typescript
interface JSONFormatterState {
  input: string;
  output: string;
  isMinified: boolean;
  isValid: boolean;
  errors: JSONError[];
  viewMode: 'text' | 'tree';
}

interface JSONError {
  line: number;
  column: number;
  message: string;
}
```

#### UI Components
- Code editor with syntax highlighting (Monaco Editor)
- Format/Minify toggle buttons
- Tree view panel
- Error display with line highlighting
- Search/replace functionality
- Import/export buttons

#### Advanced Features
- JSON schema validation
- JSONPath query support
- Diff comparison between JSON objects
- Export to various formats (YAML, XML)

---

### 3. URL Encoder/Decoder

#### Functional Requirements
- **Primary Function**: Encode/decode URLs and query parameters
- **Input**: URL string or individual components
- **Output**: Properly encoded/decoded URL
- **Component Support**: Separate encoding for different URL parts

#### Features
- Full URL encoding/decoding
- Component-specific encoding (path, query, fragment)
- Query parameter parsing and editing
- URL validation and structure analysis
- Bulk URL processing
- Custom character set encoding

#### Technical Implementation
```typescript
interface URLCodecState {
  mode: 'encode' | 'decode';
  input: string;
  output: string;
  components: URLComponents;
  encoding: 'utf8' | 'ascii' | 'custom';
}

interface URLComponents {
  protocol: string;
  host: string;
  path: string;
  query: Record<string, string>;
  fragment: string;
}
```

#### UI Components
- URL input field with validation
- Component breakdown display
- Query parameter editor table
- Encoding options selector
- Batch processing interface

---

### 4. JWT Encoder/Decoder

#### Functional Requirements
- **Primary Function**: Encode/decode JSON Web Tokens
- **Input**: JWT token string or JSON payload
- **Output**: Decoded components or encoded JWT
- **Verification**: Signature validation with secret key

#### Features
- JWT header and payload visualization
- Multiple algorithm support (HS256, RS256, etc.)
- Signature verification with secret input
- Token expiration checking
- Claims validation
- Custom header/payload editing

#### Technical Implementation
```typescript
interface JWTCodecState {
  mode: 'encode' | 'decode';
  token: string;
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
  secret: string;
  isValid: boolean;
  algorithm: JWTAlgorithm;
}

interface JWTHeader {
  alg: string;
  typ: string;
  [key: string]: any;
}

interface JWTPayload {
  sub?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}
```

#### UI Components
- JWT input/output fields
- Header/payload JSON editors
- Algorithm selector
- Secret key input (hidden)
- Signature verification status
- Expiration time display

#### Security Considerations
- Client-side only processing
- No transmission of secrets
- Clear warnings about token security
- Automatic secret clearing

---

### 5. SQL Formatter

#### Functional Requirements
- **Primary Function**: Format and beautify SQL queries
- **Input**: Raw SQL query string
- **Output**: Formatted SQL with proper indentation
- **Dialect Support**: Multiple SQL database dialects

#### Features
- Keyword highlighting and capitalization
- Indentation and line breaking
- Comment preservation
- Multiple formatting styles
- SQL dialect selection
- Query validation
- Export formatted queries

#### Technical Implementation
```typescript
interface SQLFormatterState {
  input: string;
  output: string;
  dialect: SQLDialect;
  style: FormattingStyle;
  options: FormattingOptions;
}

type SQLDialect = 'mysql' | 'postgresql' | 'sqlite' | 'mssql' | 'oracle';

interface FormattingOptions {
  keywordCase: 'upper' | 'lower' | 'title';
  indentSize: number;
  maxLineLength: number;
  commaStyle: 'leading' | 'trailing';
}
```

#### UI Components
- SQL input editor with syntax highlighting
- Dialect selector dropdown
- Formatting options panel
- Style presets (compact, expanded, etc.)
- Preview/apply buttons

---

## Data Conversion Tools

### 6. JSON to YAML Converter

#### Functional Requirements
- **Primary Function**: Convert between JSON and YAML formats
- **Input**: JSON object or YAML document
- **Output**: Converted format with structure preservation
- **Bidirectional**: Support both JSON→YAML and YAML→JSON

#### Features
- Bidirectional conversion
- Comment preservation in YAML
- Multi-document YAML support
- Syntax validation for both formats
- Formatting options (indentation, flow style)
- Error highlighting and reporting

#### Technical Implementation
```typescript
interface JSONYAMLState {
  mode: 'json-to-yaml' | 'yaml-to-json';
  input: string;
  output: string;
  options: ConversionOptions;
  isValid: boolean;
  errors: ConversionError[];
}

interface ConversionOptions {
  indent: number;
  flowLevel: number;
  quotingType: 'minimal' | 'preserve' | 'double' | 'single';
  forceQuotes: boolean;
}
```

---

### 7. JSON to TypeScript Types

#### Functional Requirements
- **Primary Function**: Generate TypeScript interfaces from JSON data
- **Input**: JSON schema or sample data
- **Output**: TypeScript interface definitions
- **Customization**: Naming conventions and type options

#### Features
- Nested type generation
- Optional property detection
- Array type inference
- Union type support
- Interface naming customization
- Export declarations
- Multiple sample merging

#### Technical Implementation
```typescript
interface JSONToTSState {
  input: string;
  output: string;
  options: GenerationOptions;
  interfaces: GeneratedInterface[];
}

interface GenerationOptions {
  rootTypeName: string;
  namingConvention: 'camelCase' | 'PascalCase' | 'snake_case';
  exportTypes: boolean;
  optionalProperties: 'auto' | 'all' | 'none';
  arrayStyle: 'generic' | 'bracket';
}
```

---

### 8. Unix Timestamp Converter

#### Functional Requirements
- **Primary Function**: Convert between Unix timestamps and human-readable dates
- **Input**: Unix timestamp or date string
- **Output**: Converted date/timestamp with timezone support
- **Formats**: Multiple date formats and timestamp units

#### Features
- Multiple timestamp formats (seconds, milliseconds)
- Timezone conversion support
- Current timestamp display (live)
- Batch timestamp conversion
- Date format customization
- Relative time display (ago/from now)

#### Technical Implementation
```typescript
interface TimestampConverterState {
  input: string;
  output: string;
  inputFormat: TimestampFormat;
  outputFormat: DateFormat;
  timezone: string;
  currentTimestamp: number;
}

type TimestampFormat = 'seconds' | 'milliseconds' | 'microseconds';
type DateFormat = 'iso' | 'rfc2822' | 'custom';
```

---

## Generation Tools

### 9. Password Generator

#### Functional Requirements
- **Primary Function**: Generate cryptographically secure passwords
- **Configuration**: Length, character sets, complexity rules
- **Output**: Secure random passwords with strength analysis
- **Bulk Generation**: Multiple passwords at once

#### Features
- Customizable length (4-128 characters)
- Character set selection (uppercase, lowercase, numbers, symbols)
- Exclude similar characters option
- Password strength indicator
- Pronounceable password option
- Bulk generation with CSV export
- Password history (optional)

#### Technical Implementation
```typescript
interface PasswordGeneratorState {
  config: PasswordConfig;
  generated: string[];
  strength: PasswordStrength;
  history: string[];
}

interface PasswordConfig {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  customCharset?: string;
}

interface PasswordStrength {
  score: number; // 0-100
  entropy: number;
  timeToCrack: string;
  feedback: string[];
}
```

#### UI Components
- Length slider with numeric input
- Character set checkboxes
- Custom character input
- Generate button with bulk options
- Password display with copy buttons
- Strength indicator with visual feedback
- Export options (text, CSV)

#### Security Features
- Cryptographically secure random generation (crypto.getRandomValues)
- No password transmission or storage
- Optional client-side history (encrypted)
- Clear memory after generation

---

### 10. UUID Generator

#### Functional Requirements
- **Primary Function**: Generate RFC 4122 compliant UUIDs
- **Versions**: Support for UUID v1, v4, and v5
- **Bulk Generation**: Multiple UUIDs at once
- **Validation**: Format verification and version detection

#### Features
- UUID v1 (timestamp-based)
- UUID v4 (random)
- UUID v5 (namespace + name hash)
- Bulk generation (1-1000 UUIDs)
- Format validation
- Version detection
- Export options (text, JSON, CSV)

#### Technical Implementation
```typescript
interface UUIDGeneratorState {
  version: 1 | 4 | 5;
  generated: string[];
  v5Config: {
    namespace: string;
    name: string;
  };
  bulkCount: number;
}

// Core functions
function generateUUIDv1(): string;
function generateUUIDv4(): string;
function generateUUIDv5(namespace: string, name: string): string;
function validateUUID(uuid: string): { valid: boolean; version?: number };
```

---

### 11. Hash Generator

#### Functional Requirements
- **Primary Function**: Generate cryptographic hashes for text and files
- **Algorithms**: MD5, SHA1, SHA256, SHA512, and more
- **Input**: Text input or file upload
- **Comparison**: Hash verification and comparison

#### Features
- Multiple hash algorithms
- Text and file input support
- Salt support for enhanced security
- Hash comparison and verification
- Batch file processing
- HMAC generation
- Base64/Hex output formats

#### Technical Implementation
```typescript
interface HashGeneratorState {
  algorithm: HashAlgorithm;
  input: string;
  file?: File;
  salt: string;
  output: string;
  format: 'hex' | 'base64';
  useHMAC: boolean;
  hmacKey: string;
}

type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha384' | 'sha512';
```

---

## File Processing Tools

### 12. Base64 Image Encoder/Decoder

#### Functional Requirements
- **Primary Function**: Convert images to/from Base64 encoding
- **Input**: Image files (upload) or Base64 strings
- **Output**: Base64 encoded data or image files
- **Formats**: Support for JPEG, PNG, WebP, GIF, SVG

#### Features
- Drag-and-drop file upload
- Image preview before/after conversion
- Multiple format support
- Data URI generation with MIME types
- Batch image processing
- Download converted files
- Image metadata display

#### Technical Implementation
```typescript
interface Base64ImageState {
  mode: 'encode' | 'decode';
  files: File[];
  base64Data: string;
  previewUrl: string;
  metadata: ImageMetadata;
  progress: number;
}

interface ImageMetadata {
  filename: string;
  size: number;
  dimensions: { width: number; height: number };
  format: string;
  colorDepth: number;
}
```

---

### 13. Image Converter

#### Functional Requirements
- **Primary Function**: Convert between different image formats
- **Input**: Image files in various formats
- **Output**: Converted images with quality options
- **Formats**: JPEG, PNG, WebP, GIF conversion

#### Features
- Format conversion (JPEG ↔ PNG ↔ WebP ↔ GIF)
- Quality adjustment for lossy formats
- Batch processing capabilities
- Before/after comparison
- Metadata preservation options
- Progressive JPEG options
- Transparency handling

#### Technical Implementation
```typescript
interface ImageConverterState {
  inputFiles: File[];
  outputFormat: ImageFormat;
  quality: number;
  options: ConversionOptions;
  results: ConversionResult[];
  progress: number;
}

interface ConversionOptions {
  preserveMetadata: boolean;
  progressive: boolean; // for JPEG
  lossless: boolean; // for WebP
  transparency: boolean;
}
```

---

### 14. PNG/JPEG Compressor

#### Functional Requirements
- **Primary Function**: Optimize and compress PNG/JPEG images
- **Input**: PNG or JPEG image files
- **Output**: Compressed images with size comparison
- **Options**: Lossless and lossy compression levels

#### Features
- Lossless PNG optimization
- JPEG quality adjustment
- Batch compression
- Before/after size comparison
- Visual quality comparison
- Progressive JPEG generation
- Metadata stripping options

#### Technical Implementation
```typescript
interface ImageCompressorState {
  files: File[];
  compressionLevel: number;
  quality: number; // for JPEG
  stripMetadata: boolean;
  results: CompressionResult[];
}

interface CompressionResult {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  file: File;
  previewUrl: string;
}
```

---

### 15. Markdown Previewer

#### Functional Requirements
- **Primary Function**: Preview Markdown with live rendering
- **Input**: Markdown text
- **Output**: HTML rendered preview
- **Features**: Split-pane editor with live updates

#### Features
- Live preview with split-pane layout
- GitHub Flavored Markdown support
- Syntax highlighting for code blocks
- Table of contents generation
- Export to HTML/PDF
- Custom CSS themes
- Math equation support (KaTeX)

#### Technical Implementation
```typescript
interface MarkdownPreviewerState {
  markdown: string;
  html: string;
  theme: 'github' | 'dark' | 'custom';
  showTOC: boolean;
  syncScroll: boolean;
  mathSupport: boolean;
}
```

---

## Advanced Utilities

### 16. REGEX Tester

#### Functional Requirements
- **Primary Function**: Test regular expressions against text
- **Input**: Regex pattern and test strings
- **Output**: Match results with highlighting
- **Features**: Replace functionality and match groups

#### Features
- Pattern testing with match highlighting
- Global, case-insensitive, multiline flags
- Match groups visualization
- Replace functionality with preview
- Pattern explanation and documentation
- Common regex library
- Performance warnings for complex patterns

#### Technical Implementation
```typescript
interface RegexTesterState {
  pattern: string;
  testString: string;
  flags: RegexFlags;
  matches: RegexMatch[];
  replacePattern: string;
  replaceResult: string;
  isValid: boolean;
  explanation: string;
}

interface RegexFlags {
  global: boolean;
  caseInsensitive: boolean;
  multiline: boolean;
  dotAll: boolean;
  unicode: boolean;
}

interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}
```

---

### 17. CRON Expression Parser

#### Functional Requirements
- **Primary Function**: Parse and explain CRON expressions
- **Input**: CRON expression string
- **Output**: Human-readable description and next execution times
- **Visualization**: Calendar view of schedule

#### Features
- CRON expression validation
- Human-readable schedule description
- Next execution times (next 10 runs)
- Calendar visualization
- Different CRON formats (standard, extended)
- Timezone support
- Schedule testing with date ranges

#### Technical Implementation
```typescript
interface CronParserState {
  expression: string;
  description: string;
  nextRuns: Date[];
  isValid: boolean;
  format: 'standard' | 'extended';
  timezone: string;
  error?: string;
}

interface CronSchedule {
  second?: string;
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  year?: string;
}
```

#### UI Components
- CRON expression input with validation
- Description display
- Next runs list with timestamps
- Calendar view with highlighted dates
- Timezone selector
- Expression builder (visual interface)

---

## Cross-Tool Features

### Shared Components
- **InputOutputPanel**: Reusable input/output interface
- **CopyButton**: Clipboard integration with feedback
- **FileUpload**: Drag-and-drop file handling
- **ErrorBoundary**: Error handling and recovery
- **LoadingIndicator**: Progress feedback
- **ThemeProvider**: Dark/light mode support

### Common Functionality
- **Clipboard Integration**: Copy results to clipboard
- **File Operations**: Import/export functionality
- **Keyboard Shortcuts**: Quick actions and navigation
- **URL State**: Deep linking with tool state
- **Local Storage**: Persist user preferences
- **Error Handling**: Graceful error recovery

### Performance Considerations
- **Code Splitting**: Load tool bundles on demand
- **Web Workers**: Offload heavy processing
- **Memory Management**: Handle large files efficiently
- **Debouncing**: Optimize real-time processing
- **Caching**: Cache processed results

---

*This specification document serves as the definitive guide for implementing each tool in the DevTools Mini application.*