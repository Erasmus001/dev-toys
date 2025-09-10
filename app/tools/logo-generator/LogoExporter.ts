import html2canvas from 'html2canvas';
import { notifications } from '@mantine/notifications';
import { LogoConfig } from './types';

export class LogoExporter {
  private config: LogoConfig;
  private canvasRef: React.RefObject<HTMLDivElement | null>;

  constructor(config: LogoConfig, canvasRef: React.RefObject<HTMLDivElement | null>) {
    this.config = config;
    this.canvasRef = canvasRef;
  }

  private async captureLogoAsCanvas(): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      if (!this.canvasRef.current) {
        reject(new Error('Canvas reference not found'));
        return;
      }

      // Use html2canvas to capture the actual rendered component
      html2canvas(this.canvasRef.current, {
        useCORS: true,
        allowTaint: true,
      } as any)
        .then((canvas) => {
          resolve(canvas);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async exportAsPNG(): Promise<void> {
    try {
      const canvas = await this.captureLogoAsCanvas();
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `logo-${this.config.iconName.toLowerCase()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          notifications.show({
            title: 'Export Complete',
            message: 'Logo exported as PNG',
            color: 'green',
          });
        }
      }, 'image/png');
    } catch (error) {
      notifications.show({
        title: 'Export Failed',
        message: 'Failed to export PNG',
        color: 'red',
      });
    }
  }

  async exportAsJPEG(): Promise<void> {
    try {
      const canvas = await this.captureLogoAsCanvas();
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `logo-${this.config.iconName.toLowerCase()}.jpeg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          notifications.show({
            title: 'Export Complete',
            message: 'Logo exported as JPEG',
            color: 'green',
          });
        }
      }, 'image/jpeg', 0.9);
    } catch (error) {
      notifications.show({
        title: 'Export Failed',
        message: 'Failed to export JPEG',
        color: 'red',
      });
    }
  }

  exportAsSVG(): void {
    const svgContent = `
      <svg width="${this.config.canvasSize}" height="${this.config.canvasSize}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          ${this.config.backgroundType === 'gradient' ? `
            <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${this.config.gradientFrom}" />
              <stop offset="100%" stop-color="${this.config.gradientTo}" />
            </linearGradient>
          ` : ''}
        </defs>
        <rect 
          width="100%" 
          height="100%" 
          rx="${this.config.borderRadius}"
          fill="${this.config.backgroundType === 'gradient' ? 'url(#bg-gradient)' : this.config.backgroundColor}"
          ${this.config.borderWidth > 0 ? `stroke="${this.config.borderColor}" stroke-width="${this.config.borderWidth}"` : ''}
        />
        <text 
          x="50%" 
          y="50%" 
          text-anchor="middle" 
          dominant-baseline="central"
          font-size="${this.config.size/3}"
          fill="${this.config.fillColor}"
          opacity="${this.config.fillOpacity / 100}"
          transform="rotate(${this.config.rotation} ${this.config.canvasSize/2} ${this.config.canvasSize/2})"
        >
          ${this.config.iconName}
        </text>
      </svg>
    `;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logo-${this.config.iconName.toLowerCase()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    notifications.show({
      title: 'Export Complete',
      message: 'Logo exported as SVG',
      color: 'green',
    });
  }

  async exportAsFavicon(): Promise<void> {
    try {
      const canvas = await this.captureLogoAsCanvas();
      
      // Create a 32x32 favicon canvas
      const faviconCanvas = document.createElement('canvas');
      const faviconCtx = faviconCanvas.getContext('2d')!;
      faviconCanvas.width = 32;
      faviconCanvas.height = 32;
      
      // Draw the logo scaled down to 32x32
      faviconCtx.drawImage(canvas, 0, 0, 32, 32);
      
      faviconCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `favicon-${this.config.iconName.toLowerCase()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          notifications.show({
            title: 'Export Complete',
            message: 'Favicon exported as PNG (32x32)',
            color: 'green',
          });
        }
      }, 'image/png');
    } catch (error) {
      notifications.show({
        title: 'Export Failed',
        message: 'Failed to export Favicon',
        color: 'red',
      });
    }
  }
}