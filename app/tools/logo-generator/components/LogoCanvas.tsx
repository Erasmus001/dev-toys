'use client';

import { forwardRef } from 'react';
import { Card, Flex, Box } from '@mantine/core';
import { LogoConfig } from '../types';

interface LogoCanvasProps {
  config: LogoConfig;
}

export const LogoCanvas = forwardRef<HTMLDivElement, LogoCanvasProps>(
  ({ config }, ref) => {
    const getBackgroundStyle = (): React.CSSProperties => {
      if (config.backgroundType === 'solid') {
        return { backgroundColor: config.backgroundColor };
      } else {
        return {
          background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`,
        };
      }
    };

    return (
      <Card withBorder>
        <Flex justify="center" align="center" style={{ minHeight: 500 }}>
          <Box
            ref={ref}
            style={{
              width: config.canvasSize,
              height: config.canvasSize,
              borderRadius: config.borderRadius,
              border: config.borderWidth > 0 ? `${config.borderWidth}px solid ${config.borderColor}` : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              ...getBackgroundStyle(),
            }}
          >
            <config.selectedIcon
              size={config.size}
              color={config.fillColor}
              style={{
                transform: `rotate(${config.rotation}deg)`,
                opacity: config.fillOpacity / 100,
              }}
            />
          </Box>
        </Flex>
      </Card>
    );
  }
);

LogoCanvas.displayName = 'LogoCanvas';