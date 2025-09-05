# Color Palette Generator

A comprehensive color palette generation tool with accessibility checks and WCAG compliance analysis. Generate beautiful, accessible color schemes for your design projects with real-time contrast ratio validation.

## Features

### 🎨 Color Palette Generation
- **Base Color Selection**: Use Mantine's ColorPicker with predefined swatches
- **Multiple Color Schemes**:
  - **Monochromatic**: Different shades, tints, and tones of a single hue
  - **Analogous**: Colors adjacent on the color wheel
  - **Complementary**: Colors directly opposite on the color wheel
  - **Triadic**: Three colors evenly spaced around the color wheel
  - **Tetradic**: Four colors forming a rectangle on the color wheel
  - **Split Complementary**: Base color and two adjacent to its complement
- **Customizable Options**: 2-12 colors per palette, lightness range control, saturation adjustment

### ♿ Accessibility & WCAG Compliance
- **Real-time Contrast Analysis**: Calculate contrast ratios against white and black backgrounds
- **WCAG Standards Support**:
  - **AA Level**: Minimum 4.5:1 contrast ratio for normal text
  - **AAA Level**: Minimum 7:1 contrast ratio for enhanced accessibility
- **Visual Compliance Indicators**: Color-coded badges showing pass/fail status
- **Comprehensive Report**: Detailed table with all contrast ratios and compliance levels

### 🎛️ Advanced Controls
- **Lightness Range Slider**: Control the brightness distribution across the palette
- **Saturation Adjustment**: Fine-tune color intensity (-50% to +50%)
- **Random Color Generation**: Discover new palettes with one click
- **Multiple Color Formats**: Display colors in HEX, RGB, HSL, RGBA, or HSLA

### 📤 Export & Sharing
- **Multiple Export Formats**:
  - **CSS Variables**: `:root { --color-1: #hex; }`
  - **SCSS Variables**: `$color-1: #hex;`
  - **JSON**: `{ "color1": "#hex" }`
  - **Tailwind Config**: Ready for `tailwind.config.js`
- **Download Options**: Save as .css, .scss, .json, or .js files
- **Copy to Clipboard**: Individual colors or complete palette code
- **Real-time Code Preview**: See export code update as you modify the palette

## Technology Stack

- **Framework**: Next.js 15.5.2 with App Router
- **UI Library**: Mantine 8.2.8 (ColorPicker, ColorSwatch, Slider components)
- **Color Manipulation**: chroma-js for advanced color operations and contrast calculations
- **TypeScript**: Full type safety with custom interfaces
- **File Handling**: Browser File API for downloads
- **State Management**: React hooks (useState, useEffect, useCallback)

## Usage Guide

### Getting Started
1. **Select Base Color**: Use the color picker or click on predefined swatches
2. **Choose Color Scheme**: Select from 6 different color harmony types
3. **Set Color Count**: Specify how many colors you want (2-12)
4. **View Results**: See your palette with color codes and accessibility data

### Understanding Color Schemes
- **Monochromatic**: Perfect for minimalist designs, uses variations of one color
- **Analogous**: Creates harmonious, natural-looking palettes
- **Complementary**: High contrast, great for call-to-action elements
- **Triadic**: Vibrant and balanced, good for dynamic designs
- **Tetradic**: Rich and diverse, suitable for complex interfaces
- **Split Complementary**: Softer than complementary but still high contrast

### Advanced Features
1. **Enable Advanced Options** to access:
   - Lightness range control (0-100%)
   - Saturation adjustment slider
2. **Random Generation**: Click "Random Color" for inspiration
3. **Accessibility Review**: Check the accessibility report table for WCAG compliance

### Exporting Your Palette
1. **Choose Export Format**: CSS, SCSS, JSON, or Tailwind
2. **Select Color Format**: HEX, RGB, HSL, RGBA, or HSLA
3. **Copy or Download**: Use the buttons to copy code or download files

## Accessibility Features

### WCAG Compliance Checking
The tool automatically calculates contrast ratios and provides compliance indicators:

- **Green Badges**: WCAG AA/AAA compliant
- **Red Badges**: Non-compliant ratios
- **Numerical Values**: Exact contrast ratios for precision

### Best Practices
- **Text on Light Backgrounds**: Use colors with good contrast against white
- **Text on Dark Backgrounds**: Ensure sufficient contrast against black
- **Large Text**: Lower contrast requirements (3:1 for AA, 4.5:1 for AAA)
- **UI Elements**: Consider contrast for buttons, borders, and interactive elements

## Integration with Dev Tools

This tool seamlessly integrates with the existing Dev Tools ecosystem:

- **Consistent UI**: Uses the same Mantine components and design system
- **Theme Support**: Respects light/dark mode preferences
- **File Processing**: Follows the same client-side processing approach
- **Navigation**: Integrated with the tool grid and routing system

## Privacy & Security

- **Client-Side Processing**: All color generation and analysis happens in your browser
- **No Data Transmission**: Colors and palettes never leave your device
- **Offline Capable**: Works without internet connection once loaded
- **No Tracking**: Zero analytics or user data collection

## Technical Implementation

### Color Generation Algorithm
```typescript
// Example: Generating analogous colors
const analogousHues = Array.from({ length: colorCount }, (_, i) => {
  const hueShift = (i - Math.floor(colorCount / 2)) * (60 / colorCount);
  return base.set('hsl.h', `+${hueShift}`);
});
```

### Contrast Calculation
```typescript
// WCAG contrast ratio calculation
const contrastWithWhite = chroma.contrast(color, 'white');
const wcagAACompliant = contrastWithWhite >= 4.5;
const wcagAAACompliant = contrastWithWhite >= 7;
```

### Export Generation
```typescript
// CSS Variables export
const cssCode = ':root {\n' + 
  palette.map((color, i) => `  --color-${i + 1}: ${color.hex};`).join('\n') + 
  '\n}';
```

## Performance Optimizations

- **Debounced Updates**: Palette regeneration is optimized with useCallback
- **Efficient Rendering**: Only affected components re-render on changes
- **Memory Management**: Proper cleanup of generated URLs and event listeners
- **Lazy Calculations**: Contrast ratios calculated only when needed

## Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Color Picker**: Native browser color picker with Mantine fallback
- **File Downloads**: Uses modern Blob API with wide browser support
- **Clipboard API**: Falls back gracefully on older browsers

## Future Enhancements

- **Color Blindness Simulation**: Preview palettes as seen by colorblind users
- **Saved Palettes**: Local storage for favorite color combinations
- **Palette History**: Undo/redo functionality for color changes
- **Brand Color Integration**: Import existing brand colors as base
- **Advanced Harmony**: Additional color harmony algorithms
- **Gradient Generation**: Create smooth gradients from palette colors

## Contributing

This tool is part of the Dev Tools collection. Follow the established patterns:

1. **Component Structure**: Main tool component + page wrapper + README
2. **Type Safety**: Use TypeScript interfaces for all data structures
3. **Error Handling**: Graceful degradation and user feedback
4. **Testing**: Comprehensive coverage of color generation algorithms
5. **Documentation**: Keep this README updated with new features