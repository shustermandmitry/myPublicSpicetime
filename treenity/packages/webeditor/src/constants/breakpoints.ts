export const BREAKPOINTS = {
  sm: '480px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1400px',
} as const;

export const screenSizesMap: Record<keyof typeof BREAKPOINTS, string> = {
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  xl: 'Extra Large',
  xxl: 'Extra Extra Large',
};

export const sizeBreakpointsInPixels = Object.fromEntries(
  Object.entries(BREAKPOINTS).map(([key, value]) => [key, +value.split('px')[0]]),
) as Record<ScreenSize, number>;

export const DEFAULT_SCREEN_SIZE = 'lg' as const;
export const screenSizes = Object.keys(BREAKPOINTS) as ScreenSize[];

export type ScreenSize = keyof typeof BREAKPOINTS;

export type MetaScreenSizes = `$:${ScreenSize}`;

export const metaScreenSizes = screenSizes.map(
  screenSize => `$:${screenSize}`,
) as MetaScreenSizes[];

export type SizeWidth = (keyof typeof BREAKPOINTS)[number];
