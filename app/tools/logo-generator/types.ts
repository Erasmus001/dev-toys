// Types
export type BackgroundType = 'solid' | 'gradient';

export interface LogoConfig {
  selectedIcon: any;
  iconName: string;
  backgroundType: BackgroundType;
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  size: number;
  rotation: number;
  borderWidth: number;
  borderColor: string;
  fillOpacity: number;
  fillColor: string;
  canvasSize: number;
  borderRadius: number;
}