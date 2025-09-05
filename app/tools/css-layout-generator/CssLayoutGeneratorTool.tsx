"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Stack,
  Group,
  Paper,
  Title,
  Text,
  Tabs,
  Grid,
  Card,
  Button,
  Select,
  NumberInput,
  Textarea,
  CopyButton,
  Alert,
  ActionIcon,
  Tooltip,
  Box,
  ColorPicker,
  Divider,
  Code,
  ScrollArea,
} from "@mantine/core";
import {
  IconLayout,
  IconCopy,
  IconDownload,
  IconCheck,
  IconInfoCircle,
  IconPlus,
  IconMinus,
  IconRefresh,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import {
  CssLayoutGeneratorState,
  LayoutType,
  FlexboxConfig,
  GridConfig,
  LayoutChild,
  ExportFormat,
  FlexDirection,
  JustifyContent,
  AlignItems,
  FlexWrap,
  JustifyItems,
  GridAlignItems,
} from "../../lib/types";

// Tailwind mapping constants
const TAILWIND_MAPPING = {
  flexbox: {
    direction: {
      row: "flex-row",
      "row-reverse": "flex-row-reverse",
      column: "flex-col",
      "column-reverse": "flex-col-reverse",
    },
    justifyContent: {
      "flex-start": "justify-start",
      "flex-end": "justify-end",
      center: "justify-center",
      "space-between": "justify-between",
      "space-around": "justify-around",
      "space-evenly": "justify-evenly",
    },
    alignItems: {
      stretch: "items-stretch",
      "flex-start": "items-start",
      "flex-end": "items-end",
      center: "items-center",
      baseline: "items-baseline",
    },
    wrap: {
      nowrap: "flex-nowrap",
      wrap: "flex-wrap",
      "wrap-reverse": "flex-wrap-reverse",
    },
  },
  grid: {
    templateColumns: {
      "1": "grid-cols-1",
      "2": "grid-cols-2",
      "3": "grid-cols-3",
      "4": "grid-cols-4",
      "5": "grid-cols-5",
      "6": "grid-cols-6",
      "12": "grid-cols-12",
    },
    justifyItems: {
      stretch: "justify-items-stretch",
      start: "justify-items-start",
      end: "justify-items-end",
      center: "justify-items-center",
    },
    alignItems: {
      stretch: "items-stretch",
      start: "items-start",
      end: "items-end",
      center: "items-center",
      baseline: "items-baseline",
    },
  },
  gap: {
    0: "gap-0",
    4: "gap-1",
    8: "gap-2",
    12: "gap-3",
    16: "gap-4",
    20: "gap-5",
    24: "gap-6",
    32: "gap-8",
    40: "gap-10",
    48: "gap-12",
  },
};

const DEFAULT_FLEXBOX_CONFIG: FlexboxConfig = {
  direction: "row",
  justifyContent: "flex-start",
  alignItems: "stretch",
  gap: 16,
  wrap: "nowrap",
};

const DEFAULT_GRID_CONFIG: GridConfig = {
  templateColumns: "repeat(3, 1fr)",
  templateRows: "auto",
  gap: 16,
  justifyItems: "stretch",
  alignItems: "stretch",
  justifyContent: "start",
  alignContent: "start",
};

const DEFAULT_CHILDREN: LayoutChild[] = [
  {
    id: "1",
    content: "Item 1",
    backgroundColor: "#3b82f6",
    textColor: "#ffffff",
    padding: 16,
    margin: 0,
  },
  {
    id: "2",
    content: "Item 2",
    backgroundColor: "#10b981",
    textColor: "#ffffff",
    padding: 16,
    margin: 0,
  },
  {
    id: "3",
    content: "Item 3",
    backgroundColor: "#f59e0b",
    textColor: "#ffffff",
    padding: 16,
    margin: 0,
  },
];

export default function CssLayoutGeneratorTool() {
  const [state, setState] = useState<CssLayoutGeneratorState>({
    layoutType: 'flexbox',
    flexboxConfig: DEFAULT_FLEXBOX_CONFIG,
    gridConfig: DEFAULT_GRID_CONFIG,
    children: DEFAULT_CHILDREN,
    exportFormat: 'css',
    colorFormat: 'hex',
    generatedCode: { css: '', scss: '', tailwind: '', cssVariables: '', html: '' }, // Will be overridden by useMemo
    showPreview: true,
    previewBreakpoint: 'md',
    accessibilityReport: { hasMinimumGap: true, hasSufficientSpacing: true, hasAccessibleContrast: true, recommendations: [], wcagLevel: 'AA' }
  });

  // Generate CSS styles for preview
  const generatePreviewStyles = useCallback(
    (config: FlexboxConfig | GridConfig, layoutType: LayoutType) => {
      if (layoutType === "flexbox") {
        const flexConfig = config as FlexboxConfig;

        return {
          display: "flex",
          flexDirection: flexConfig.direction,
          justifyContent: flexConfig.justifyContent,
          alignItems: flexConfig.alignItems,
          gap: `${flexConfig.gap}px`,
          flexWrap: flexConfig.wrap,
          minHeight: "200px",
          border: "2px dashed var(--mantine-color-gray-4)",
          borderRadius: "8px",
          padding: "16px",
        };
      } else {
        const gridConfig = config as GridConfig;

        return {
          display: "grid",
          gridTemplateColumns: gridConfig.templateColumns,
          gridTemplateRows: gridConfig.templateRows,
          gap: `${gridConfig.gap}px`,
          justifyItems: gridConfig.justifyItems,
          alignItems: gridConfig.alignItems,
          minHeight: "200px",
          border: "2px dashed var(--mantine-color-gray-4)",
          borderRadius: "8px",
          padding: "16px",
        };
      }
    },
    []
  );

  // Generate code based on current configuration
  const generateCode = useCallback(() => {
    const config =
      state.layoutType === "flexbox" ? state.flexboxConfig : state.gridConfig;
    let css = "";
    let tailwind = "";

    // Generate CSS
    css += ".container {\n";
    
    if (state.layoutType === "flexbox") {
      const flexConfig = config as FlexboxConfig;
      css += `  display: flex;\n  flex-direction: ${flexConfig.direction};\n  justify-content: ${flexConfig.justifyContent};\n`;
      css += `  align-items: ${flexConfig.alignItems};\n  gap: ${flexConfig.gap}px;\n  flex-wrap: ${flexConfig.wrap};\n`;
    } else {
      const gridConfig = config as GridConfig;
      css += `  display: grid;\n  grid-template-columns: ${gridConfig.templateColumns};\n  grid-template-rows: ${gridConfig.templateRows};\n`;
      css += `  gap: ${gridConfig.gap}px;\n  justify-items: ${gridConfig.justifyItems};\n  align-items: ${gridConfig.alignItems};\n`;
    }
    css += "}\n\n";

    // Add child styles
    state.children.forEach((child, index) => {
      css += `.item-${index + 1} {\n  background-color: ${
        child.backgroundColor
      };\n  color: ${child.textColor};\n`;
      css += `  padding: ${child.padding}px;\n  margin: ${child.margin}px;\n}\n\n`;
    });

    // Generate Tailwind classes
    const tailwindClasses = [];
    if (state.layoutType === "flexbox") {
      const flexConfig = config as FlexboxConfig;
      tailwindClasses.push("flex");
      tailwindClasses.push(
        TAILWIND_MAPPING.flexbox.direction[flexConfig.direction] || "flex-row"
      );
      tailwindClasses.push(
        TAILWIND_MAPPING.flexbox.justifyContent[flexConfig.justifyContent] ||
          "justify-start"
      );
      tailwindClasses.push(
        TAILWIND_MAPPING.flexbox.alignItems[flexConfig.alignItems] ||
          "items-stretch"
      );
      tailwindClasses.push(
        TAILWIND_MAPPING.flexbox.wrap[flexConfig.wrap] || "flex-nowrap"
      );
      const gapClass =
        Object.entries(TAILWIND_MAPPING.gap).find(
          ([pixels]) => parseInt(pixels) === flexConfig.gap
        )?.[1] || "gap-4";
      tailwindClasses.push(gapClass);
    } else {
      const gridConfig = config as GridConfig;
      tailwindClasses.push("grid");
      const colsMatch = gridConfig.templateColumns.match(/repeat\((\d+),/);
      if (colsMatch) {
        const cols =
          colsMatch[1] as keyof typeof TAILWIND_MAPPING.grid.templateColumns;
        tailwindClasses.push(
          TAILWIND_MAPPING.grid.templateColumns[cols] || "grid-cols-3"
        );
      }
      tailwindClasses.push(
        TAILWIND_MAPPING.grid.justifyItems[gridConfig.justifyItems] ||
          "justify-items-stretch"
      );
      const gapClass =
        Object.entries(TAILWIND_MAPPING.gap).find(
          ([pixels]) => parseInt(pixels) === gridConfig.gap
        )?.[1] || "gap-4";
      tailwindClasses.push(gapClass);
    }

    tailwind = `<!-- Container classes -->\n<div class="${tailwindClasses.join(
      " "
    )}">\n`;
    state.children.forEach((child) => {
      tailwind += `  <div class="bg-blue-500 text-white p-4">${child.content}</div>\n`;
    });
    tailwind += "</div>";

    const cssVariables = css.replace(
      /gap: \d+px/g,
      "gap: var(--container-gap)"
    );
    const html = `<div class="container">\n${state.children
      .map(
        (child, index) =>
          `  <div class="item-${index + 1}">${child.content}</div>`
      )
      .join("\n")}\n</div>`;

    return { css, scss: css, tailwind, cssVariables, html };
  }, [state]);

  // Generate code on-demand instead of storing it in state
  const generatedCode = useMemo(() => {
    const config =
      state.layoutType === "flexbox" ? state.flexboxConfig : state.gridConfig;
    let css = "";
    let tailwind = "";

    // Generate CSS
    css += ".container {\n";
    
    if (state.layoutType === "flexbox") {
      const flexConfig = config as FlexboxConfig;
      css += `  display: flex;\n  flex-direction: ${flexConfig.direction};\n  justify-content: ${flexConfig.justifyContent};\n`;
      css += `  align-items: ${flexConfig.alignItems};\n  gap: ${flexConfig.gap}px;\n  flex-wrap: ${flexConfig.wrap};\n`;
    } else {
      const gridConfig = config as GridConfig;
      css += `  display: grid;\n  grid-template-columns: ${gridConfig.templateColumns};\n  grid-template-rows: ${gridConfig.templateRows};\n`;
      css += `  gap: ${gridConfig.gap}px;\n  justify-items: ${gridConfig.justifyItems};\n  align-items: ${gridConfig.alignItems};\n`;
    }
    css += "}\n\n";

    // Add child styles
    state.children.forEach((child, index) => {
      css += `.item-${index + 1} {\n  background-color: ${
        child.backgroundColor
      };\n  color: ${child.textColor};\n`;
      css += `  padding: ${child.padding}px;\n  margin: ${child.margin}px;\n}\n\n`;
    });

    // Generate Tailwind classes
    const tailwindClasses = [];
    if (state.layoutType === "flexbox") {
      const flexConfig = config as FlexboxConfig;
      tailwindClasses.push("flex");
      tailwindClasses.push(
        TAILWIND_MAPPING.flexbox.direction[flexConfig.direction] || "flex-row"
      );
      tailwindClasses.push(
        TAILWIND_MAPPING.flexbox.justifyContent[flexConfig.justifyContent] ||
          "justify-start"
      );
      tailwindClasses.push(
        TAILWIND_MAPPING.flexbox.alignItems[flexConfig.alignItems] ||
          "items-stretch"
      );
      tailwindClasses.push(
        TAILWIND_MAPPING.flexbox.wrap[flexConfig.wrap] || "flex-nowrap"
      );
      const gapClass =
        Object.entries(TAILWIND_MAPPING.gap).find(
          ([pixels]) => parseInt(pixels) === flexConfig.gap
        )?.[1] || "gap-4";
      tailwindClasses.push(gapClass);
    } else {
      const gridConfig = config as GridConfig;
      tailwindClasses.push("grid");
      const colsMatch = gridConfig.templateColumns.match(/repeat\((\d+),/);
      if (colsMatch) {
        const cols =
          colsMatch[1] as keyof typeof TAILWIND_MAPPING.grid.templateColumns;
        tailwindClasses.push(
          TAILWIND_MAPPING.grid.templateColumns[cols] || "grid-cols-3"
        );
      }
      tailwindClasses.push(
        TAILWIND_MAPPING.grid.justifyItems[gridConfig.justifyItems] ||
          "justify-items-stretch"
      );
      const gapClass =
        Object.entries(TAILWIND_MAPPING.gap).find(
          ([pixels]) => parseInt(pixels) === gridConfig.gap
        )?.[1] || "gap-4";
      tailwindClasses.push(gapClass);
    }

    tailwind = `<!-- Container classes -->\n<div class="${tailwindClasses.join(
      " "
    )}">\n`;
    state.children.forEach((child) => {
      tailwind += `  <div class="bg-blue-500 text-white p-4">${child.content}</div>\n`;
    });
    tailwind += "</div>";

    const cssVariables = css.replace(
      /gap: \d+px/g,
      "gap: var(--container-gap)"
    );
    const html = `<div class="container">\n${state.children
      .map(
        (child, index) =>
          `  <div class="item-${index + 1}">${child.content}</div>`
      )
      .join("\n")}\n</div>`;

    return { css, scss: css, tailwind, cssVariables, html };
  }, [state.layoutType, state.flexboxConfig, state.gridConfig, state.children]);

  // Handle configuration updates
  const updateFlexboxConfig = (updates: Partial<FlexboxConfig>) => {
    setState((prev) => ({
      ...prev,
      flexboxConfig: { ...prev.flexboxConfig, ...updates },
    }));
  };

  const updateGridConfig = (updates: Partial<GridConfig>) => {
    setState((prev) => ({
      ...prev,
      gridConfig: { ...prev.gridConfig, ...updates },
    }));
  };

  const updateChild = (index: number, updates: Partial<LayoutChild>) => {
    setState((prev) => ({
      ...prev,
      children: prev.children.map((child, i) =>
        i === index ? { ...child, ...updates } : child
      ),
    }));
  };

  const addChild = () => {
    const newChild: LayoutChild = {
      id: (state.children.length + 1).toString(),
      content: `Item ${state.children.length + 1}`,
      backgroundColor: "#6366f1",
      textColor: "#ffffff",
      padding: 16,
      margin: 0,
    };
    setState((prev) => ({ ...prev, children: [...prev.children, newChild] }));
  };

  const removeChild = (index: number) => {
    if (state.children.length > 1) {
      setState((prev) => ({
        ...prev,
        children: prev.children.filter((_, i) => i !== index),
      }));
    }
  };

  const downloadCode = (code: string, format: ExportFormat) => {
    const extensions = {
      css: "css",
      scss: "scss",
      tailwind: "html",
      "css-variables": "css",
    };
    const extension = extensions[format];
    const filename = `layout.${extension}`;
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notifications.show({
      title: "Downloaded!",
      message: `Layout exported as ${filename}`,
      color: "green",
      icon: <IconDownload size={16} />,
    });
  };

  const previewStyles = useMemo(
    () =>
      generatePreviewStyles(
        state.layoutType === "flexbox" ? state.flexboxConfig : state.gridConfig,
        state.layoutType
      ),
    [
      generatePreviewStyles,
      state.layoutType,
      state.flexboxConfig,
      state.gridConfig,
    ]
  );

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>CSS Layout Generator</Title>
          <Text c="dimmed">
            Generate Flexbox and Grid layouts with Tailwind support
          </Text>
        </div>
        <Button
          leftSection={<IconRefresh size={16} />}
          variant="light"
          onClick={() =>
            setState((prev) => ({
              ...prev,
              flexboxConfig: DEFAULT_FLEXBOX_CONFIG,
              gridConfig: DEFAULT_GRID_CONFIG,
              children: DEFAULT_CHILDREN,
            }))
          }
        >
          Reset
        </Button>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack gap="md">
            <Card withBorder>
              <Stack gap="md">
                <Title order={4}>Layout Configuration</Title>

                <Tabs
                  value={state.layoutType}
                  onChange={(value) =>
                    setState((prev) => ({
                      ...prev,
                      layoutType: value as LayoutType,
                    }))
                  }
                >
                  <Tabs.List>
                    <Tabs.Tab
                      value="flexbox"
                      leftSection={<IconLayout size={16} />}
                    >
                      Flexbox
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="grid"
                      leftSection={<IconLayout size={16} />}
                    >
                      Grid
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs>

                <Divider />

                {state.layoutType === "flexbox" && (
                  <Stack gap="sm">
                    <Select
                      label="Flex Direction"
                      value={state.flexboxConfig.direction}
                      onChange={(value) =>
                        updateFlexboxConfig({
                          direction: value as FlexDirection,
                        })
                      }
                      data={[
                        { value: "row", label: "Row" },
                        { value: "row-reverse", label: "Row Reverse" },
                        { value: "column", label: "Column" },
                        { value: "column-reverse", label: "Column Reverse" },
                      ]}
                    />

                    <Select
                      label="Justify Content"
                      value={state.flexboxConfig.justifyContent}
                      onChange={(value) =>
                        updateFlexboxConfig({
                          justifyContent: value as JustifyContent,
                        })
                      }
                      data={[
                        { value: "flex-start", label: "Flex Start" },
                        { value: "flex-end", label: "Flex End" },
                        { value: "center", label: "Center" },
                        { value: "space-between", label: "Space Between" },
                        { value: "space-around", label: "Space Around" },
                        { value: "space-evenly", label: "Space Evenly" },
                      ]}
                    />

                    <Select
                      label="Align Items"
                      value={state.flexboxConfig.alignItems}
                      onChange={(value) =>
                        updateFlexboxConfig({ alignItems: value as AlignItems })
                      }
                      data={[
                        { value: "stretch", label: "Stretch" },
                        { value: "flex-start", label: "Flex Start" },
                        { value: "flex-end", label: "Flex End" },
                        { value: "center", label: "Center" },
                        { value: "baseline", label: "Baseline" },
                      ]}
                    />

                    <Select
                      label="Flex Wrap"
                      value={state.flexboxConfig.wrap}
                      onChange={(value) =>
                        updateFlexboxConfig({ wrap: value as FlexWrap })
                      }
                      data={[
                        { value: "nowrap", label: "No Wrap" },
                        { value: "wrap", label: "Wrap" },
                        { value: "wrap-reverse", label: "Wrap Reverse" },
                      ]}
                    />

                    <NumberInput
                      label="Gap (px)"
                      value={state.flexboxConfig.gap}
                      onChange={(value) =>
                        updateFlexboxConfig({ gap: Number(value) || 0 })
                      }
                      min={0}
                      max={100}
                      step={4}
                    />
                  </Stack>
                )}

                {state.layoutType === "grid" && (
                  <Stack gap="sm">
                    <Select
                      label="Template Columns"
                      value={state.gridConfig.templateColumns}
                      onChange={(value) =>
                        updateGridConfig({
                          templateColumns: value || "repeat(3, 1fr)",
                        })
                      }
                      data={[
                        { value: "repeat(1, 1fr)", label: "1 Column" },
                        { value: "repeat(2, 1fr)", label: "2 Columns" },
                        { value: "repeat(3, 1fr)", label: "3 Columns" },
                        { value: "repeat(4, 1fr)", label: "4 Columns" },
                        { value: "repeat(6, 1fr)", label: "6 Columns" },
                        { value: "1fr 2fr 1fr", label: "1fr 2fr 1fr" },
                      ]}
                    />

                    <Select
                      label="Template Rows"
                      value={state.gridConfig.templateRows}
                      onChange={(value) =>
                        updateGridConfig({ templateRows: value || "auto" })
                      }
                      data={[
                        { value: "auto", label: "Auto" },
                        { value: "repeat(2, 1fr)", label: "2 Rows" },
                        { value: "repeat(3, 1fr)", label: "3 Rows" },
                      ]}
                    />

                    <Select
                      label="Justify Items"
                      value={state.gridConfig.justifyItems}
                      onChange={(value) =>
                        updateGridConfig({
                          justifyItems: value as JustifyItems,
                        })
                      }
                      data={[
                        { value: "stretch", label: "Stretch" },
                        { value: "start", label: "Start" },
                        { value: "end", label: "End" },
                        { value: "center", label: "Center" },
                      ]}
                    />

                    <NumberInput
                      label="Gap (px)"
                      value={state.gridConfig.gap}
                      onChange={(value) =>
                        updateGridConfig({ gap: Number(value) || 0 })
                      }
                      min={0}
                      max={100}
                      step={4}
                    />
                  </Stack>
                )}
              </Stack>
            </Card>

            <Card withBorder>
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={4}>Child Elements</Title>
                  <ActionIcon
                    variant="light"
                    color="green"
                    onClick={addChild}
                    disabled={state.children.length >= 8}
                  >
                    <IconPlus size={16} />
                  </ActionIcon>
                </Group>

                <Stack gap="xs">
                  {state.children.map((child, index) => (
                    <Group key={child.id} gap="xs">
                      <Text size="xs" w={60}>
                        Item {index + 1}
                      </Text>
                      <ColorPicker
                        size="xs"
                        format="hex"
                        value={child.backgroundColor}
                        onChange={(color) =>
                          updateChild(index, { backgroundColor: color })
                        }
                        swatches={[
                          "#3b82f6",
                          "#10b981",
                          "#f59e0b",
                          "#ef4444",
                          "#8b5cf6",
                          "#06b6d4",
                        ]}
                      />
                      <ActionIcon
                        variant="light"
                        color="red"
                        size="sm"
                        onClick={() => removeChild(index)}
                        disabled={state.children.length <= 1}
                      >
                        <IconMinus size={12} />
                      </ActionIcon>
                    </Group>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Stack gap="md">
            <Card withBorder>
              <Stack gap="md">
                <Title order={4}>Live Preview</Title>
                <Box style={previewStyles}>
                  {state.children.map((child) => (
                    <Box
                      key={child.id}
                      style={{
                        backgroundColor: child.backgroundColor,
                        color: child.textColor,
                        padding: `${child.padding}px`,
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "60px",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      {child.content}
                    </Box>
                  ))}
                </Box>
              </Stack>
            </Card>

            <Card withBorder>
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={4}>Generated Code</Title>
                  <Select
                    value={state.exportFormat}
                    onChange={(value) =>
                      setState((prev) => ({
                        ...prev,
                        exportFormat: value as ExportFormat,
                      }))
                    }
                    data={[
                      { value: "css", label: "CSS" },
                      { value: "scss", label: "SCSS" },
                      { value: "tailwind", label: "Tailwind" },
                      { value: "css-variables", label: "CSS Variables" },
                    ]}
                    size="sm"
                    w={140}
                  />
                </Group>

                <ScrollArea.Autosize mah={300}>
                  <Code block>
                    {
                      generatedCode[
                        state.exportFormat === "css-variables"
                          ? "cssVariables"
                          : state.exportFormat
                      ]
                    }
                  </Code>
                </ScrollArea.Autosize>

                <Group>
                  <CopyButton
                    value={
                      generatedCode[
                        state.exportFormat === "css-variables"
                          ? "cssVariables"
                          : state.exportFormat
                      ]
                    }
                  >
                    {({ copied, copy }) => (
                      <Button
                        leftSection={<IconCopy size={16} />}
                        variant={copied ? "light" : "filled"}
                        color={copied ? "teal" : "blue"}
                        onClick={copy}
                      >
                        {copied ? "Copied!" : "Copy Code"}
                      </Button>
                    )}
                  </CopyButton>
                  <Button
                    leftSection={<IconDownload size={16} />}
                    variant="outline"
                    onClick={() =>
                      downloadCode(
                        generatedCode[
                          state.exportFormat === "css-variables"
                            ? "cssVariables"
                            : state.exportFormat
                        ],
                        state.exportFormat
                      )
                    }
                  >
                    Download
                  </Button>
                </Group>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>

      <Alert
        icon={<IconInfoCircle size={16} />}
        title="About CSS Layouts"
        color="blue"
      >
        <Text size="sm">
          <strong>Flexbox</strong> is ideal for one-dimensional layouts and
          content-based sizing.
          <strong> Grid</strong> is perfect for two-dimensional layouts with
          precise control over rows and columns. Both support responsive design
          patterns and accessibility best practices.
        </Text>
      </Alert>
    </Stack>
  );
}
