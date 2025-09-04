// Core tool types
export type ToolCategory = 
  | 'text-processing'
  | 'data-conversion'
  | 'generation'
  | 'file-processing'
  | 'utilities';

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  path: string;
  tags: string[];
  featured?: boolean;
}

// Application state types
export interface AppContextType {
  // Theme management
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  // User preferences
  recentTools: string[];
  addRecentTool: (toolId: string) => void;
  
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Processing result interface
export interface ProcessingResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
}

// Tool component base props
export interface ToolComponentProps {
  initialInput?: string;
  onOutputChange?: (output: string) => void;
  className?: string;
}

// Base64 tool types
export interface Base64TextToolState {
  mode: 'encode' | 'decode';
  input: string;
  output: string;
  urlSafe: boolean;
  isValid: boolean;
  error?: string;
}

export interface Base64ImageState {
  mode: 'encode' | 'decode';
  files: File[];
  base64Data: string;
  base64String: string;
  previewUrl: string;
  metadata: ImageMetadata[];
  progress: number;
  isValid: boolean;
  error?: string;
}

export interface ImageMetadata {
  filename: string;
  size: number;
  dimensions: { width: number; height: number } | null;
  format: string;
  type: string;
  colorDepth?: number;
}

// JSON tool types
export interface JSONFormatterState {
  input: string;
  output: string;
  isMinified: boolean;
  isValid: boolean;
  errors: JSONError[];
  viewMode: 'text' | 'tree';
}

export interface JSONError {
  line: number;
  column: number;
  message: string;
}

// JWT tool types
export interface JWTCodecState {
  mode: 'encode' | 'decode';
  token: string;
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
  secret: string;
  isValid: boolean;
  algorithm: JWTAlgorithm;
}

export interface JWTHeader {
  alg: string;
  typ: string;
  [key: string]: any;
}

export interface JWTPayload {
  sub?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

export type JWTAlgorithm = 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512';

// URL tool types
export interface URLCodecState {
  mode: 'encode' | 'decode';
  input: string;
  output: string;
  components: URLComponents;
  encoding: 'utf8' | 'ascii' | 'custom';
}

export interface URLComponents {
  protocol: string;
  host: string;
  path: string;
  query: Record<string, string>;
  fragment: string;
}

// Password generator types
export interface PasswordGeneratorState {
  config: PasswordConfig;
  generated: string[];
  strength: PasswordStrength;
  history: string[];
}

export interface PasswordConfig {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  customCharset?: string;
}

export interface PasswordStrength {
  score: number; // 0-8
  label: string;
  color: string;
  feedback: string[];
}

// UUID generator types
export interface UUIDGeneratorState {
  version: 1 | 4 | 5;
  generated: string[];
  v5Config: {
    namespace: string;
    name: string;
  };
  bulkCount: number;
}

// Hash generator types
export interface HashGeneratorState {
  algorithm: HashAlgorithm;
  input: string;
  file?: File;
  salt: string;
  output: string;
  format: 'hex' | 'base64';
  useHMAC: boolean;
  hmacKey: string;
}

export type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha384' | 'sha512';

// Timestamp converter types
export interface TimestampConverterState {
  input: string;
  output: string;
  inputFormat: TimestampFormat;
  outputFormat: DateFormat;
  timezone: string;
  currentTimestamp: number;
}

export type TimestampFormat = 'seconds' | 'milliseconds' | 'microseconds';
export type DateFormat = 'iso' | 'rfc2822' | 'custom';

// JSON conversion types
export interface JSONYAMLState {
  mode: 'json-to-yaml' | 'yaml-to-json';
  input: string;
  output: string;
  options: ConversionOptions;
  isValid: boolean;
  errors: ConversionError[];
}

export interface ConversionOptions {
  indent: number;
  flowLevel: number;
  quotingType: 'minimal' | 'preserve' | 'double' | 'single';
  forceQuotes: boolean;
}

export interface ConversionError {
  line: number;
  column: number;
  message: string;
}

// JSON to TypeScript types
export interface JSONToTSState {
  input: string;
  output: string;
  options: GenerationOptions;
  interfaces: GeneratedInterface[];
}

export interface GenerationOptions {
  rootTypeName: string;
  namingConvention: 'camelCase' | 'PascalCase' | 'snake_case';
  exportTypes: boolean;
  optionalProperties: 'auto' | 'all' | 'none';
  arrayStyle: 'generic' | 'bracket';
}

export interface GeneratedInterface {
  name: string;
  properties: InterfaceProperty[];
}

export interface InterfaceProperty {
  name: string;
  type: string;
  optional: boolean;
}

// Image processing types
export interface ImageConverterState {
  inputFiles: File[];
  outputFormat: ImageFormat;
  quality: number;
  options: ImageConversionOptions;
  results: ConversionResult[];
  progress: number;
}

export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'gif';

export interface ImageConversionOptions {
  preserveMetadata: boolean;
  progressive: boolean; // for JPEG
  lossless: boolean; // for WebP
  transparency: boolean;
}

export interface ConversionResult {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  file: File;
  previewUrl: string;
}

// Image compressor types
export interface ImageCompressorState {
  files: File[];
  compressionLevel: number;
  quality: number; // for JPEG
  stripMetadata: boolean;
  results: CompressionResult[];
}

export interface CompressionResult {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  file: File;
  previewUrl: string;
}

// Markdown previewer types
export interface MarkdownPreviewerState {
  markdown: string;
  html: string;
  theme: 'github' | 'dark' | 'custom';
  showTOC: boolean;
  syncScroll: boolean;
  mathSupport: boolean;
}

// Regex tester types
export interface RegexTesterState {
  pattern: string;
  testString: string;
  flags: RegexFlags;
  matches: RegexMatch[];
  replacePattern: string;
  replaceResult: string;
  isValid: boolean;
  explanation: string;
  error?: string;
}

export interface RegexFlags {
  global: boolean;
  ignoreCase: boolean;
  multiline: boolean;
  dotAll: boolean;
  unicode: boolean;
  sticky: boolean;
}

export interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}

// CRON parser types
export interface CronParserState {
  expression: string;
  description: string;
  nextRuns: Date[];
  isValid: boolean;
  format: 'standard' | 'extended';
  timezone: string;
  error?: string;
}

export interface CronSchedule {
  second?: string;
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  year?: string;
}

// SQL formatter types
export interface SQLFormatterState {
  input: string;
  output: string;
  dialect: SQLDialect;
  style: FormattingStyle;
  options: SQLFormattingOptions;
}

export type SQLDialect = 'mysql' | 'postgresql' | 'sqlite' | 'mssql' | 'oracle';
export type FormattingStyle = 'compact' | 'expanded' | 'custom';

export interface SQLFormattingOptions {
  keywordCase: 'upper' | 'lower' | 'title';
  indentSize: number;
  maxLineLength: number;
  commaStyle: 'leading' | 'trailing';
}

// Storage keys constant
export const STORAGE_KEYS = {
  THEME: 'devtools-theme',
  RECENT_TOOLS: 'devtools-recent-tools',
  USER_PREFERENCES: 'devtools-preferences',
  TOOL_HISTORY: 'devtools-tool-history'
} as const;